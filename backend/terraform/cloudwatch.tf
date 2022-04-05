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
# AWS CloudWatch Event Rule - Start at 07:00 
# ----------------------------------------------------------------------------------------------
resource "aws_cloudwatch_event_rule" "startat_0700" {
  name                = "${local.project_name}-ecs-start-at-0700"
  schedule_expression = "cron(0 22 * * ? *)"
  count               = local.prod_only
}

# ----------------------------------------------------------------------------------------------
# AWS CloudWatch Event Rule Target - Start at 07:00 
# ----------------------------------------------------------------------------------------------
resource "aws_cloudwatch_event_target" "startat_0700" {
  rule      = aws_cloudwatch_event_rule.startat_0700[0].name
  target_id = "SendToLambda"
  arn       = aws_lambda_function.ecs_task_start.arn
  count     = local.prod_only
}

# ---------------------------------------------------------------------------------------------
# AWS CloudWatch Event Rule Permission - Start at 07:00 
# ---------------------------------------------------------------------------------------------
resource "aws_lambda_permission" "startat_0700" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.ecs_task_start.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.startat_0700[0].arn
  count         = local.prod_only
}

# ----------------------------------------------------------------------------------------------
# AWS CloudWatch Event Rule - Start at 07:00 weekday
# ----------------------------------------------------------------------------------------------
resource "aws_cloudwatch_event_rule" "stopat_0800" {
  name                = "${local.project_name}-ecs-stop-at-0800"
  schedule_expression = "cron(0 23 * * ? *)"
  count               = local.prod_only
}

# ----------------------------------------------------------------------------------------------
# AWS CloudWatch Event Rule Target - Start at 07:00 
# ----------------------------------------------------------------------------------------------
resource "aws_cloudwatch_event_target" "stopat_0800" {
  rule      = aws_cloudwatch_event_rule.stopat_0800[0].name
  target_id = "SendToLambda"
  arn       = aws_lambda_function.ecs_task_stop.arn
  count     = local.prod_only
}

# ---------------------------------------------------------------------------------------------
# AWS CloudWatch Event Rule Permission - Start at 07:00 
# ---------------------------------------------------------------------------------------------
resource "aws_lambda_permission" "stopat_0800" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.ecs_task_stop.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.stopat_0800[0].arn
  count         = local.prod_only
}

# ----------------------------------------------------------------------------------------------
# AWS CloudWatch Event Rule - Start at 16:00 weekday
# ----------------------------------------------------------------------------------------------
resource "aws_cloudwatch_event_rule" "startat_1600" {
  name                = "${local.project_name}-ecs-start-at-1600"
  schedule_expression = "cron(0 7 * * ? *)"
  count               = local.prod_only
}

# ----------------------------------------------------------------------------------------------
# AWS CloudWatch Event Rule Target - Start at 07:00 
# ----------------------------------------------------------------------------------------------
resource "aws_cloudwatch_event_target" "startat_1600" {
  rule      = aws_cloudwatch_event_rule.startat_1600[0].name
  target_id = "SendToLambda"
  arn       = aws_lambda_function.ecs_task_start.arn
  count     = local.prod_only
}

# ---------------------------------------------------------------------------------------------
# AWS CloudWatch Event Rule Permission - Start at 07:00 
# ---------------------------------------------------------------------------------------------
resource "aws_lambda_permission" "startat_1600" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.ecs_task_start.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.startat_1600[0].arn
  count         = local.prod_only
}

# ----------------------------------------------------------------------------------------------
# AWS CloudWatch Event Rule - Stop at 23:00 
# ----------------------------------------------------------------------------------------------
resource "aws_cloudwatch_event_rule" "stopat_2300" {
  name                = "${local.project_name}-ecs-stop-at-2300"
  schedule_expression = "cron(0 15 * * ? *)"
  count               = local.prod_only
}

# ----------------------------------------------------------------------------------------------
# AWS CloudWatch Event Rule Target - Stop at 23:00 
# ----------------------------------------------------------------------------------------------
resource "aws_cloudwatch_event_target" "stopat_2300" {
  rule      = aws_cloudwatch_event_rule.stopat_2300[0].name
  target_id = "SendToLambda"
  arn       = aws_lambda_function.ecs_task_stop.arn
  count     = local.prod_only
}

# ---------------------------------------------------------------------------------------------
# AWS CloudWatch Event Rule Permission - Stop at 23:00 
# ---------------------------------------------------------------------------------------------
resource "aws_lambda_permission" "stopat_2300" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.ecs_task_stop.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.stopat_2300[0].arn
  count         = local.prod_only
}

