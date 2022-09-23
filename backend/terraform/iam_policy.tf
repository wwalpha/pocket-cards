# ----------------------------------------------------------------------------------------------
# AWS Lambda Role Policy
# ----------------------------------------------------------------------------------------------
data "aws_iam_policy_document" "lambda" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
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
          "ecs:UpdateService"
        ]
        Resource = "*"
      },
    ]
  })
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
# AWS Lambda Role - ECS Policy
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy" "vision_s3_delete" {
  name = "S3_Policy"
  role = aws_iam_role.vision.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:DeleteObject",
        ]
        Resource = "*"
      },
    ]
  })
}

# ----------------------------------------------------------------------------------------------
# AWS Role Policy - API Gateway
# ----------------------------------------------------------------------------------------------
data "aws_iam_policy_document" "wss_apigw" {
  statement {
    actions = ["execute-api:*"]
    Resource = "*"
  }
}