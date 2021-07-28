# ---------------------------------------------------------------------------------------------
# API Gateway Integration (Lambda) - ECS Task Start
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_integration" "ecs_task_start" {
  api_id                 = local.api_gateway_id
  integration_type       = "AWS_PROXY"
  connection_type        = "INTERNET"
  integration_method     = "POST"
  integration_uri        = aws_lambda_function.ecs_task_start.arn
  passthrough_behavior   = "WHEN_NO_MATCH"
  payload_format_version = "2.0"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route (Lambda) - ECS Task Start
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "ecs_task_start" {
  api_id             = local.api_gateway_id
  route_key          = "POST /admin/start"
  target             = "integrations/${aws_apigatewayv2_integration.ecs_task_start.id}"
  authorizer_id      = local.api_gateway_authorizer_id
  authorization_type = "JWT"
}

resource "aws_apigatewayv2_route" "ecs_task_start_options" {
  api_id    = local.api_gateway_id
  route_key = "OPTIONS /admin/start"
  target    = "integrations/${aws_apigatewayv2_integration.ecs_task_start.id}"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Integration (Lambda) - ECS Task Stop
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_integration" "ecs_task_stop" {
  api_id                 = local.api_gateway_id
  integration_type       = "AWS_PROXY"
  connection_type        = "INTERNET"
  integration_method     = "POST"
  integration_uri        = aws_lambda_function.ecs_task_stop.arn
  passthrough_behavior   = "WHEN_NO_MATCH"
  payload_format_version = "2.0"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route (Lambda) - ECS Task Stop
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "ecs_task_stop" {
  api_id             = local.api_gateway_id
  route_key          = "POST /admin/stop"
  target             = "integrations/${aws_apigatewayv2_integration.ecs_task_stop.id}"
  authorizer_id      = local.api_gateway_authorizer_id
  authorization_type = "JWT"
}

resource "aws_apigatewayv2_route" "ecs_task_stop_options" {
  api_id    = local.api_gateway_id
  route_key = "OPTIONS /admin/stop"
  target    = "integrations/${aws_apigatewayv2_integration.ecs_task_stop.id}"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Integration (Lambda) - ECS Task Status
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_integration" "ecs_task_status" {
  api_id                 = local.api_gateway_id
  integration_type       = "AWS_PROXY"
  connection_type        = "INTERNET"
  integration_method     = "POST"
  integration_uri        = aws_lambda_function.ecs_task_status.arn
  passthrough_behavior   = "WHEN_NO_MATCH"
  payload_format_version = "2.0"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route (Lambda) - ECS Task Status
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "ecs_task_status" {
  api_id             = local.api_gateway_id
  route_key          = "GET /admin/status"
  target             = "integrations/${aws_apigatewayv2_integration.ecs_task_status.id}"
  authorizer_id      = local.api_gateway_authorizer_id
  authorization_type = "JWT"
}

resource "aws_apigatewayv2_route" "ecs_task_status_options" {
  api_id    = local.api_gateway_id
  route_key = "OPTIONS /admin/status"
  target    = "integrations/${aws_apigatewayv2_integration.ecs_task_status.id}"
}
