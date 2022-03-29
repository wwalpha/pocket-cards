# ---------------------------------------------------------------------------------------------
# API Gateway
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_api" "this" {
  name          = "${local.project_name}-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = ["*"]
    allow_headers = ["*"]
    allow_methods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
  }
}

# ---------------------------------------------------------------------------------------------
# API Gateway Authorizer
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_authorizer" "this" {
  api_id           = aws_apigatewayv2_api.this.id
  authorizer_type  = "JWT"
  identity_sources = ["$request.header.Authorization"]
  name             = "Cognito"

  jwt_configuration {
    audience = [
      aws_cognito_user_pool_client.this.id,
      aws_cognito_user_pool_client.ios.id
    ]
    issuer = "https://${aws_cognito_user_pool.this.endpoint}"
  }
}

# ---------------------------------------------------------------------------------------------
# API Gateway Stage
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_stage" "this" {
  api_id      = aws_apigatewayv2_api.this.id
  name        = "$default"
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api.arn
    format = jsonencode(
      {
        httpMethod     = "$context.httpMethod"
        ip             = "$context.identity.sourceIp"
        protocol       = "$context.protocol"
        requestId      = "$context.requestId"
        requestTime    = "$context.requestTime"
        responseLength = "$context.responseLength"
        routeKey       = "$context.routeKey"
        status         = "$context.status"
      }
    )
  }
}

# ---------------------------------------------------------------------------------------------
# API Gateway Domain Name
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_domain_name" "this" {
  depends_on  = [aws_acm_certificate_validation.api]
  domain_name = "api.${local.domain_name}"

  domain_name_configuration {
    certificate_arn = aws_acm_certificate.api.arn
    endpoint_type   = "REGIONAL"
    security_policy = "TLS_1_2"
  }
}

# ---------------------------------------------------------------------------------------------
# API Gateway Domain API Mapping
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_api_mapping" "this" {
  api_id          = aws_apigatewayv2_api.this.id
  domain_name     = aws_apigatewayv2_domain_name.this.domain_name
  stage           = aws_apigatewayv2_stage.this.id
  api_mapping_key = "v1"
}

# ---------------------------------------------------------------------------------------------
# API Gateway VPC Link
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_vpc_link" "this" {
  name               = "${local.project_name}-link"
  security_group_ids = [aws_security_group.private_link.id]
  subnet_ids         = local.subnets
}

# ---------------------------------------------------------------------------------------------
# API Gateway Integration - VPC_LINK
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_integration" "link" {
  api_id             = aws_apigatewayv2_api.this.id
  connection_type    = "VPC_LINK"
  connection_id      = aws_apigatewayv2_vpc_link.this.id
  integration_method = "ANY"
  integration_type   = "HTTP_PROXY"
  integration_uri    = aws_service_discovery_service.this.arn
}

# ---------------------------------------------------------------------------------------------
# API Gateway - Admin
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_api" "admin" {
  name          = "${local.project_name}-admin"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = ["*"]
    allow_headers = ["*"]
    allow_methods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
  }
}

# ---------------------------------------------------------------------------------------------
# API Gateway Stage - Admin
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_stage" "admin" {
  api_id      = aws_apigatewayv2_api.admin.id
  name        = "$default"
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api.arn
    format = jsonencode(
      {
        httpMethod     = "$context.httpMethod"
        ip             = "$context.identity.sourceIp"
        protocol       = "$context.protocol"
        requestId      = "$context.requestId"
        requestTime    = "$context.requestTime"
        responseLength = "$context.responseLength"
        routeKey       = "$context.routeKey"
        status         = "$context.status"
      }
    )
  }
}

# ---------------------------------------------------------------------------------------------
# API Gateway Domain API Mapping - Admin
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_api_mapping" "admin" {
  api_id          = aws_apigatewayv2_api.admin.id
  domain_name     = aws_apigatewayv2_domain_name.this.domain_name
  stage           = aws_apigatewayv2_stage.admin.id
  api_mapping_key = "admin"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Authorizer - Admin
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_authorizer" "admin" {
  api_id           = aws_apigatewayv2_api.admin.id
  authorizer_type  = "JWT"
  identity_sources = ["$request.header.Authorization"]
  name             = "Cognito"

  jwt_configuration {
    audience = [aws_cognito_user_pool_client.this.id]
    issuer   = "https://${aws_cognito_user_pool.this.endpoint}"
  }
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - Backend
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "backend_get" {
  api_id             = aws_apigatewayv2_api.this.id
  route_key          = "GET /backend/{proxy+}"
  target             = "integrations/${aws_apigatewayv2_integration.link.id}"
  authorizer_id      = aws_apigatewayv2_authorizer.this.id
  authorization_type = "JWT"
}

resource "aws_apigatewayv2_route" "backend_post" {
  api_id             = aws_apigatewayv2_api.this.id
  route_key          = "POST /backend/{proxy+}"
  target             = "integrations/${aws_apigatewayv2_integration.link.id}"
  authorizer_id      = aws_apigatewayv2_authorizer.this.id
  authorization_type = "JWT"
}

resource "aws_apigatewayv2_route" "backend_put" {
  api_id             = aws_apigatewayv2_api.this.id
  route_key          = "PUT /backend/{proxy+}"
  target             = "integrations/${aws_apigatewayv2_integration.link.id}"
  authorizer_id      = aws_apigatewayv2_authorizer.this.id
  authorization_type = "JWT"
}

resource "aws_apigatewayv2_route" "backend_delete" {
  api_id             = aws_apigatewayv2_api.this.id
  route_key          = "DELETE /backend/{proxy+}"
  target             = "integrations/${aws_apigatewayv2_integration.link.id}"
  authorizer_id      = aws_apigatewayv2_authorizer.this.id
  authorization_type = "JWT"
}

resource "aws_apigatewayv2_route" "backend_options" {
  api_id    = aws_apigatewayv2_api.this.id
  route_key = "OPTIONS /backend/{proxy+}"
  target    = "integrations/${aws_apigatewayv2_integration.link.id}"
}
