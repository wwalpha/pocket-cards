# ---------------------------------------------------------------------------------------------
# API Gateway Route - Curriculums Proxy
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "get_curriculums_proxy" {
  api_id             = local.apigw_id
  route_key          = "ANY /curriculums/{proxy+}"
  target             = "integrations/${local.apigw_integration_id_backend}"
  authorization_type = "CUSTOM"
  authorizer_id      = local.apigw_authorizer_id_lambda
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - Get Curriculums
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "get_curriculums" {
  api_id             = local.apigw_id
  route_key          = "GET /curriculums"
  target             = "integrations/${local.apigw_integration_id_backend}"
  authorization_type = "CUSTOM"
  authorizer_id      = local.apigw_authorizer_id_lambda
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - Put Curriculums
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "put_curriculums" {
  api_id             = local.apigw_id
  route_key          = "PUT /curriculums"
  target             = "integrations/${local.apigw_integration_id_backend}"
  authorization_type = "CUSTOM"
  authorizer_id      = local.apigw_authorizer_id_lambda
}
