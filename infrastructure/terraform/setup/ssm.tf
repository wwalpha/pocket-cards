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

# ----------------------------------------------------------------------------------------------
# SSM Parameter Store - Backend repository url
# ----------------------------------------------------------------------------------------------
resource "aws_ssm_parameter" "repo_url_backend" {
  name      = "/${var.project_name}/repository_url/backend"
  type      = "String"
  value     = "${module.ecr_repo_backend.repository_url}:latest"
  overwrite = true

  lifecycle {
    ignore_changes = [
      value
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# SSM Parameter Store - Repository URL (Batch)
# ----------------------------------------------------------------------------------------------
resource "aws_ssm_parameter" "repo_url_batch" {
  name      = "/${var.project_name}/repository_url/batch"
  type      = "String"
  value     = "${module.ecr_repo_batch.repository_url}:latest"
  overwrite = true

  lifecycle {
    ignore_changes = [
      value
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# SSM Parameter Store - Repository URL (Users)
# ----------------------------------------------------------------------------------------------
resource "aws_ssm_parameter" "repo_url_users" {
  name      = "/${var.project_name}/repository_url/users"
  type      = "String"
  value     = "${module.ecr_repo_users.repository_url}:latest"
  overwrite = true

  lifecycle {
    ignore_changes = [
      value
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# SSM Parameter Store - Repository URL (Auth)
# ----------------------------------------------------------------------------------------------
resource "aws_ssm_parameter" "repo_url_auth" {
  name      = "/${var.project_name}/repository_url/auth"
  type      = "String"
  value     = "${module.ecr_repo_auth.repository_url}:latest"
  overwrite = true

  lifecycle {
    ignore_changes = [
      value
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# SSM Parameter Store - Repository URL (WSS)
# ----------------------------------------------------------------------------------------------
resource "aws_ssm_parameter" "repo_url_wss" {
  name      = "/${var.project_name}/repository_url/wss"
  type      = "String"
  value     = "${module.ecr_repo_wss.repository_url}:latest"
  overwrite = true

  lifecycle {
    ignore_changes = [
      value
    ]
  }
}
