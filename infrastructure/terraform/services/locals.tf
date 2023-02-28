locals {
  # ----------------------------------------------------------------------------------------------
  # Environment
  # ----------------------------------------------------------------------------------------------
  environment  = terraform.workspace
  is_dev       = local.environment == "dev"
  is_dev_count = local.is_dev ? 0 : 1
  is_dev_only  = local.environment == "dev" ? 1 : 0
  is_prod_only = local.environment != "dev" ? 1 : 0
  remote_setup = data.terraform_remote_state.setup.outputs
  account_id   = data.aws_caller_identity.this.account_id
  region       = data.aws_region.this.name
  region_us    = "us-east-1"
  vpc_id       = local.is_dev ? var.vpc_id : module.vpc[0].vpc_id
  vpc_subnets  = local.is_dev ? var.vpc_subnets : module.vpc[0].public_subnets

  # ----------------------------------------------------------------------------------------------
  # Project Informations
  # ----------------------------------------------------------------------------------------------
  project_name         = local.remote_setup.project_name
  project_name_uc      = local.remote_setup.project_name_uc
  google_client_id     = local.remote_setup.google_client_id
  google_client_secret = local.remote_setup.google_client_secret

  # ----------------------------------------------------------------------------------------------
  # ECS
  # ----------------------------------------------------------------------------------------------
  task_def_family_backend = "${local.project_name}-backend"
  task_def_family_users   = "${local.project_name}-users"
  task_def_family_auth    = "${local.project_name}-auth"

  # ----------------------------------------------------------------------------------------------
  # API Gateway
  # ----------------------------------------------------------------------------------------------
  api_domain_name = aws_acm_certificate.api.domain_name
  api_stage_name  = "v1"
  api_allow_origins = [
    "https://www.${local.remote_setup.route53_zone_name}",
    "https://admin.${local.remote_setup.route53_zone_name}"
  ]
  api_allow_origins_dev = concat(local.api_allow_origins, ["http://localhost:3000"])

  # -----------------------------------------------
  # CloudFront
  # -----------------------------------------------
  origin_id_frontend     = "frontend"
  origin_id_materials    = "materials"
  origin_id_audio        = "audio"
  origin_id_api          = "api"
  origin_id_path         = "/api"
  default_root_object    = "index.html"
  viewer_protocol_policy = "redirect-to-https"
  logging_prefix         = "frontend"
  audio_path_pattern     = local.origin_id_audio
  api_path_pattern       = local.origin_id_api

  # ----------------------------------------------------------------------------------------------
  # Lambda
  # ----------------------------------------------------------------------------------------------
  lambda_handler           = "index.handler"
  lambda_runtime_nodejs_18 = "nodejs18.x"
  lambda_basic_policy_arn  = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"

  # ----------------------------------------------------------------------------------------------
  # DynamoDB
  # ----------------------------------------------------------------------------------------------
  dynamodb_name_users    = local.remote_setup.dynamodb_name_users
  dynamodb_name_settings = local.remote_setup.dynamodb_name_settings
  dynamodb_name_accuracy = local.remote_setup.dynamodb_name_accuracy

  # ----------------------------------------------------------------------------------------------
  # CloudTrail
  # ----------------------------------------------------------------------------------------------
  ct_prefix = "trail"

  # ----------------------------------------------------------------------------------------------
  # ECR
  # ----------------------------------------------------------------------------------------------
  repo_url_backend = local.remote_setup.repo_url_backend
  repo_url_batch   = local.remote_setup.repo_url_batch
  repo_url_auth    = local.remote_setup.repo_url_auth
  repo_url_users   = local.remote_setup.repo_url_users

  # ----------------------------------------------------------------------------------------------
  # SSM
  # ----------------------------------------------------------------------------------------------
  ssm_repo_url_backend = local.remote_setup.ssm_repo_url_backend
  ssm_repo_url_auth    = local.remote_setup.ssm_repo_url_auth
  ssm_repo_url_users   = local.remote_setup.ssm_repo_url_users

  # ----------------------------------------------------------------------------------------------
  # S3 Bucket
  # ----------------------------------------------------------------------------------------------
  bucket_name_frontend  = local.remote_setup.bucket_name_frontend
  bucket_name_archive   = local.remote_setup.bucket_name_archive
  bucket_name_materials = local.remote_setup.bucket_name_materials
  bucket_name_uploads   = local.remote_setup.bucket_name_uploads

  bucket_key_lambda_wss_connect    = "lambda_modules/wss_connect.zip"
  bucket_key_lambda_wss_disconnect = "lambda_modules/wss_disconnect.zip"
  bucket_key_lambda_wss_commands   = "lambda_modules/wss_commands.zip"
  bucket_key_lambda_wss_relay      = "lambda_modules/wss_relay.zip"
  bucket_key_lambda_notify         = "lambda_modules/notify.zip"
  bucket_key_lambda_start          = "lambda_modules/start.zip"
  bucket_key_lambda_stop           = "lambda_modules/stop.zip"
  bucket_key_lambda_status         = "lambda_modules/status.zip"
  bucket_key_lambda_vision         = "lambda_modules/vision.zip"
  bucket_key_lambda_authorizer_v1  = "lambda_modules/authorizer_v1.zip"
  bucket_key_lambda_authorizer_v2  = "lambda_modules/authorizer_v2.zip"
  bucket_key_lambda_cognito        = "lambda_modules/cognito.zip"

  # ----------------------------------------------------------------------------------------------
  # Route53
  # ----------------------------------------------------------------------------------------------
  route53_zone_name = local.remote_setup.route53_zone_name
  domain_name       = local.remote_setup.route53_zone_name
}

# ----------------------------------------------------------------------------------------------
# AWS Region
# ----------------------------------------------------------------------------------------------
data "aws_region" "this" {}

# ----------------------------------------------------------------------------------------------
# AWS Account
# ----------------------------------------------------------------------------------------------
data "aws_caller_identity" "this" {}

# ----------------------------------------------------------------------------------------------
# Amazon S3 Bucket - Frontend
# ----------------------------------------------------------------------------------------------
data "aws_s3_bucket" "frontend" {
  bucket = local.bucket_name_frontend
}

# ----------------------------------------------------------------------------------------------
# Amazon S3 Bucket - Archive
# ----------------------------------------------------------------------------------------------
data "aws_s3_bucket" "archive" {
  bucket = local.bucket_name_archive
}

# ----------------------------------------------------------------------------------------------
# Amazon S3 Bucket - Materials
# ----------------------------------------------------------------------------------------------
data "aws_s3_bucket" "materials" {
  bucket = local.bucket_name_materials
}

# ----------------------------------------------------------------------------------------------
# Amazon S3 Bucket - Uploads
# ----------------------------------------------------------------------------------------------
data "aws_s3_bucket" "uploads" {
  bucket = local.bucket_name_uploads
}

# ----------------------------------------------------------------------------------------------
# AWS Route53 Zone
# ----------------------------------------------------------------------------------------------
data "aws_route53_zone" "this" {
  name = local.route53_zone_name
}


# ----------------------------------------------------------------------------------------------
# Dynamodb Table - Settings
# ----------------------------------------------------------------------------------------------
data "aws_dynamodb_table" "settings" {
  name = local.dynamodb_name_settings
}

# ----------------------------------------------------------------------------------------------
# Dynamodb Table - Users
# ----------------------------------------------------------------------------------------------
data "aws_dynamodb_table" "users" {
  name = local.dynamodb_name_users
}
