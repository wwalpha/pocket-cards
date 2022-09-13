# # ---------------------------------------------------------------------------------------------
# # API Gateway Integration - Connect
# # ---------------------------------------------------------------------------------------------
# resource "aws_apigatewayv2_integration" "connect_dev" {
#   api_id             = aws_apigatewayv2_api.wss.id
#   connection_type    = "VPC_LINK"
#   connection_id      = aws_api_gateway_vpc_link.wss[0].id
#   integration_method = "ANY"
#   integration_type   = "HTTP_PROXY"
#   integration_uri    = "http://${aws_lb.wss[0].dns_name}"

#   count = local.is_dev_only
# }

# # ---------------------------------------------------------------------------------------------
# # API Gateway Integration - Connect Response
# # ---------------------------------------------------------------------------------------------
# resource "aws_apigatewayv2_integration_response" "connect_dev" {
#   api_id                   = aws_apigatewayv2_api.wss.id
#   integration_id           = aws_apigatewayv2_integration.connect_dev[0].id
#   integration_response_key = "$default"

#   count = local.is_dev_only
# }

# # ---------------------------------------------------------------------------------------------
# # API Gateway Integration - Disconnect
# # ---------------------------------------------------------------------------------------------
# resource "aws_apigatewayv2_integration" "disconnect_dev" {
#   api_id             = aws_apigatewayv2_api.wss.id
#   connection_type    = "VPC_LINK"
#   connection_id      = aws_api_gateway_vpc_link.wss[0].id
#   integration_method = "ANY"
#   integration_type   = "HTTP_PROXY"
#   integration_uri    = "http://${aws_lb.wss[0].dns_name}"

#   count = local.is_dev_only
# }

# # ---------------------------------------------------------------------------------------------
# # API Gateway Integration - Default
# # ---------------------------------------------------------------------------------------------
# resource "aws_apigatewayv2_integration" "default_dev" {
#   api_id             = aws_apigatewayv2_api.wss.id
#   connection_type    = "VPC_LINK"
#   connection_id      = aws_api_gateway_vpc_link.wss[0].id
#   integration_method = "ANY"
#   integration_type   = "HTTP_PROXY"
#   integration_uri    = "http://${aws_lb.wss[0].dns_name}"

#   count = local.is_dev_only
# }

# # ---------------------------------------------------------------------------------------------
# # API Gateway Integration - Prod
# # ---------------------------------------------------------------------------------------------
# resource "aws_apigatewayv2_integration" "connect_prod" {
#   api_id             = aws_apigatewayv2_api.wss.id
#   integration_method = "ANY"
#   integration_type   = "HTTP_PROXY"
#   integration_uri    = aws_service_discovery_service.this.arn

#   count = local.is_prod_only
# }



# # ---------------------------------------------------------------------------------------------
# # API Gateway Integration - Prod Response
# # ---------------------------------------------------------------------------------------------
# resource "aws_apigatewayv2_integration_response" "connect_prod" {
#   api_id                   = aws_apigatewayv2_api.wss.id
#   integration_id           = aws_apigatewayv2_integration.connect_prod[0].id
#   integration_response_key = "/200/"
#   count                    = local.is_prod_only
# }

# # ---------------------------------------------------------------------------------------------
# # API Gateway Route - Socket Connect
# # ---------------------------------------------------------------------------------------------
# resource "aws_apigatewayv2_route" "connect" {
#   api_id    = aws_apigatewayv2_api.wss.id
#   route_key = "$connect"

#   target = local.is_dev ? "integrations/${aws_apigatewayv2_integration.connect_dev[0].id}" : "integrations/${aws_apigatewayv2_integration.connect_prod[0].id}"
# }

# # ---------------------------------------------------------------------------------------------
# # API Gateway Route - Socket Disconnect
# # ---------------------------------------------------------------------------------------------
# resource "aws_apigatewayv2_route" "disconnect" {
#   api_id    = aws_apigatewayv2_api.wss.id
#   route_key = "$disconnect"

#   target = local.is_dev ? "integrations/${aws_apigatewayv2_integration.disconnect_dev[0].id}" : "integrations/${aws_apigatewayv2_integration.connect_prod[0].id}"
# }

# # ---------------------------------------------------------------------------------------------
# # API Gateway Route - Socket Default
# # ---------------------------------------------------------------------------------------------
# resource "aws_apigatewayv2_route" "default" {
#   api_id    = aws_apigatewayv2_api.wss.id
#   route_key = "$default"

#   target = local.is_dev ? "integrations/${aws_apigatewayv2_integration.default_dev[0].id}" : "integrations/${aws_apigatewayv2_integration.connect_prod[0].id}"
# }
