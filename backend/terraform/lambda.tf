# ----------------------------------------------------------------------------------------------
# Lambda Function - Cognito
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function" "cognito" {
  filename         = data.archive_file.cognito.output_path
  source_code_hash = data.archive_file.cognito.output_base64sha256
  function_name    = "${local.project_name}-cognito"
  handler          = local.lambda_handler
  memory_size      = 128
  role             = aws_iam_role.cognito.arn
  runtime          = local.lambda_runtime
  timeout          = 10

  environment {
    variables = {
      TABLE_USERS = local.dynamodb_name_users
    }
  }
}

data "archive_file" "cognito" {
  type        = "zip"
  source_dir  = "../nodejs/lambda/cognito/dist"
  output_path = "../nodejs/lambda/cognito/dist.zip"
}

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
      CLUSTER_ARN = data.aws_ecs_cluster.this.arn
      SERVICE_ARN = data.aws_ecs_service.this.arn
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
  source_arn    = "${local.api_gateway_execution_arn}/*/*/admin/start"
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
      CLUSTER_ARN = data.aws_ecs_cluster.this.arn
      SERVICE_ARN = data.aws_ecs_service.this.arn
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
  source_arn    = "${local.api_gateway_execution_arn}/*/*/admin/stop"
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
  source_arn    = "${local.api_gateway_execution_arn}/*/*/admin/status"
}
