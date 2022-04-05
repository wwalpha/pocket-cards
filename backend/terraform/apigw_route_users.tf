# ---------------------------------------------------------------------------------------------
# API Gateway Route - User manager health
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "get_users_health" {
  api_id    = local.apigw_id
  route_key = "GET /users/health"
  target    = "integrations/${local.apigw_integration_id_users}"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - Auth
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "post_users" {
  api_id    = local.apigw_id
  route_key = "POST /users"
  target    = "integrations/${local.apigw_integration_id_users}"
}
