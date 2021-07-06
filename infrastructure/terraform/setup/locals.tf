locals {
  # ----------------------------------------------------------------------------------------------
  # Environment
  # ----------------------------------------------------------------------------------------------
  is_dev = terraform.workspace == "dev"
  suffix = random_id.this.hex

  # ----------------------------------------------------------------------------------------------
  # Project Informations
  # ----------------------------------------------------------------------------------------------
  project_name_uc = replace(title(var.project_name), "-", "")
  domain_prefix   = local.is_dev ? "dev." : ""

  # ----------------------------------------------------------------------------------------------
  # S3 Buckets
  # ----------------------------------------------------------------------------------------------
  bucket_name_audio    = "${var.project_name}-audios-${local.suffix}"
  bucket_name_frontend = "${var.project_name}-frontend-${local.suffix}"
  bucket_name_logging  = "${var.project_name}-logging-${local.suffix}"
  bucket_name_images   = "${var.project_name}-images-${local.suffix}"
  mime_types = {
    htm   = "text/html"
    html  = "text/html"
    css   = "text/css"
    js    = "application/javascript"
    map   = "application/javascript"
    json  = "application/json"
    png   = "image/png"
    svg   = "image/svg+xml"
    "ico" = "image/x-icon"
  }

  # ----------------------------------------------------------------------------------------------
  # Dynamodb Tables
  # ----------------------------------------------------------------------------------------------
  dynamodb_name_users       = "${var.project_name}_users_${local.suffix}"
  dynamodb_name_words       = "${var.project_name}_words_${local.suffix}"
  dynamodb_name_groups      = "${var.project_name}_groups_${local.suffix}"
  dynamodb_name_word_master = "${var.project_name}_word_master_${local.suffix}"
  dynamodb_name_histories   = "${var.project_name}_histories_${local.suffix}"
}

# ----------------------------------------------------------------------------------------------
# Region
# ----------------------------------------------------------------------------------------------
data "aws_region" "this" {}

# ----------------------------------------------------------------------------------------------
# Bucket Random Id
# ----------------------------------------------------------------------------------------------
resource "random_id" "this" {
  byte_length = 3
}
