# ----------------------------------------------------------------------------------------------
# Lambda Function - ECS Task Start
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function" "ecs_task_start" {
  function_name     = "${local.project_name}-ecs-task-start"
  s3_bucket         = local.bucket_name_archive
  s3_key            = "lambda/start.zip"
  s3_object_version = aws_s3_object.lambda_start.version_id
  handler           = local.lambda_handler
  memory_size       = 128
  role              = aws_iam_role.ecs_task_start.arn
  runtime           = local.lambda_runtime
  timeout           = 10
  environment {
    variables = {
      CLUSTER_ARN         = data.aws_ecs_cluster.this.arn
      SERVICE_ARN_BACKEND = data.aws_ecs_service.backend.arn
      SERVICE_ARN_AUTH    = data.aws_ecs_service.auth.arn
      SERVICE_ARN_USERS   = data.aws_ecs_service.users.arn
    }
  }
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
  function_name     = "${local.project_name}-ecs-task-stop"
  s3_bucket         = local.bucket_name_archive
  s3_key            = "lambda/stop.zip"
  s3_object_version = aws_s3_object.lambda_stop.version_id
  handler           = local.lambda_handler
  memory_size       = 128
  role              = aws_iam_role.ecs_task_stop.arn
  runtime           = local.lambda_runtime
  timeout           = 10
  environment {
    variables = {
      CLUSTER_ARN         = data.aws_ecs_cluster.this.arn
      SERVICE_ARN_BACKEND = data.aws_ecs_service.backend.arn
      SERVICE_ARN_AUTH    = data.aws_ecs_service.auth.arn
      SERVICE_ARN_USERS   = data.aws_ecs_service.users.arn
    }
  }
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
  function_name     = "${local.project_name}-ecs-task-status"
  s3_bucket         = local.bucket_name_archive
  s3_key            = "lambda/status.zip"
  s3_object_version = aws_s3_object.lambda_status.version_id
  handler           = local.lambda_handler
  memory_size       = 128
  role              = aws_iam_role.ecs_task_status.arn
  runtime           = local.lambda_runtime
  timeout           = 10
  environment {
    variables = {
      CLUSTER_ARN = data.aws_ecs_cluster.this.arn
    }
  }
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
  memory_size   = 1024
  role          = aws_iam_role.batch.arn
  timeout       = 900

  environment {
    variables = {
      TABLE_NAME_USERS     = local.dynamodb_name_users
      TABLE_NAME_TRACES    = local.dynamodb_name_traces
      TABLE_NAME_HISTORIES = local.dynamodb_name_histories
      TABLE_NAME_LEARNING  = local.dynamodb_name_learning
      MASTER_EMAIL_ADDRESS = "master@${local.domain_name}"
      TZ                   = "Asia/Tokyo"
    }
  }
}

# ----------------------------------------------------------------------------------------------
# Lambda Function Event Invoke Config - Batch
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function_event_invoke_config" "batch" {
  function_name = aws_lambda_function.batch.function_name

  destination_config {
    on_failure {
      destination = local.sns_arn_errors_notify
    }
  }
}
