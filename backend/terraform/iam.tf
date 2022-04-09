# ----------------------------------------------------------------------------------------------
# AWS Lambda Role - Cognito
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role" "cognito" {
  name               = "${local.project_name_uc}_Lambda_CognitoRole"
  assume_role_policy = data.aws_iam_policy_document.lambda.json

  lifecycle {
    create_before_destroy = false
  }
}

# ----------------------------------------------------------------------------------------------
# AWS Lambda Role - ECS Task Start
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role" "ecs_task_start" {
  name               = "${local.project_name_uc}_Lambda_ECSStartRole"
  assume_role_policy = data.aws_iam_policy_document.lambda.json

  lifecycle {
    create_before_destroy = false
  }
}

# ----------------------------------------------------------------------------------------------
# AWS Lambda Role - Lambda Basic Policy
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy_attachment" "ecs_task_start_basic" {
  role       = aws_iam_role.ecs_task_start.name
  policy_arn = local.lambda_basic_policy_arn
}

# ----------------------------------------------------------------------------------------------
# AWS Lambda Role - ECS Task Stop
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role" "ecs_task_stop" {
  name               = "${local.project_name_uc}_Lambda_ECSStopRole"
  assume_role_policy = data.aws_iam_policy_document.lambda.json

  lifecycle {
    create_before_destroy = false
  }
}

# ----------------------------------------------------------------------------------------------
# AWS Lambda Role - Lambda Basic Policy
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy_attachment" "ecs_task_stop_basic" {
  role       = aws_iam_role.ecs_task_stop.name
  policy_arn = local.lambda_basic_policy_arn
}

# ----------------------------------------------------------------------------------------------
# AWS Lambda Role - ECS Task Status
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role" "ecs_task_status" {
  name               = "${local.project_name_uc}_Lambda_ECSStatusRole"
  assume_role_policy = data.aws_iam_policy_document.lambda.json

  lifecycle {
    create_before_destroy = false
  }
}

# ----------------------------------------------------------------------------------------------
# AWS Lambda Role - Lambda Basic Policy
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy_attachment" "ecs_task_status_basic" {
  role       = aws_iam_role.ecs_task_status.name
  policy_arn = local.lambda_basic_policy_arn
}

# ----------------------------------------------------------------------------------------------
# AWS Lambda Role - Batch
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role" "batch" {
  name               = "${local.project_name_uc}_Lambda_BatchRole"
  assume_role_policy = data.aws_iam_policy_document.lambda.json

  lifecycle {
    create_before_destroy = false
  }
}

# ----------------------------------------------------------------------------------------------
# AWS Lambda Role - Batch Basic Policy
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy_attachment" "batch" {
  role       = aws_iam_role.batch.name
  policy_arn = local.lambda_basic_policy_arn
}

# ----------------------------------------------------------------------------------------------
# AWS Lambda Role - Batch Dynamodb Policy
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy_attachment" "batch_dynamodb" {
  role       = aws_iam_role.batch.name
  policy_arn = local.iam_policy_arn_dynamodb
}

# ----------------------------------------------------------------------------------------------
# AWS Lambda Role - Batch SNS Policy
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy_attachment" "batch_sns" {
  role       = aws_iam_role.batch.name
  policy_arn = local.iam_policy_arn_sns
}

# ----------------------------------------------------------------------------------------------
# AWS Lambda Role - Batch SES Policy
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy_attachment" "batch_ses" {
  role       = aws_iam_role.batch.name
  policy_arn = local.iam_policy_arn_ses
}


