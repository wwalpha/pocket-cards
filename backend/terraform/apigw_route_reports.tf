# ---------------------------------------------------------------------------------------------
# API Gateway Route - Get Reports
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "get_reports" {
  api_id             = local.apigw_id
  route_key          = "GET /reports/{proxy+}"
  target             = "integrations/${local.apigw_integration_id_backend}"
  authorization_type = "CUSTOM"
  authorizer_id      = local.apigw_authorizer_id_lambda
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - Post Reports
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "post_reports" {
  api_id             = local.apigw_id
  route_key          = "POST /reports/{proxy+}"
  target             = "integrations/${local.apigw_integration_id_backend}"
  authorization_type = "CUSTOM"
  authorizer_id      = local.apigw_authorizer_id_lambda
}

resource "aws_apigatewayv2_route" "patch" {
  api_id    = local.apigw_id
  route_key = "PATCH /patch"
  target    = "integrations/${local.apigw_integration_id_backend}"
}
