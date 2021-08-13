# ----------------------------------------------------------------------------------------------
# SSM Parameter Store - Lambda module start
# ----------------------------------------------------------------------------------------------
resource "aws_ssm_parameter" "lambda_start" {
  name  = "/${local.project_name}/lambda_modules/start"
  type  = "String"
  value = local.lambda_s3_key

  lifecycle {
    ignore_changes = [value]
  }
}

# ----------------------------------------------------------------------------------------------
# SSM Parameter Store - Lambda module status
# ----------------------------------------------------------------------------------------------
resource "aws_ssm_parameter" "lambda_status" {
  name  = "/${local.project_name}/lambda_modules/status"
  type  = "String"
  value = local.lambda_s3_key

  lifecycle {
    ignore_changes = [value]
  }
}


# ----------------------------------------------------------------------------------------------
# SSM Parameter Store - Lambda module stop
# ----------------------------------------------------------------------------------------------
resource "aws_ssm_parameter" "lambda_stop" {
  name  = "/${local.project_name}/lambda_modules/stop"
  type  = "String"
  value = local.lambda_s3_key

  lifecycle {
    ignore_changes = [value]
  }
}

# ----------------------------------------------------------------------------------------------
# SSM Parameter Store - Lambda module cognito
# ----------------------------------------------------------------------------------------------
resource "aws_ssm_parameter" "lambda_cognito" {
  name  = "/${local.project_name}/lambda_modules/cognito"
  type  = "String"
  value = local.lambda_s3_key

  lifecycle {
    ignore_changes = [value]
  }
}
