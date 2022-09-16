# ---------------------------------------------------------------------------------------------
# API Gateway Authorizer - Authorization(API)
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_authorizer" "auth" {
  name                              = "Authorizer"
  api_id                            = aws_apigatewayv2_api.this.id
  authorizer_type                   = "REQUEST"
  authorizer_uri                    = aws_lambda_function.authorizer_v2.invoke_arn
  authorizer_payload_format_version = "2.0"
  enable_simple_responses           = false
  authorizer_result_ttl_in_seconds  = 300
  identity_sources                  = ["$request.header.Authorization"]
}

# ---------------------------------------------------------------------------------------------
# API Gateway Authorizer - Authorization(WSS)
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_authorizer" "wss" {
  name             = "Authorizer"
  api_id           = aws_apigatewayv2_api.wss.id
  authorizer_type  = "REQUEST"
  authorizer_uri   = aws_lambda_function.authorizer_v1.invoke_arn
  identity_sources = ["route.request.querystring.Authorization"]
}
