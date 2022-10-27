# ---------------------------------------------------------------------------------------------
# CloudWatch Log Group - API Gateway
# ---------------------------------------------------------------------------------------------
resource "aws_cloudwatch_log_group" "api" {
  name              = "/aws/apigateway/${aws_apigatewayv2_api.this.id}/${local.api_stage_name}"
  retention_in_days = 7
}

# ---------------------------------------------------------------------------------------------
# CloudWatch Log Group - API Gateway WebSocket
# ---------------------------------------------------------------------------------------------
resource "aws_cloudwatch_log_group" "wss" {
  name              = "/aws/apigateway/${aws_apigatewayv2_api.wss.id}/${local.api_stage_name}"
  retention_in_days = 7
}
