locals {
  # ----------------------------------------------------------------------------------------------
  # Environment
  # ----------------------------------------------------------------------------------------------
  environment  = terraform.workspace
  is_dev       = local.environment == "dev"
  remote_setup = data.terraform_remote_state.setup.outputs
  account_id   = data.aws_caller_identity.this.account_id
  region       = data.aws_region.this.name
  region_us    = "us-east-1"
  simple       = var.is_simple ? 1 : 0
  normal       = !var.is_simple ? 1 : 0

  # ----------------------------------------------------------------------------------------------
  # Project Informations
  # ----------------------------------------------------------------------------------------------
  domain_prefix   = local.is_dev ? "dev." : ""
  domain_name     = data.aws_route53_zone.this.name
  project_name    = local.remote_setup.project_name
  project_name_uc = local.remote_setup.project_name_uc

  # ----------------------------------------------------------------------------------------------
  # ECS
  # ----------------------------------------------------------------------------------------------
  task_def_family = "pocket-cards-backend"
  task_def_rev    = max(aws_ecs_task_definition.this.revision, data.aws_ecs_task_definition.this.revision)

  # ----------------------------------------------------------------------------------------------
  # API Gateway
  # ----------------------------------------------------------------------------------------------
  api_domain_name = aws_acm_certificate.api.domain_name
  # api_execution_arn = local.remote_bked.api_execution_arn
  # rest_api_id       = local.remote_bked.api_id

  # -----------------------------------------------
  # CloudFront
  # -----------------------------------------------
  origin_id_frontend     = "frontend"
  origin_id_audio        = "audio"
  origin_id_api          = "api"
  origin_id_path         = "/api"
  default_root_object    = "index.html"
  viewer_protocol_policy = "redirect-to-https"
  logging_prefix         = "frontend"
  audio_path_pattern     = local.origin_id_audio
  api_path_pattern       = local.origin_id_api

  # ----------------------------------------------------------------------------------------------
  # CloudTrail
  # ----------------------------------------------------------------------------------------------
  ct_prefix = "trail"

  # ----------------------------------------------------------------------------------------------
  # S3 Bucket
  # ----------------------------------------------------------------------------------------------
  bucket_name_frontend = local.remote_setup.bucket_name_frontend
  bucket_name_audios   = local.remote_setup.bucket_name_audios
  bucket_name_logging  = local.remote_setup.bucket_name_logging
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
# AWS Route53
# ----------------------------------------------------------------------------------------------
data "aws_route53_zone" "this" {
  name = local.remote_setup.domain_name
}
# ----------------------------------------------------------------------------------------------
# Amazon S3 Bucket - Frontend
# ----------------------------------------------------------------------------------------------
data "aws_s3_bucket" "frontend" {
  bucket = local.bucket_name_frontend
}
# ----------------------------------------------------------------------------------------------
# Amazon S3 Bucket - Audios
# ----------------------------------------------------------------------------------------------
data "aws_s3_bucket" "audios" {
  bucket = local.bucket_name_audios
}

# ----------------------------------------------------------------------------------------------
# ECS Task Definition
# ----------------------------------------------------------------------------------------------
data "aws_ecs_task_definition" "this" {
  depends_on      = [aws_ecs_task_definition.this]
  task_definition = aws_ecs_task_definition.this.family
}

# ----------------------------------------------------------------------------------------------
# SSM - Identity Provider ID
# ----------------------------------------------------------------------------------------------
data "aws_ssm_parameter" "identity_provider_id" {
  name = data.terraform_remote_state.setup.identity_provider_id
}

# ----------------------------------------------------------------------------------------------
# SSM - Identity Provider Secret
# ----------------------------------------------------------------------------------------------
data "aws_ssm_parameter" "identity_provider_secret" {
  name = data.terraform_remote_state.setup.identity_provider_secret
}
