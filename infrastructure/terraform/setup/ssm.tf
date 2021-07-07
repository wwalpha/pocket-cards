# ----------------------------------------------------------------------------------------------
# SSM Parameter Store - Translation api key
# ----------------------------------------------------------------------------------------------
resource "aws_ssm_parameter" "api_key_translation" {
  name      = "/${var.project_name}/api_key_translation"
  type      = "SecureString"
  value     = var.api_key_translation
  overwrite = true
}

# ----------------------------------------------------------------------------------------------
# SSM Parameter Store - IPA api key
# ----------------------------------------------------------------------------------------------
resource "aws_ssm_parameter" "api_key_ipa" {
  name      = "/${var.project_name}/api_key_ipa"
  type      = "SecureString"
  value     = var.api_key_ipa
  overwrite = true
}

# ----------------------------------------------------------------------------------------------
# SSM Parameter Store - Google Client ID
# ----------------------------------------------------------------------------------------------
resource "aws_ssm_parameter" "google_client_id" {
  name      = "/${var.project_name}/google_client_id"
  type      = "SecureString"
  value     = var.google_client_id
  overwrite = true
}

# ----------------------------------------------------------------------------------------------
# SSM Parameter Store - Google Client Secret
# ----------------------------------------------------------------------------------------------
resource "aws_ssm_parameter" "google_client_secret" {
  name      = "/${var.project_name}/google_client_secret"
  type      = "SecureString"
  value     = var.google_client_secret
  overwrite = true
}
