# ----------------------------------------------------------------------------------------------
# Lambda Function - Websocket Connect
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function" "wss_connect" {
  function_name     = "${local.project_name}-wss-connect"
  s3_bucket         = local.bucket_name_archive
  s3_key            = local.bucket_key_lambda_wss_connect
  s3_object_version = aws_s3_object.lambda_wss_connect.version_id
  handler           = local.lambda_handler
  memory_size       = 128
  role              = aws_iam_role.wss.arn
  runtime           = local.lambda_runtime
  timeout           = 5

  environment {
    variables = {
      TABLE_NAME_CONNECTIONS              = local.dynamodb_name_wss
      FUNCTION_NAME                       = aws_lambda_function.wss_relay.function_name
      AWS_NODEJS_CONNECTION_REUSE_ENABLED = 1
      TZ                                  = "Asia/Tokyo"
    }
  }
}

# ---------------------------------------------------------------------------------------------
# API Gateway Permission (Lambda) - ECS Task Start
# ---------------------------------------------------------------------------------------------
resource "aws_lambda_permission" "wss_connect" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.wss_connect.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${data.aws_apigatewayv2_api.wss.execution_arn}/*/$connect"
}

# ----------------------------------------------------------------------------------------------
# Lambda Function - Websocket Disconnect
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function" "wss_disconnect" {
  function_name     = "${local.project_name}-wss-disconnect"
  s3_bucket         = local.bucket_name_archive
  s3_key            = local.bucket_key_lambda_wss_disconnect
  s3_object_version = aws_s3_object.lambda_wss_disconnect.version_id
  handler           = local.lambda_handler
  memory_size       = 128
  role              = aws_iam_role.wss.arn
  runtime           = local.lambda_runtime
  timeout           = 5

  environment {
    variables = {
      TABLE_NAME_CONNECTIONS              = local.dynamodb_name_wss
      AWS_NODEJS_CONNECTION_REUSE_ENABLED = 1
      TZ                                  = "Asia/Tokyo"
    }
  }
}

# ---------------------------------------------------------------------------------------------
# API Gateway Permission (Lambda) - ECS Task Stop
# ---------------------------------------------------------------------------------------------
resource "aws_lambda_permission" "wss_disconnect" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.wss_disconnect.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${data.aws_apigatewayv2_api.wss.execution_arn}/*/$disconnect"
}

# ----------------------------------------------------------------------------------------------
# Lambda Function - ECS Task Status
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function" "wss_commands" {
  function_name     = "${local.project_name}-wss-commands"
  s3_bucket         = local.bucket_name_archive
  s3_key            = local.bucket_key_lambda_wss_commands
  s3_object_version = aws_s3_object.lambda_wss_commands.version_id
  handler           = local.lambda_handler
  memory_size       = 128
  role              = aws_iam_role.wss_commands.arn
  runtime           = local.lambda_runtime
  timeout           = 10
  environment {
    variables = {
      TABLE_NAME_CONNECTIONS              = local.dynamodb_name_wss
      AWS_NODEJS_CONNECTION_REUSE_ENABLED = 1
      TZ                                  = "Asia/Tokyo"
    }
  }
}

# ---------------------------------------------------------------------------------------------
# API Gateway Permission (Lambda) - ECS Task Status
# ---------------------------------------------------------------------------------------------
resource "aws_lambda_permission" "wss_commands" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.wss_commands.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${data.aws_apigatewayv2_api.wss.execution_arn}/*/$default"
}

# ----------------------------------------------------------------------------------------------
# Lambda Function - WSS Relay
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function" "wss_relay" {
  function_name     = "${local.project_name}-wss-relay"
  s3_bucket         = local.bucket_name_archive
  s3_key            = local.bucket_key_lambda_wss_relay
  s3_object_version = aws_s3_object.lambda_wss_relay.version_id
  handler           = local.lambda_handler
  memory_size       = 128
  role              = aws_iam_role.wss_relay.arn
  runtime           = local.lambda_runtime
  timeout           = 10
  environment {
    variables = {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED = 1
      TZ                                  = "Asia/Tokyo"
    }
  }
}
