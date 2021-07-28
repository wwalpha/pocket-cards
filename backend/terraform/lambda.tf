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
  source_dir  = "../dist/cognito"
  output_path = "../dist/cognito.zip"
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
      CLUSTER_ARN = local.ecs_cluster_arn
      SERVICE_ARN = local.ecs_service_arn
    }
  }
}

data "archive_file" "ecs_task_start" {
  type        = "zip"
  source_dir  = "../dist/start"
  output_path = "../dist/start.zip"
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
      CLUSTER_ARN = local.ecs_cluster_arn
      SERVICE_ARN = local.ecs_service_arn
    }
  }
}

data "archive_file" "ecs_task_stop" {
  type        = "zip"
  source_dir  = "../dist/stop"
  output_path = "../dist/stop.zip"
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
      CLUSTER_ARN = local.ecs_cluster_arn
    }
  }
}

data "archive_file" "ecs_task_status" {
  type        = "zip"
  source_dir  = "../dist/status"
  output_path = "../dist/status.zip"
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
