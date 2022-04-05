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
