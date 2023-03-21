curl -H "Authorization: $AWS_CONTAINER_AUTHORIZATION_TOKEN" $AWS_CONTAINER_CREDENTIALS_FULL_URI 2>/dev/null > /tmp/credentials

export AWS_ACCESS_KEY_ID=`cat /tmp/credentials | jq -r .AccessKeyId`
export AWS_SECRET_ACCESS_KEY=`cat /tmp/credentials | jq -r .SecretAccessKey`
export AWS_SESSION_TOKEN=`cat /tmp/credentials | jq -r .Token`
