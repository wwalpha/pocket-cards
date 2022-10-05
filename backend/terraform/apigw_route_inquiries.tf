# ---------------------------------------------------------------------------------------------
# API Gateway Route - Get /inquiries
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "get_inquiries" {
  api_id    = local.apigw_id
  route_key = "GET /inquiries"
  target    = "integrations/${local.apigw_integration_id_backend}"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - Post /inquiries
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "post_inquiries" {
  api_id    = local.apigw_id
  route_key = "POST /inquiries"
  target    = "integrations/${local.apigw_integration_id_backend}"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - Delete /inquiries/:id
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "delete_inquiries" {
  api_id    = local.apigw_id
  route_key = "DELETE /inquiries/{proxy+}"
  target    = "integrations/${local.apigw_integration_id_backend}"
}
