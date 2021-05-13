# ----------------------------------------------------------------------------------------------
# SSM Parameter Store - Environment variables
# ----------------------------------------------------------------------------------------------
resource "aws_ssm_parameter" "environments" {
  name = "/${local.project_name}/environments"
  type = "String"
  value = jsonencode({
    DYNAMODB_TABLES = local.dynamodb_tables
    S3_BUCKETS      = local.s3_buckets
    WORDS_LIMIT     = 10
  })
  overwrite = true

  lifecycle {
    ignore_changes = [
      value
    ]
  }
}
