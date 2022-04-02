# ---------------------------------------------------------------------------------------------
# API Gateway Route - Group Functions
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "get_groups" {
  api_id             = local.apigw_id
  route_key          = "GET /groups"
  target             = "integrations/${local.apigw_integration_id_backend}"
  authorization_type = "CUSTOM"
  authorizer_id      = local.apigw_authorizer_id_lambda
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - Group Functions
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "put_groups" {
  api_id             = local.apigw_id
  route_key          = "PUT /groups"
  target             = "integrations/${local.apigw_integration_id_backend}"
  authorization_type = "CUSTOM"
  authorizer_id      = local.apigw_authorizer_id_lambda
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - Group Functions
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "opts_group" {
  api_id    = local.apigw_id
  route_key = "OPTIONS /groups"
  target    = "integrations/${local.apigw_integration_id_backend}"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - Group Functions
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "post_group_func" {
  api_id             = local.apigw_id
  route_key          = "POST /groups/{proxy+}"
  target             = "integrations/${local.apigw_integration_id_backend}"
  authorization_type = "CUSTOM"
  authorizer_id      = local.apigw_authorizer_id_lambda
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - Group Functions
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "get_group_func" {
  api_id             = local.apigw_id
  route_key          = "GET /groups/{proxy+}"
  target             = "integrations/${local.apigw_integration_id_backend}"
  authorization_type = "CUSTOM"
  authorizer_id      = local.apigw_authorizer_id_lambda
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - Group Functions
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "put_group_func" {
  api_id             = local.apigw_id
  route_key          = "PUT /groups/{proxy+}"
  target             = "integrations/${local.apigw_integration_id_backend}"
  authorization_type = "CUSTOM"
  authorizer_id      = local.apigw_authorizer_id_lambda
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - Group Functions
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "del_group_func" {
  api_id             = local.apigw_id
  route_key          = "DELETE /groups/{proxy+}"
  target             = "integrations/${local.apigw_integration_id_backend}"
  authorization_type = "CUSTOM"
  authorizer_id      = local.apigw_authorizer_id_lambda
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - Group Functions
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "opts_group_func" {
  api_id    = local.apigw_id
  route_key = "OPTIONS /groups/{proxy+}"
  target    = "integrations/${local.apigw_integration_id_backend}"
}
