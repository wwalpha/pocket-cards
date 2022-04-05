# ---------------------------------------------------------------------------------------------
# API Gateway Integration (Lambda) - ECS Task Start
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_integration" "ecs_task_start" {
  api_id                 = local.apigw_id_admin
  integration_type       = "AWS_PROXY"
  connection_type        = "INTERNET"
  integration_method     = "POST"
  integration_uri        = aws_lambda_function.ecs_task_start.arn
  passthrough_behavior   = "WHEN_NO_MATCH"
  payload_format_version = "2.0"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Integration (Lambda) - ECS Task Stop
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_integration" "ecs_task_stop" {
  api_id                 = local.apigw_id_admin
  integration_type       = "AWS_PROXY"
  connection_type        = "INTERNET"
  integration_method     = "POST"
  integration_uri        = aws_lambda_function.ecs_task_stop.arn
  passthrough_behavior   = "WHEN_NO_MATCH"
  payload_format_version = "2.0"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Integration (Lambda) - ECS Task Status
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_integration" "ecs_task_status" {
  api_id                 = local.apigw_id_admin
  integration_type       = "AWS_PROXY"
  connection_type        = "INTERNET"
  integration_method     = "POST"
  integration_uri        = aws_lambda_function.ecs_task_status.arn
  passthrough_behavior   = "WHEN_NO_MATCH"
  payload_format_version = "2.0"
}
