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

# ----------------------------------------------------------------------------------------------
# SSM Parameter Store - Repository URL (Batch)
# ----------------------------------------------------------------------------------------------
resource "aws_ssm_parameter" "repo_url_batch" {
  name      = "/${local.project_name}/repository_url/batch"
  type      = "String"
  value     = "${aws_ecr_repository.batch.repository_url}:latest"
  overwrite = true

  lifecycle {
    ignore_changes = [
      value
    ]
  }
}
