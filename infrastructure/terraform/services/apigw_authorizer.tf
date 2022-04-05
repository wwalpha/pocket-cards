# ---------------------------------------------------------------------------------------------
# API Gateway Authorizer - Authorization
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_authorizer" "auth" {
  name                              = "Authorizer"
  api_id                            = aws_apigatewayv2_api.this.id
  authorizer_type                   = "REQUEST"
  authorizer_uri                    = aws_lambda_function.authorizer.invoke_arn
  authorizer_payload_format_version = "2.0"
  enable_simple_responses           = false
  authorizer_result_ttl_in_seconds  = 300
  identity_sources                  = ["$request.header.Authorization"]
}
