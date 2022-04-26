# ---------------------------------------------------------------------------------------------
# API Gateway Route - Get Questions
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "get_questions" {
  api_id             = local.apigw_id
  route_key          = "GET /questions/{proxy+}"
  target             = "integrations/${local.apigw_integration_id_backend}"
  authorization_type = "CUSTOM"
  authorizer_id      = local.apigw_authorizer_id_lambda
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - Post Questions
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "post_questions" {
  api_id             = local.apigw_id
  route_key          = "POST /questions/{proxy+}"
  target             = "integrations/${local.apigw_integration_id_backend}"
  authorization_type = "CUSTOM"
  authorizer_id      = local.apigw_authorizer_id_lambda
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - PUT Questions
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "put_questions" {
  api_id             = local.apigw_id
  route_key          = "PUT /questions/{proxy+}"
  target             = "integrations/${local.apigw_integration_id_backend}"
  authorization_type = "CUSTOM"
  authorizer_id      = local.apigw_authorizer_id_lambda
}
