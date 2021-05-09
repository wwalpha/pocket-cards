# ----------------------------------------------------------------------------------------------
# SSM Parameter Store - Translation api key
# ----------------------------------------------------------------------------------------------
resource "aws_ssm_parameter" "translation_api_key" {
  name      = "/${var.project_name}/translation_api_key"
  type      = "SecureString"
  value     = var.translation_api_key
  overwrite = true
}

# ----------------------------------------------------------------------------------------------
# SSM Parameter Store - IPA api key
# ----------------------------------------------------------------------------------------------
resource "aws_ssm_parameter" "ipa_api_key" {
  name      = "/${var.project_name}/ipa_api_key"
  type      = "SecureString"
  value     = var.ipa_api_key
  overwrite = true
}

# ----------------------------------------------------------------------------------------------
# SSM Parameter Store - Identity Provider ID
# ----------------------------------------------------------------------------------------------
resource "aws_ssm_parameter" "identity_provider_id" {
  name      = "/${var.project_name}/identity_provider_id"
  type      = "SecureString"
  value     = var.identity_provider_id
  overwrite = true
}

# ----------------------------------------------------------------------------------------------
# SSM Parameter Store - Identity Provider Secret
# ----------------------------------------------------------------------------------------------
resource "aws_ssm_parameter" "identity_provider_secret" {
  name      = "/${var.project_name}/identity_provider_secret"
  type      = "SecureString"
  value     = var.identity_provider_secret
  overwrite = true
}
