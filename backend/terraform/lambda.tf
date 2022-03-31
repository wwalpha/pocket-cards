# ----------------------------------------------------------------------------------------------
# Lambda Function - ECS Task Start
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function" "ecs_task_start" {
  filename         = data.archive_file.ecs_task_start.output_path
  source_code_hash = data.archive_file.ecs_task_start.output_base64sha256
  function_name    = "${local.project_name}-ecs-task-start"
  handler          = local.lambda_handler
  memory_size      = 128
  role             = aws_iam_role.ecs_task_start.arn
  runtime          = local.lambda_runtime
  timeout          = 10
  environment {
    variables = {
      CLUSTER_ARN         = data.aws_ecs_cluster.this.arn
      SERVICE_ARN_BACKEND = data.aws_ecs_service.backend.arn
      SERVICE_ARN_AUTH    = data.aws_ecs_service.auth.arn
      SERVICE_ARN_USERS   = data.aws_ecs_service.users.arn
    }
  }
}

data "archive_file" "ecs_task_start" {
  type        = "zip"
  source_dir  = "../nodejs/lambda/start/dist"
  output_path = "../nodejs/lambda/start/dist.zip"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Permission (Lambda) - ECS Task Start
# ---------------------------------------------------------------------------------------------
resource "aws_lambda_permission" "ecs_task_start" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.ecs_task_start.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${data.aws_apigatewayv2_api.admin.execution_arn}/*/*/start"
}

# ----------------------------------------------------------------------------------------------
# Lambda Function - ECS Task Stop
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function" "ecs_task_stop" {
  filename         = data.archive_file.ecs_task_stop.output_path
  source_code_hash = data.archive_file.ecs_task_stop.output_base64sha256
  function_name    = "${local.project_name}-ecs-task-stop"
  handler          = local.lambda_handler
  memory_size      = 128
  role             = aws_iam_role.ecs_task_stop.arn
  runtime          = local.lambda_runtime
  timeout          = 10
  environment {
    variables = {
      CLUSTER_ARN         = data.aws_ecs_cluster.this.arn
      SERVICE_ARN_BACKEND = data.aws_ecs_service.backend.arn
      SERVICE_ARN_AUTH    = data.aws_ecs_service.auth.arn
      SERVICE_ARN_USERS   = data.aws_ecs_service.users.arn
    }
  }
}

data "archive_file" "ecs_task_stop" {
  type        = "zip"
  source_dir  = "../nodejs/lambda/stop/dist"
  output_path = "../nodejs/lambda/stop/dist.zip"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Permission (Lambda) - ECS Task Stop
# ---------------------------------------------------------------------------------------------
resource "aws_lambda_permission" "ecs_task_stop" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.ecs_task_stop.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${data.aws_apigatewayv2_api.admin.execution_arn}/*/*/stop"
}

# ----------------------------------------------------------------------------------------------
# Lambda Function - ECS Task Status
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function" "ecs_task_status" {
  filename         = data.archive_file.ecs_task_status.output_path
  source_code_hash = data.archive_file.ecs_task_status.output_base64sha256
  function_name    = "${local.project_name}-ecs-task-status"
  handler          = local.lambda_handler
  memory_size      = 128
  role             = aws_iam_role.ecs_task_status.arn
  runtime          = local.lambda_runtime
  timeout          = 10
  environment {
    variables = {
      CLUSTER_ARN = data.aws_ecs_cluster.this.arn
    }
  }
}

data "archive_file" "ecs_task_status" {
  type        = "zip"
  source_dir  = "../nodejs/lambda/status/dist"
  output_path = "../nodejs/lambda/status/dist.zip"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Permission (Lambda) - ECS Task Status
# ---------------------------------------------------------------------------------------------
resource "aws_lambda_permission" "ecs_task_status" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.ecs_task_status.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${data.aws_apigatewayv2_api.admin.execution_arn}/*/*/status"
}

# ----------------------------------------------------------------------------------------------
# Lambda Function - Batch
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function" "batch" {
  function_name = "${local.project_name}-batch"
  package_type  = "Image"
  image_uri     = data.aws_ssm_parameter.repo_url_batch.value
  memory_size   = 256
  role          = aws_iam_role.batch.arn
  timeout       = 300

  environment {
    variables = {
      TABLE_NAME_USERS     = local.dynamodb_name_users
      TABLE_NAME_TRACES    = local.dynamodb_name_traces
      TABLE_NAME_HISTORIES = local.dynamodb_name_histories
      TZ                   = "Asia/Tokyo"
    }
  }
}
