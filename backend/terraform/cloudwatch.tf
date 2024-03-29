# ----------------------------------------------------------------------------------------------
# AWS CloudWatch Event Rule 
# ----------------------------------------------------------------------------------------------
resource "aws_cloudwatch_event_rule" "this" {
  name        = "${local.project_name}-scheduled-batch"
  description = "Scheduled batch"

  schedule_expression = "cron(0 16 * * ? *)"
  is_enabled          = local.is_dev ? false : true
}

# ----------------------------------------------------------------------------------------------
# AWS CloudWatch Event Rule Target
# ----------------------------------------------------------------------------------------------
resource "aws_cloudwatch_event_target" "this" {
  rule     = aws_cloudwatch_event_rule.this.name
  arn      = aws_sfn_state_machine.this.arn
  role_arn = aws_iam_role.batch_event.arn
  input    = <<DOC
{
  "S3Bucket": "${local.bucket_name_archive}",
  "TableArn": "arn:aws:dynamodb:${local.region}:${local.account_id}:table/${local.dynamodb_name_traces}",
  "AthenaDB": "${local.athena_schema_name}",
  "AthenaWG": "${local.athena_workgroup_name}"
}
DOC
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
# AWS CloudWatch Event Rule - Start at 21:00 weekday
# ----------------------------------------------------------------------------------------------
resource "aws_cloudwatch_event_rule" "startat_2000" {
  name                = "${local.project_name}-ecs-start-at-2100"
  schedule_expression = "cron(0 12 * * ? *)"
  is_enabled          = local.is_dev ? false : true
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
  schedule_expression = "cron(0 15 * * ? *)"
  is_enabled          = local.is_dev ? false : true
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

# ----------------------------------------------------------------------------------------------
# AWS CloudWatch Event Rule - ECS Task Start Failure
# ----------------------------------------------------------------------------------------------
resource "aws_cloudwatch_event_rule" "ecs_task_start_failure" {
  name       = "${local.project_name}-ecs-task-failure"
  is_enabled = local.is_dev ? false : true

  event_pattern = <<EOF
{
  "source": ["aws.ecs"],
  "detail-type": ["ECS Task State Change"],
  "detail": {
    "clusterArn": ["${data.aws_ecs_cluster.this.arn}"],
    "desiredStatus": ["STOPPED"],
    "lastStatus": ["STOPPED"],
    "stopCode": ["TaskFailedToStart"]
  }
}
EOF
}

# ----------------------------------------------------------------------------------------------
# AWS CloudWatch Event Rule Target - Email Notify
# ----------------------------------------------------------------------------------------------
resource "aws_cloudwatch_event_target" "email_notify" {
  rule      = aws_cloudwatch_event_rule.ecs_task_start_failure.name
  target_id = "SendToLambda"
  arn       = aws_lambda_function.sns_notify.arn
}

# ---------------------------------------------------------------------------------------------
# AWS CloudWatch Event Rule Permission - Email Notify
# ---------------------------------------------------------------------------------------------
resource "aws_lambda_permission" "email_notify" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.sns_notify.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.ecs_task_start_failure.arn
}

# ---------------------------------------------------------------------------------------------
# CloudWatch Log Group - State machine
# ---------------------------------------------------------------------------------------------
resource "aws_cloudwatch_log_group" "sfn" {
  name              = "/aws/vendedlogs/states/pkc-batchflow-Logs"
  retention_in_days = 7
}
