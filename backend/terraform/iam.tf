# ----------------------------------------------------------------------------------------------
# AWS Lambda Role Policy
# ----------------------------------------------------------------------------------------------
data "aws_iam_policy_document" "lambda_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

# ----------------------------------------------------------------------------------------------
# AWS Lambda Role - Cognito
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role" "cognito" {
  name               = "${local.project_name_uc}_Lambda_CognitoRole"
  assume_role_policy = data.aws_iam_policy_document.lambda_role_policy.json

  lifecycle {
    create_before_destroy = false
  }
}

# ----------------------------------------------------------------------------------------------
# AWS Lambda Role - ECS Task Start
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role" "ecs_task_start" {
  name               = "${local.project_name_uc}_Lambda_ECSStartRole"
  assume_role_policy = data.aws_iam_policy_document.lambda_role_policy.json

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
# AWS Lambda Role - ECS Policy
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy" "ecs_task_start_basic" {
  name = "ECS_Policy"
  role = aws_iam_role.ecs_task_start.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ecs:UpdateService",
        ]
        Resource = "*"
      },
    ]
  })
}

# ----------------------------------------------------------------------------------------------
# AWS Lambda Role - ECS Task Stop
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role" "ecs_task_stop" {
  name               = "${local.project_name_uc}_Lambda_ECSStopRole"
  assume_role_policy = data.aws_iam_policy_document.lambda_role_policy.json

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
# AWS Lambda Role - ECS Policy
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy" "ecs_task_stop_basic" {
  name = "ECS_Policy"
  role = aws_iam_role.ecs_task_stop.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ecs:UpdateService",
          "ecs:ListTasks",
          "ecs:StopTask"
        ]
        Resource = "*"
      },
    ]
  })
}

# ----------------------------------------------------------------------------------------------
# AWS Lambda Role - ECS Task Status
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role" "ecs_task_status" {
  name               = "${local.project_name_uc}_Lambda_ECSStatusRole"
  assume_role_policy = data.aws_iam_policy_document.lambda_role_policy.json

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
# AWS Lambda Role - ECS Policy
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy" "ecs_task_status_basic" {
  name = "ECS_Policy"
  role = aws_iam_role.ecs_task_status.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ecs:DescribeTasks",
          "ecs:ListTasks"
        ]
        Resource = "*"
      },
    ]
  })
}

# ----------------------------------------------------------------------------------------------
# AWS Lambda Role - Batch
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role" "batch" {
  name               = "${local.project_name_uc}_Lambda_BatchRole"
  assume_role_policy = data.aws_iam_policy_document.lambda_role_policy.json

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
# AWS Lambda Role - Batch Policy
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy" "batch" {
  name = "Batch_Policy"
  role = aws_iam_role.batch.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:BatchGetItem",
          "dynamodb:BatchWriteItem",
          "dynamodb:Describe*",
          "dynamodb:List*",
          "dynamodb:GetItem",
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:PartiQL*",
          "dynamodb:PutItem",
          "dynamodb:DeleteItem",
          "dynamodb:UpdateItem"
        ]
        Resource = "*"
      },
    ]
  })
}
