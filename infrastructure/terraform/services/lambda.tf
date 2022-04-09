# ----------------------------------------------------------------------------------------------
# Lambda Function - Cognito
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function" "cognito_post_signup" {
  function_name     = "${local.project_name}-cognito-post-signup"
  s3_bucket         = local.bucket_name_archive
  s3_key            = aws_s3_object.lambda_cognito.key
  s3_object_version = aws_s3_object.lambda_cognito.version_id
  handler           = local.lambda_handler
  memory_size       = 128
  role              = aws_iam_role.cognito_post_signup.arn
  runtime           = local.lambda_runtime
  timeout           = 10

  environment {
    variables = {
      TABLE_USERS                         = local.dynamodb_name_users
      AWS_NODEJS_CONNECTION_REUSE_ENABLED = "1"
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

# ----------------------------------------------------------------------------------------------
# Lambda Function - Authorizer
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function" "authorizer" {
  function_name     = "${local.project_name}-authorizer"
  s3_bucket         = local.bucket_name_archive
  s3_key            = aws_s3_object.lambda_authorizer.key
  s3_object_version = aws_s3_object.lambda_authorizer.version_id
  handler           = local.lambda_handler
  runtime           = local.lambda_runtime
  memory_size       = 1024
  role              = aws_iam_role.authorizer.arn
  timeout           = 3
  environment {
    variables = {
      TABLE_NAME_USERS                    = local.dynamodb_name_users
      AWS_NODEJS_CONNECTION_REUSE_ENABLED = "1"
    }
  }
}

# ----------------------------------------------------------------------------------------------
# Lambda Permission - Authorizer
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_permission" "authorizer" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.authorizer.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.this.execution_arn}/authorizers/${aws_apigatewayv2_authorizer.auth.id}"
}

# ----------------------------------------------------------------------------------------------
# Lambda Function - Webhook
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function" "webhook" {
  function_name     = "${local.project_name}-errors-webhook"
  s3_bucket         = local.bucket_name_archive
  s3_key            = aws_s3_object.lambda_webhook.key
  s3_object_version = aws_s3_object.lambda_webhook.version_id
  handler           = local.lambda_handler
  runtime           = local.lambda_runtime
  memory_size       = 1024
  role              = aws_iam_role.authorizer.arn
  timeout           = 3
  environment {
    variables = {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED = "1"
    }
  }
}

