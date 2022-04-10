# ---------------------------------------------------------------------------------------------
# API Gateway Route - User manager health
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "get_users_health" {
  api_id    = local.apigw_id
  route_key = "GET /users/health"
  target    = "integrations/${local.apigw_integration_id_users}"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - Create Normal User
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "post_users" {
  api_id    = local.apigw_id
  route_key = "POST /users"
  target    = "integrations/${local.apigw_integration_id_users}"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - Create Student
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "post_users_students" {
  api_id             = local.apigw_id
  route_key          = "POST /users/students"
  target             = "integrations/${local.apigw_integration_id_users}"
  authorization_type = "CUSTOM"
  authorizer_id      = local.apigw_authorizer_id_lambda
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - Get students by teacher
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "get_users_students" {
  api_id             = local.apigw_id
  route_key          = "GET /users/students"
  target             = "integrations/${local.apigw_integration_id_users}"
  authorization_type = "CUSTOM"
  authorizer_id      = local.apigw_authorizer_id_lambda
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - Get user infomations
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "get_users_proxy" {
  api_id             = local.apigw_id
  route_key          = "GET /users/{proxy+}"
  target             = "integrations/${local.apigw_integration_id_users}"
  authorization_type = "CUSTOM"
  authorizer_id      = local.apigw_authorizer_id_lambda
}
