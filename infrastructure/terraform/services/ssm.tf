# ----------------------------------------------------------------------------------------------
# SSM Parameter Store - Backend repository url
# ----------------------------------------------------------------------------------------------
resource "aws_ssm_parameter" "backend_repo_url" {
  name      = "/${local.project_name}/repository_url/backend"
  type      = "String"
  value     = "${aws_ecr_repository.this.repository_url}:latest"
  overwrite = true

  lifecycle {
    ignore_changes = [
      value
    ]
  }
}
