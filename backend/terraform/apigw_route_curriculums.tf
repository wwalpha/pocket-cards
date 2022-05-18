# ---------------------------------------------------------------------------------------------
# API Gateway Route - Curriculums Proxy
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "get_curriculums_proxy" {
  api_id             = local.apigw_id
  route_key          = "DELETE /curriculums/{proxy+}"
  target             = "integrations/${local.apigw_integration_id_backend}"
  authorization_type = "CUSTOM"
  authorizer_id      = local.apigw_authorizer_id_lambda
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - Curriculums Proxy
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "post_curriculums_proxy" {
  api_id             = local.apigw_id
  route_key          = "POST /curriculums/{proxy+}"
  target             = "integrations/${local.apigw_integration_id_backend}"
  authorization_type = "CUSTOM"
  authorizer_id      = local.apigw_authorizer_id_lambda
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - Curriculums Proxy
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "get2_curriculums_proxy" {
  api_id             = local.apigw_id
  route_key          = "GET /curriculums/{proxy+}"
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
# API Gateway Route - POST Curriculums
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "post_curriculums" {
  api_id             = local.apigw_id
  route_key          = "POST /curriculums"
  target             = "integrations/${local.apigw_integration_id_backend}"
  authorization_type = "CUSTOM"
  authorizer_id      = local.apigw_authorizer_id_lambda
}
