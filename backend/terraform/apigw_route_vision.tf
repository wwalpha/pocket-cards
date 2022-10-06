# ---------------------------------------------------------------------------------------------
# API Gateway Route - Vision
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "post_vision" {
  api_id             = local.apigw_id
  route_key          = "POST /vision/*"
  target             = "integrations/${local.apigw_integration_id_backend}"
  authorization_type = "CUSTOM"
  authorizer_id      = local.apigw_authorizer_id_lambda
}
