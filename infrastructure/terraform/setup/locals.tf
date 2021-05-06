locals {
  # ----------------------------------------------------------------------------------------------
  # Project Informations
  # ----------------------------------------------------------------------------------------------
  project_name_uc = replace(title(var.project_name), "-", "")
  region          = data.aws_region.this.name
  environment     = terraform.workspace

  # ----------------------------------------------------------------------------------------------
  # S3 Buckets
  # ----------------------------------------------------------------------------------------------
  bucket_name_audio    = "${var.project_name}-audios-${random_id.bucket.hex}"
  bucket_name_frontend = "${var.project_name}-frontend-${random_id.bucket.hex}"
  bucket_name_logging  = "${var.project_name}-logging-${random_id.bucket.hex}"
  bucket_name_images   = "${var.project_name}-images-${random_id.bucket.hex}"

  # ----------------------------------------------------------------------------------------------
  # Dynamodb Tables
  # ----------------------------------------------------------------------------------------------
  dyanmodb_random_id       = random_id.dynamodb.hex
  dynamodb_name_users      = "${local.project_name_uc}_Users${local.dyanmodb_random_id}"
  dynamodb_name_groupwords = "${local.project_name_uc}_GroupWords${local.dyanmodb_random_id}"
  dynamodb_name_userGroups = "${local.project_name_uc}_UserGroups${local.dyanmodb_random_id}"
  dynamodb_name_words      = "${local.project_name_uc}_Words${local.dyanmodb_random_id}"
  dynamodb_name_history    = "${local.project_name_uc}_History${local.dyanmodb_random_id}"
}

data "aws_region" "this" {}
