# ---------------------------------------------------------------------------------------------
# API Gateway Route (Lambda) - ECS Task Status
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "ecs_task_status" {
  api_id             = local.apigw_id_admin
  route_key          = "GET /status"
  target             = "integrations/${aws_apigatewayv2_integration.ecs_task_status.id}"
  authorizer_id      = local.apigw_authorizer_id_admin
  authorization_type = "JWT"
}

resource "aws_apigatewayv2_route" "ecs_task_status_options" {
  api_id    = local.apigw_id_admin
  route_key = "OPTIONS /status"
  target    = "integrations/${aws_apigatewayv2_integration.ecs_task_status.id}"
}


# ---------------------------------------------------------------------------------------------
# API Gateway Route (Lambda) - ECS Task Stop
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "ecs_task_stop" {
  api_id             = local.apigw_id_admin
  route_key          = "POST /stop"
  target             = "integrations/${aws_apigatewayv2_integration.ecs_task_stop.id}"
  authorizer_id      = local.apigw_authorizer_id_admin
  authorization_type = "JWT"
}

resource "aws_apigatewayv2_route" "ecs_task_stop_options" {
  api_id    = local.apigw_id_admin
  route_key = "OPTIONS /stop"
  target    = "integrations/${aws_apigatewayv2_integration.ecs_task_stop.id}"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route (Lambda) - ECS Task Start
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "ecs_task_start" {
  api_id             = local.apigw_id_admin
  route_key          = "POST /start"
  target             = "integrations/${aws_apigatewayv2_integration.ecs_task_start.id}"
  authorizer_id      = local.apigw_authorizer_id_admin
  authorization_type = "JWT"
}

resource "aws_apigatewayv2_route" "ecs_task_start_options" {
  api_id    = local.apigw_id_admin
  route_key = "OPTIONS /start"
  target    = "integrations/${aws_apigatewayv2_integration.ecs_task_start.id}"
}
