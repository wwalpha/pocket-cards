# ---------------------------------------------------------------------------------------------
# API Gateway
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_api" "this" {
  name          = "${local.project_name}-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = [
      local.is_dev ? "*" : "https://${aws_acm_certificate.web.domain_name}"
    ]
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
    audience = [aws_cognito_user_pool_client.this.id]
    issuer   = "https://${aws_cognito_user_pool.this.endpoint}"
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
  domain_name = aws_acm_certificate.api.domain_name

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
  api_id      = aws_apigatewayv2_api.this.id
  domain_name = aws_apigatewayv2_domain_name.this.id
  stage       = aws_apigatewayv2_stage.this.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway VPC Link
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_vpc_link" "this" {
  name               = "${local.project_name}-link"
  security_group_ids = [aws_security_group.private_link[0].id]
  subnet_ids         = module.vpc.public_subnets

  count = local.normal
}

# ---------------------------------------------------------------------------------------------
# API Gateway Integration - VPC_LINK
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_integration" "link" {
  api_id             = aws_apigatewayv2_api.this.id
  connection_type    = "VPC_LINK"
  connection_id      = aws_apigatewayv2_vpc_link.this[0].id
  integration_method = "ANY"
  integration_type   = "HTTP_PROXY"
  integration_uri    = aws_lb_listener.this.arn
  # integration_uri    = aws_service_discovery_service.this.arn

  count = local.normal
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "link" {
  api_id    = aws_apigatewayv2_api.this.id
  route_key = "ANY /{proxy+}"

  target = "integrations/${aws_apigatewayv2_integration.link[0].id}"

  count = local.normal
}

# ---------------------------------------------------------------------------------------------
# API Gateway Integration - HTTP URI
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_integration" "http" {
  api_id             = aws_apigatewayv2_api.this.id
  connection_type    = "INTERNET"
  integration_method = "ANY"
  integration_type   = "HTTP_PROXY"
  integration_uri    = "http://backend.${local.domain_name}/{proxy}"

  count = local.simple
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "http" {
  api_id    = aws_apigatewayv2_api.this.id
  route_key = "ANY /{proxy+}"

  target = "integrations/${aws_apigatewayv2_integration.http[0].id}"

  count = local.simple
}

# # ---------------------------------------------------------------------------------------------
# # Amazon API REST API
# # ---------------------------------------------------------------------------------------------
# module "api" {
#   source = "github.com/wwalpha/terraform-module-apigateway/api"

#   api_name                   = local.project_name
#   api_endpoint_configuration = local.api_endpoint_configuration
#   cognito_user_pool_name     = local.remote_unmu.cognito_user_pool_name
#   authorizer_name            = "CognitoAuthorizer"
#   authorizer_type            = "COGNITO_USER_POOLS"

#   # authorizer_role_name             = "${local.project_name_uc}_APIGateway_AuthorizerRole"
#   # authorizer_policy                = "${file("iam/apigateway_policy_authorizer.json")}"
#   authorizer_result_ttl_in_seconds = 0
# }

# # ---------------------------------------------------------------------------------------------
# # Amazon API Deployment
# # ---------------------------------------------------------------------------------------------
# module "deployment" {
#   source = "github.com/wwalpha/terraform-module-apigateway/deployment"

#   rest_api_id                            = module.api.id
#   stage_name                             = "v1"
#   custom_domain_name                     = aws_acm_certificate.api.domain_name
#   custom_domain_regional_certificate_arn = aws_acm_certificate_validation.api.certificate_arn
#   custom_domain_endpoint_configuration   = local.api_endpoint_configuration

#   integration_ids = [
#     module.m001.integration_id,
#     module.m002.integration_id,
#     module.m003.integration_id,
#     module.m004.integration_id,
#     module.m005.integration_id,
#     module.m006.integration_id,
#     module.m007.integration_id,
#     module.m008.integration_id,
#     module.m009.integration_id,
#     module.m010.integration_id,
#     module.m011.integration_id,
#     module.m012.integration_id,
#     module.m013.integration_id,
#   ]

#   deployment_md5 = base64encode(join("", local.deployment_files))
# }

# # ----------------------------------------------------------------------------------------------------------------------
# # Amazon API Gateway Usage Plan
# # ----------------------------------------------------------------------------------------------------------------------
# # resource "aws_api_gateway_usage_plan" "usage_plan" {
# #   name = "ipa_usage_plan"

# #   api_stages {
# #     api_id = "${aws_api_gateway_rest_api.ipa_api.id}"
# #     stage  = "${aws_api_gateway_deployment.api_deployment.stage_name}"
# #   }

# #   quota_settings {
# #     limit  = 200
# #     period = "DAY"
# #   }

# #   throttle_settings {
# #     burst_limit = 5
# #     rate_limit  = 5
# #   }
# # }

# # resource "aws_api_gateway_api_key" "api_key" {
# #   name = "ipa_api_key"
# # }

# # resource "aws_api_gateway_usage_plan_key" "usage_plan_key" {
# #   key_id        = "${aws_api_gateway_api_key.api_key.id}"
# #   key_type      = "API_KEY"
# #   usage_plan_id = "${aws_api_gateway_usage_plan.usage_plan.id}"
# # }
# # resource "aws_api_gateway_method_settings" "this" {
# #   rest_api_id = "${aws_api_gateway_rest_api.this.id}"
# #   stage_name  = "${aws_api_gateway_stage.this.stage_name}"
# #   method_path = "*/*"

# #   settings {
# #     metrics_enabled = false
# #     logging_level   = "INFO"
# #   }
# # }

# # ---------------------------------------------------------------------------------------------
# # Amazon API Method
# # ---------------------------------------------------------------------------------------------
# module "version" {
#   source = "github.com/wwalpha/terraform-module-apigateway/method"

#   rest_api_id        = module.api.id
#   resource_id        = module.api.root_resource_id
#   resource_path      = "/"
#   http_method        = "GET"
#   integration_type   = "MOCK"
#   response_templates = jsonencode(local.response_version)
# }

# # ---------------------------------------------------------------------------------------------
# # Amazon API CORS
# # ---------------------------------------------------------------------------------------------
# # module "CORS_ROOT" {
# #   source = "github.com/wwalpha/terraform-module-registry/aws/api-cors"
# #   rest_api_id = "${aws_api_gateway_rest_api.this.id}"
# #   resource_id = "${aws_api_gateway_rest_api.this.root_resource_id}"
# #   allow_origin = "${var.cors_allow_origin}"
# #   allow_method = "'GET,OPTIONS'"
# # }
