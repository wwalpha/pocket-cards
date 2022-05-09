# ---------------------------------------------------------------------------------------------
# API Gateway Route - Weekly Path
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "get_weekly" {
  api_id             = local.apigw_id
  route_key          = "GET /weekly/{proxy+}"
  target             = "integrations/${local.apigw_integration_id_backend}"
  authorization_type = "CUSTOM"
  authorizer_id      = local.apigw_authorizer_id_lambda
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - Weekly Path
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "post_weekly" {
  api_id             = local.apigw_id
  route_key          = "POST /weekly/{proxy+}"
  target             = "integrations/${local.apigw_integration_id_backend}"
  authorization_type = "CUSTOM"
  authorizer_id      = local.apigw_authorizer_id_lambda
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - Study Path
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "get_study" {
  api_id             = local.apigw_id
  route_key          = "GET /study/{proxy+}"
  target             = "integrations/${local.apigw_integration_id_backend}"
  authorization_type = "CUSTOM"
  authorizer_id      = local.apigw_authorizer_id_lambda
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - Study Path
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "post_study" {
  api_id             = local.apigw_id
  route_key          = "POST /study/{proxy+}"
  target             = "integrations/${local.apigw_integration_id_backend}"
  authorization_type = "CUSTOM"
  authorizer_id      = local.apigw_authorizer_id_lambda
}
