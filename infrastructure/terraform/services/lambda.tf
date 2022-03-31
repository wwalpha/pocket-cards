# ----------------------------------------------------------------------------------------------
# Lambda Function - Cognito
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function" "cognito_post_signup" {
  s3_bucket     = local.bucket_name_archive
  s3_key        = aws_s3_object.lambda_cognito_post_signup.key
  function_name = "${local.project_name}-cognito-post-signup"
  handler       = local.lambda_handler
  memory_size   = 128
  role          = aws_iam_role.cognito_post_signup.arn
  runtime       = local.lambda_runtime
  timeout       = 10

  environment {
    variables = {
      TABLE_USERS = local.dynamodb_name_users
    }
  }
}

# ----------------------------------------------------------------------------------------------
# Lambda Function Permission - Cognito Admin
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_permission" "cognito_admin" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.cognito_post_signup.arn
  principal     = "cognito-sync.amazonaws.com"
  source_arn    = aws_cognito_identity_pool.admin.arn
}

# ----------------------------------------------------------------------------------------------
# Lambda Function Permission - Cognito Users
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_permission" "cognito_users" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.cognito_post_signup.arn
  principal     = "cognito-sync.amazonaws.com"
  source_arn    = aws_cognito_identity_pool.this.arn
}
