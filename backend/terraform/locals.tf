locals {
  # ----------------------------------------------------------------------------------------------
  # Environment
  # ----------------------------------------------------------------------------------------------
  remote_setup    = data.terraform_remote_state.setup.outputs
  remote_services = data.terraform_remote_state.services.outputs

  # ----------------------------------------------------------------------------------------------
  # Project Informations
  # ----------------------------------------------------------------------------------------------
  # domain_name     = data.aws_route53_zone.this.name
  project_name    = local.remote_setup.project_name
  project_name_uc = local.remote_setup.project_name_uc

  # ----------------------------------------------------------------------------------------------
  # ECS
  # ----------------------------------------------------------------------------------------------
  ecs_cluster_name = local.remote_services.ecs_cluster_name
  ecs_service_name = local.remote_services.ecs_service_name

  # ----------------------------------------------------------------------------------------------
  # Lambda
  # ----------------------------------------------------------------------------------------------
  lambda_handler          = "index.handler"
  lambda_runtime          = "nodejs14.x"
  lambda_basic_policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"

  # ----------------------------------------------------------------------------------------------
  # DynamoDB
  # ----------------------------------------------------------------------------------------------
  dynamodb_name_users       = local.remote_setup.dynamodb_name_users
  dynamodb_name_groups      = local.remote_setup.dynamodb_name_groups
  dynamodb_name_words       = local.remote_setup.dynamodb_name_words
  dynamodb_name_word_master = local.remote_setup.dynamodb_name_word_master
  dynamodb_name_word_ignore = local.remote_setup.dynamodb_name_word_ignore
  dynamodb_name_histories   = local.remote_setup.dynamodb_name_histories

  # ----------------------------------------------------------------------------------------------
  # API Gateway
  # ----------------------------------------------------------------------------------------------
  api_gateway_id_admin            = local.remote_services.api_gateway_id_admin
  api_gateway_authorizer_id_admin = local.remote_services.api_gateway_authorizer_id_admin

  # ----------------------------------------------------------------------------------------------
  # S3
  # ----------------------------------------------------------------------------------------------
  bucket_name_archive  = local.remote_setup.bucket_name_archive
  bucket_name_frontend = local.remote_setup.bucket_name_frontend

  # ----------------------------------------------------------------------------------------------
  # SSM
  # ----------------------------------------------------------------------------------------------
  ssm_ipa_api_url         = local.remote_setup.ssm_ipa_api_url
  ssm_ipa_api_key         = local.remote_setup.ssm_ipa_api_key
  ssm_translation_api_url = local.remote_setup.ssm_translation_api_url
  ssm_translation_api_key = local.remote_setup.ssm_translation_api_key
  ssm_vision_api_url      = local.remote_setup.ssm_vision_api_url
  ssm_vision_api_key      = local.remote_setup.ssm_vision_api_key
}

# ----------------------------------------------------------------------------------------------
# ECS Cluster
# ----------------------------------------------------------------------------------------------
data "aws_ecs_cluster" "this" {
  cluster_name = local.ecs_cluster_name
}

# ----------------------------------------------------------------------------------------------
# ECS Service
# ----------------------------------------------------------------------------------------------
data "aws_ecs_service" "this" {
  cluster_arn  = data.aws_ecs_cluster.this.arn
  service_name = local.ecs_service_name
}

# ----------------------------------------------------------------------------------------------
# APIGateway - Admin
# ----------------------------------------------------------------------------------------------
data "aws_apigatewayv2_api" "admin" {
  api_id = local.api_gateway_id_admin
}

# ----------------------------------------------------------------------------------------------
# SSM Parameter - IPA URL
# ----------------------------------------------------------------------------------------------
data "aws_ssm_parameter" "ipa_api_url" {
  name            = local.ssm_ipa_api_url
  with_decryption = true
}

# ----------------------------------------------------------------------------------------------
# SSM Parameter - IPA Key
# ----------------------------------------------------------------------------------------------
data "aws_ssm_parameter" "ipa_api_key" {
  name            = local.ssm_ipa_api_key
  with_decryption = true
}

# ----------------------------------------------------------------------------------------------
# SSM Parameter - Translation API URL
# ----------------------------------------------------------------------------------------------
data "aws_ssm_parameter" "translation_api_url" {
  name            = local.ssm_translation_api_url
  with_decryption = true
}

# ----------------------------------------------------------------------------------------------
# SSM Parameter - Translation API Key
# ----------------------------------------------------------------------------------------------
data "aws_ssm_parameter" "translation_api_key" {
  name            = local.ssm_translation_api_key
  with_decryption = true
}

# ----------------------------------------------------------------------------------------------
# SSM Parameter - Vision API URL
# ----------------------------------------------------------------------------------------------
data "aws_ssm_parameter" "vision_api_url" {
  name            = local.ssm_vision_api_url
  with_decryption = true
}

# ----------------------------------------------------------------------------------------------
# SSM Parameter - Vision API Key
# ----------------------------------------------------------------------------------------------
data "aws_ssm_parameter" "vision_api_key" {
  name            = local.ssm_vision_api_key
  with_decryption = true
}
