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
  task_def_rev            = max(aws_ecs_task_definition.this.revision, data.aws_ecs_task_definition.backend.revision)
  task_def_rev_users      = max(aws_ecs_task_definition.users.revision, data.aws_ecs_task_definition.users.revision)
  task_def_rev_auth       = max(aws_ecs_task_definition.auth.revision, data.aws_ecs_task_definition.auth.revision)

  # ----------------------------------------------------------------------------------------------
  # API Gateway
  # ----------------------------------------------------------------------------------------------
  api_domain_name = aws_acm_certificate.api.domain_name

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
  lambda_handler          = "index.handler"
  lambda_runtime          = "nodejs14.x"
  lambda_basic_policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"

  # ----------------------------------------------------------------------------------------------
  # DynamoDB
  # ----------------------------------------------------------------------------------------------
  dynamodb_name_users    = local.remote_setup.dynamodb_name_users
  dynamodb_name_settings = local.remote_setup.dynamodb_name_settings

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
  # S3 Bucket
  # ----------------------------------------------------------------------------------------------
  bucket_name_frontend  = local.remote_setup.bucket_name_frontend
  bucket_name_archive   = local.remote_setup.bucket_name_archive
  bucket_name_materials = local.remote_setup.bucket_name_materials
  bucket_name_uploads   = local.remote_setup.bucket_name_uploads

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
# ECS Task Definition - Backend
# ----------------------------------------------------------------------------------------------
data "aws_ecs_task_definition" "backend" {
  depends_on      = [aws_ecs_task_definition.this]
  task_definition = aws_ecs_task_definition.this.family
}

# ----------------------------------------------------------------------------------------------
# ECS Task Definition - Users
# ----------------------------------------------------------------------------------------------
data "aws_ecs_task_definition" "users" {
  depends_on      = [aws_ecs_task_definition.users]
  task_definition = aws_ecs_task_definition.users.family
}

# ----------------------------------------------------------------------------------------------
# ECS Task Definition - Auth
# ----------------------------------------------------------------------------------------------
data "aws_ecs_task_definition" "auth" {
  depends_on      = [aws_ecs_task_definition.auth]
  task_definition = aws_ecs_task_definition.auth.family
}

# ----------------------------------------------------------------------------------------------
# ECS Task Definition - WSS
# ----------------------------------------------------------------------------------------------
# data "aws_ecs_task_definition" "wss" {
#   depends_on      = [aws_ecs_task_definition.wss]
#   task_definition = aws_ecs_task_definition.wss.family
# }

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
