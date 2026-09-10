# Read the main HTTP API owned by services; never recreate it in this state.
data "aws_apigatewayv2_api" "this" {
  api_id = local.apigw_id
}

# These integrations are intentionally unused by apigw_route_*.tf.
# Payload 1.0 preserves the custom-domain /v1 mapping in the event path.
resource "aws_apigatewayv2_integration" "lambda_backend" {
  api_id                 = data.aws_apigatewayv2_api.this.id
  integration_type       = "AWS_PROXY"
  integration_method     = "POST"
  payload_format_version = "1.0"
  integration_uri        = aws_lambda_function.backend.invoke_arn

  request_parameters = {
    "append:header.username" = "$context.authorizer.username"
    "append:header.guardian" = "$context.authorizer.guardian"
  }
}

resource "aws_apigatewayv2_integration" "lambda_auth" {
  api_id                 = data.aws_apigatewayv2_api.this.id
  integration_type       = "AWS_PROXY"
  integration_method     = "POST"
  payload_format_version = "1.0"
  integration_uri        = aws_lambda_function.auth.invoke_arn

  request_parameters = {
    "append:header.username" = "$context.authorizer.username"
    "append:header.guardian" = "$context.authorizer.guardian"
  }
}

resource "aws_apigatewayv2_integration" "lambda_users" {
  api_id                 = data.aws_apigatewayv2_api.this.id
  integration_type       = "AWS_PROXY"
  integration_method     = "POST"
  payload_format_version = "1.0"
  integration_uri        = aws_lambda_function.users.invoke_arn

  request_parameters = {
    "append:header.username" = "$context.authorizer.username"
    "append:header.guardian" = "$context.authorizer.guardian"
  }
}

resource "aws_lambda_permission" "web" {
  for_each = {
    backend = aws_lambda_function.backend.function_name
    auth    = aws_lambda_function.auth.function_name
    users   = aws_lambda_function.users.function_name
  }

  statement_id   = "AllowMainHttpApi"
  action         = "lambda:InvokeFunction"
  function_name  = each.value
  principal      = "apigateway.amazonaws.com"
  source_arn     = "${data.aws_apigatewayv2_api.this.execution_arn}/*/*/*"
  source_account = local.account_id
}
