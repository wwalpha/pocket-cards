# ---------------------------------------------------------------------------------------------
# API Gateway Route - $connect
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "wss_connect" {
  api_id             = local.apigw_id_wss
  route_key          = "$connect"
  authorization_type = "CUSTOM"
  authorizer_id      = local.apigw_authorizer_id_wss

  target = "integrations/${aws_apigatewayv2_integration.wss_connect.id}"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Integration - Connect
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_integration" "wss_connect" {
  api_id                    = local.apigw_id_wss
  integration_type          = "AWS_PROXY"
  connection_type           = "INTERNET"
  content_handling_strategy = "CONVERT_TO_TEXT"
  integration_method        = "POST"
  integration_uri           = aws_lambda_function.wss_connect.invoke_arn
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - $disconnect
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "wss_disconnect" {
  api_id    = local.apigw_id_wss
  route_key = "$disconnect"

  target = "integrations/${aws_apigatewayv2_integration.wss_disconnect.id}"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Integration - $disconnect
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_integration" "wss_disconnect" {
  api_id                    = local.apigw_id_wss
  integration_type          = "AWS_PROXY"
  connection_type           = "INTERNET"
  content_handling_strategy = "CONVERT_TO_TEXT"
  integration_method        = "POST"
  integration_uri           = aws_lambda_function.wss_disconnect.invoke_arn
}


# ---------------------------------------------------------------------------------------------
# API Gateway Route - $default
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "wss_default" {
  api_id    = local.apigw_id_wss
  route_key = "$default"

  target = "integrations/${aws_apigatewayv2_integration.wss_default.id}"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Integration - $disconnect
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_integration" "wss_default" {
  api_id                    = local.apigw_id_wss
  integration_type          = "AWS_PROXY"
  connection_type           = "INTERNET"
  content_handling_strategy = "CONVERT_TO_TEXT"
  integration_method        = "POST"
  integration_uri           = aws_lambda_function.wss_commands.invoke_arn
}
