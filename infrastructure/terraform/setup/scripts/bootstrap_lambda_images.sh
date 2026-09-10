#!/usr/bin/env bash
set -euo pipefail

: "${AWS_REGION:?}" "${AWS_ACCOUNT_ID:?}"
registry="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
script_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
error_file=$(mktemp)
trap 'rm -f "$error_file"' EXIT
built=false

for output in batch backend_lambda auth_lambda users_lambda; do
  repository_url=$(terraform output -raw "repo_url_$output")
  parameter_name=$(terraform output -raw "ssm_repo_url_$output")
  if [[ "$repository_url" != "$registry/"* ]]; then
    echo "::error::Unexpected ECR account or region for $output" >&2
    exit 1
  fi
  repository_name=${repository_url#"$registry/"}
  image_uri=$(aws ssm get-parameter --name "$parameter_name" --query Parameter.Value --output text)

  case "$image_uri" in
    "$repository_url"@sha256:*) image_id="imageDigest=${image_uri#"$repository_url"@}" ;;
    "$repository_url":*) image_id="imageTag=${image_uri#"$repository_url":}" ;;
    *) echo "::error::Unexpected image URI in $parameter_name" >&2; exit 1 ;;
  esac

  if aws ecr describe-images --repository-name "$repository_name" --image-ids "$image_id" > /dev/null 2> "$error_file"; then
    echo "$output: referenced image exists; keeping it"
    continue
  elif ! grep -q '(ImageNotFoundException)' "$error_file"; then
    cat "$error_file" >&2
    exit 1
  fi

  if [[ "$built" == false ]]; then
    aws ecr get-login-password --region "$AWS_REGION" | docker login --username AWS --password-stdin "$registry"
    docker build --platform linux/amd64 --provenance=false --tag pocket-cards-lambda-bootstrap "$script_dir/../lambda_default"
    built=true
  fi

  # Never put a placeholder under a missing application commit tag.
  docker tag pocket-cards-lambda-bootstrap "$repository_url:bootstrap"
  docker push "$repository_url:bootstrap"
  digest=$(aws ecr describe-images --repository-name "$repository_name" --image-ids imageTag=bootstrap \
    --query 'imageDetails[0].imageDigest' --output text)
  if [[ ! "$digest" =~ ^sha256:[0-9a-f]{64}$ ]]; then
    echo "::error::ECR did not return a valid image digest for $output" >&2
    exit 1
  fi

  # A build may have published an application image while the default was uploading.
  current_uri=$(aws ssm get-parameter --name "$parameter_name" --query Parameter.Value --output text)
  if [[ "$current_uri" != "$image_uri" ]]; then
    echo "$output: image parameter changed; keeping the newer value"
    continue
  fi
  aws ssm put-parameter --name "$parameter_name" --type String --value "$repository_url@$digest" --overwrite
  echo "$output: default Lambda image registered"
done
