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
