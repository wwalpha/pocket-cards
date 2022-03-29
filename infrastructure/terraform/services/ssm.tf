# ----------------------------------------------------------------------------------------------
# SSM Parameter Store - Backend repository url
# ----------------------------------------------------------------------------------------------
resource "aws_ssm_parameter" "backend_repo_url" {
  name      = "/${local.project_name}/repository_url/backend"
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
  name      = "/${local.project_name}/repository_url/batch"
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
  name      = "/${local.project_name}/repository_url/users"
  type      = "String"
  value     = "${module.ecr_repo_users.repository_url}:latest"
  overwrite = true

  lifecycle {
    ignore_changes = [
      value
    ]
  }
}

