# ---------------------------------------------------------------------------------------------
# API Gateway Route - Auth Health
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "get_auth_health" {
  api_id    = local.apigw_id
  route_key = "GET /auth/health"
  target    = "integrations/${local.apigw_integration_id_auth}"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - Auth
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "post_auth" {
  api_id    = local.apigw_id
  route_key = "POST /auth/login"
  target    = "integrations/${local.apigw_integration_id_auth}"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - Auth Token Refresh
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "post_auth_refresh" {
  api_id    = local.apigw_id
  route_key = "POST /auth/refresh"
  target    = "integrations/${local.apigw_integration_id_auth}"
}
