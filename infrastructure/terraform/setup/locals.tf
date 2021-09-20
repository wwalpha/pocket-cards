locals {
  # ----------------------------------------------------------------------------------------------
  # Environment
  # ----------------------------------------------------------------------------------------------
  is_dev = terraform.workspace == "dev"
  suffix = random_id.this.hex

  # ----------------------------------------------------------------------------------------------
  # Project Informations
  # ----------------------------------------------------------------------------------------------
  project_name_uc = upper(var.project_name)

  # ----------------------------------------------------------------------------------------------
  # S3 Buckets
  # ----------------------------------------------------------------------------------------------
  bucket_name_frontend = "${var.project_name}-frontend-${local.suffix}"
  bucket_name_archive  = "${var.project_name}-archive-${local.suffix}"

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
  dynamodb_name_users       = "${var.project_name}-users-${local.suffix}"
  dynamodb_name_words       = "${var.project_name}-words-${local.suffix}"
  dynamodb_name_groups      = "${var.project_name}-groups-${local.suffix}"
  dynamodb_name_word_master = "${var.project_name}-wordmaster-${local.suffix}"
  dynamodb_name_word_ignore = "${var.project_name}-wordignore-${local.suffix}"
  dynamodb_name_histories   = "${var.project_name}-histories-${local.suffix}"
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
