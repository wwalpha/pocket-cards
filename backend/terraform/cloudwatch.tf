# ----------------------------------------------------------------------------------------------
# AWS CloudWatch Event Rule
# ----------------------------------------------------------------------------------------------
resource "aws_cloudwatch_event_rule" "this" {
  name        = "${local.project_name}-scheduled-batch"
  description = "Scheduled batch"

  schedule_expression = "cron(0 16 * * ? *)"
}

# ----------------------------------------------------------------------------------------------
# AWS CloudWatch Event Rule Target
# ----------------------------------------------------------------------------------------------
resource "aws_cloudwatch_event_target" "this" {
  rule      = aws_cloudwatch_event_rule.this.name
  target_id = "SendToLambda"
  arn       = aws_lambda_function.batch.arn
}

# ---------------------------------------------------------------------------------------------
# AWS CloudWatch Event Rule Permission (Lambda)
# ---------------------------------------------------------------------------------------------
resource "aws_lambda_permission" "this" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.batch.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.this.arn
}