# ----------------------------------------------------------------------------------------------
# SSM Parameter Store - Translation api url
# ----------------------------------------------------------------------------------------------
resource "aws_ssm_parameter" "translation_api_url" {
  name      = "/${var.project_name}/translation_api_url"
  type      = "SecureString"
  value     = var.translation_api_url
  overwrite = true
}

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
# SSM Parameter Store - IPA api url
# ----------------------------------------------------------------------------------------------
resource "aws_ssm_parameter" "ipa_api_url" {
  name      = "/${var.project_name}/ipa_api_url"
  type      = "SecureString"
  value     = var.ipa_api_url
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
# SSM Parameter Store - Vision api url
# ----------------------------------------------------------------------------------------------
resource "aws_ssm_parameter" "vision_api_url" {
  name      = "/${var.project_name}/vision_api_url"
  type      = "SecureString"
  value     = var.vision_api_url
  overwrite = true
}

# ----------------------------------------------------------------------------------------------
# SSM Parameter Store - Vision api key
# ----------------------------------------------------------------------------------------------
resource "aws_ssm_parameter" "vision_api_key" {
  name      = "/${var.project_name}/vision_api_key"
  type      = "SecureString"
  value     = var.vision_api_key
  overwrite = true
}

