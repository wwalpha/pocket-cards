# # ---------------------------------------------------------------------------------------------
# # API Gateway Route - Auth Health
# # ---------------------------------------------------------------------------------------------
# resource "aws_apigatewayv2_route" "get_auth_health" {
#   api_id    = aws_apigatewayv2_api.this.id
#   route_key = "GET /auth/health"
#   target    = "integrations/${aws_apigatewayv2_integration.auth.id}"
# }

# # ---------------------------------------------------------------------------------------------
# # API Gateway Route - Auth
# # ---------------------------------------------------------------------------------------------
# resource "aws_apigatewayv2_route" "post_auth" {
#   api_id    = aws_apigatewayv2_api.this.id
#   route_key = "POST /auth/login"
#   target    = "integrations/${aws_apigatewayv2_integration.auth.id}"
# }

# # ---------------------------------------------------------------------------------------------
# # API Gateway Route - Auth Token Refresh
# # ---------------------------------------------------------------------------------------------
# resource "aws_apigatewayv2_route" "post_auth_refresh" {
#   api_id    = aws_apigatewayv2_api.this.id
#   route_key = "POST /auth/refresh"
#   target    = "integrations/${aws_apigatewayv2_integration.auth.id}"
# }

# # ---------------------------------------------------------------------------------------------
# # API Gateway Route - Group Functions
# # ---------------------------------------------------------------------------------------------
# resource "aws_apigatewayv2_route" "post_group_func" {
#   api_id    = aws_apigatewayv2_api.this.id
#   route_key = "POST /groups/{proxy+}"
#   target    = "integrations/${aws_apigatewayv2_integration.backend.id}"
# }
