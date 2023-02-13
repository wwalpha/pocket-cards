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
  bucket_name_frontend  = "${var.project_name}-frontend-${local.suffix}"
  bucket_name_archive   = "${var.project_name}-archive-${local.suffix}"
  bucket_name_materials = "${var.project_name}-materials-${local.suffix}"
  bucket_name_uploads   = "${var.project_name}-uploads-${local.suffix}"

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
  dynamodb_name_users           = "${var.project_name}-users-${local.suffix}"
  dynamodb_name_words           = "${var.project_name}-words-${local.suffix}"
  dynamodb_name_groups          = "${var.project_name}-groups-${local.suffix}"
  dynamodb_name_word_master     = "${var.project_name}-wordmaster-${local.suffix}"
  dynamodb_name_word_ignore     = "${var.project_name}-wordignore-${local.suffix}"
  dynamodb_name_questions       = "${var.project_name}-questions-${local.suffix}"
  dynamodb_name_learning        = "${var.project_name}-learning-${local.suffix}"
  dynamodb_name_traces          = "${var.project_name}-traces-${local.suffix}"
  dynamodb_name_settings        = "${var.project_name}-settings-${local.suffix}"
  dynamodb_name_curriculums     = "${var.project_name}-curriculums-${local.suffix}"
  dynamodb_name_reports         = "${var.project_name}-reports-${local.suffix}"
  dynamodb_name_wss_connections = "${var.project_name}-wssconnections-${local.suffix}"
  dynamodb_name_inquiry         = "${var.project_name}-inquiry-${local.suffix}"
  dynamodb_name_accuracy        = "${var.project_name}-accuracy-${local.suffix}"

  bucket_key_lambda_wss_relay = "lambda/wss_relay.zip"

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
