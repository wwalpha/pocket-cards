# ---------------------------------------------------------------------------------------------
# API Gateway
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_api" "wss" {
  name                       = "${local.project_name}-wss-api"
  protocol_type              = "WEBSOCKET"
  route_selection_expression = "$request.body.action"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Authorizer
# ---------------------------------------------------------------------------------------------
# resource "aws_apigatewayv2_authorizer" "wss" {
#   api_id           = aws_apigatewayv2_api.wss.id
#   authorizer_type  = "REQUEST"
#   identity_sources = ["$request.header.Authorization"]
#   name             = "Cognito"

#   jwt_configuration {
#     audience = [
#       aws_cognito_user_pool_client.this.id,
#       aws_cognito_user_pool_client.ios.id
#     ]
#     issuer = "https://${aws_cognito_user_pool.this.endpoint}"
#   }
# }

# ---------------------------------------------------------------------------------------------
# API Gateway Stage
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_stage" "wss" {
  api_id      = aws_apigatewayv2_api.wss.id
  name        = "v1"
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.wss.arn
    format = jsonencode(
      {
        apiId              = "$context.apiId"
        httpMethod         = "$context.httpMethod"
        ip                 = "$context.identity.sourceIp"
        protocol           = "$context.protocol"
        requestId          = "$context.requestId"
        requestTime        = "$context.requestTime"
        responseLength     = "$context.responseLength"
        responseLatency    = "$context.responseLatency"
        routeKey           = "$context.routeKey"
        integrationLatency = "$context.integrationLatency"
        status             = "$context.status"
        error              = "$context.authorizer.error"
      }
    )
  }
}

# ---------------------------------------------------------------------------------------------
# API Gateway Domain Name
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_domain_name" "wss" {
  depends_on  = [aws_acm_certificate_validation.api]
  domain_name = "wss.${local.domain_name}"

  domain_name_configuration {
    certificate_arn = aws_acm_certificate.api.arn
    endpoint_type   = "REGIONAL"
    security_policy = "TLS_1_2"
  }
}

# ---------------------------------------------------------------------------------------------
# API Gateway Domain API Mapping
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_api_mapping" "wss" {
  api_id          = aws_apigatewayv2_api.wss.id
  domain_name     = aws_apigatewayv2_domain_name.wss.domain_name
  stage           = aws_apigatewayv2_stage.wss.id
  api_mapping_key = "v1"
}

# ---------------------------------------------------------------------------------------------
# API Gateway VPC Link
# ---------------------------------------------------------------------------------------------
resource "aws_api_gateway_vpc_link" "wss" {
  name        = "${local.project_name}-wss"
  target_arns = [aws_lb.wss[0].arn]

  count = local.is_dev_only
}
