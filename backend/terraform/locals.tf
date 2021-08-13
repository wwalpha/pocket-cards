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
  lambda_s3_bucket        = local.remote_setup.lambda_s3_bucket
  lambda_s3_key           = local.remote_setup.lambda_s3_key

  # ----------------------------------------------------------------------------------------------
  # DynamoDB
  # ----------------------------------------------------------------------------------------------
  dynamodb_name_users = local.remote_setup.dynamodb_name_users

  # ----------------------------------------------------------------------------------------------
  # API Gateway
  # ----------------------------------------------------------------------------------------------
  api_gateway_id            = local.remote_services.api_gateway_id
  api_gateway_authorizer_id = local.remote_services.api_gateway_authorizer_id
  api_gateway_execution_arn = local.remote_services.api_gateway_execution_arn
}

# ----------------------------------------------------------------------------------------------
# SSM - Lambda modules - start
# ----------------------------------------------------------------------------------------------
data "aws_ssm_parameter" "lambda_modules_start" {
  name = aws_ssm_parameter.lambda_start.name
}

# ----------------------------------------------------------------------------------------------
# SSM - Lambda modules - status
# ----------------------------------------------------------------------------------------------
data "aws_ssm_parameter" "lambda_modules_status" {
  name = aws_ssm_parameter.lambda_status.name
}

# ----------------------------------------------------------------------------------------------
# SSM - Lambda modules - stop
# ----------------------------------------------------------------------------------------------
data "aws_ssm_parameter" "lambda_modules_stop" {
  name = aws_ssm_parameter.lambda_stop.name
}

# ----------------------------------------------------------------------------------------------
# SSM - Lambda modules - name
# ----------------------------------------------------------------------------------------------
data "aws_ssm_parameter" "lambda_modules_cognito" {
  name = aws_ssm_parameter.lambda_cognito.name
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
