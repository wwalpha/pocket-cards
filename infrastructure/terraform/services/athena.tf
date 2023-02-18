# -----------------------------------------------------------------------------------------------------
# AWS Athena Workgroup
# -----------------------------------------------------------------------------------------------------
resource "aws_athena_workgroup" "this" {
  name = "${local.project_name}-workgroup"

  configuration {
    enforce_workgroup_configuration    = true
    publish_cloudwatch_metrics_enabled = false

    result_configuration {
      output_location = "s3://${local.bucket_name_archive}/athena/"
    }

    engine_version {
      selected_engine_version = "Athena engine version 3"
    }
  }
}

# -----------------------------------------------------------------------------------------------------
# AWS Athena Database
# -----------------------------------------------------------------------------------------------------
resource "aws_athena_database" "this" {
  name   = "${local.project_name}_database"
  bucket = local.bucket_name_archive
}
