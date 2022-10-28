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

# ----------------------------------------------------------------------------------------------
# AWS CloudWatch Event Rule - Start at 20:00 weekday
# ----------------------------------------------------------------------------------------------
resource "aws_cloudwatch_event_rule" "startat_2000" {
  name                = "${local.project_name}-ecs-start-at-2000"
  schedule_expression = "cron(0 11/22 * * ? *)"
}

# ----------------------------------------------------------------------------------------------
# AWS CloudWatch Event Rule Target - Start at 20:00 
# ----------------------------------------------------------------------------------------------
resource "aws_cloudwatch_event_target" "startat_2000" {
  depends_on = [aws_cloudwatch_event_rule.startat_2000]
  rule       = aws_cloudwatch_event_rule.startat_2000.name
  target_id  = "SendToLambda"
  arn        = aws_lambda_function.ecs_task_start.arn
}

# ---------------------------------------------------------------------------------------------
# AWS CloudWatch Event Rule Permission - Start at 20:00 
# ---------------------------------------------------------------------------------------------
resource "aws_lambda_permission" "startat_2000" {
  depends_on    = [aws_cloudwatch_event_target.startat_2000]
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.ecs_task_start.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.startat_2000.arn
}

# ----------------------------------------------------------------------------------------------
# AWS CloudWatch Event Rule - Stop at 24:00 
# ----------------------------------------------------------------------------------------------
resource "aws_cloudwatch_event_rule" "stopat_2400" {
  name                = "${local.project_name}-ecs-stop-at-2400"
  schedule_expression = "cron(0 15/23 * * ? *)"
}

# ----------------------------------------------------------------------------------------------
# AWS CloudWatch Event Rule Target - Stop at 24:00 
# ----------------------------------------------------------------------------------------------
resource "aws_cloudwatch_event_target" "stopat_2400" {
  rule      = aws_cloudwatch_event_rule.stopat_2400.name
  target_id = "SendToLambda"
  arn       = aws_lambda_function.ecs_task_stop.arn
}

# ---------------------------------------------------------------------------------------------
# AWS CloudWatch Event Rule Permission - Stop at 24:00 
# ---------------------------------------------------------------------------------------------
resource "aws_lambda_permission" "stopat_2400" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.ecs_task_stop.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.stopat_2400.arn
}
