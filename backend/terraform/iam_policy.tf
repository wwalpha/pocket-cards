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
# AWS Lambda Role Policy - State Machine
# ----------------------------------------------------------------------------------------------
data "aws_iam_policy_document" "sfn" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["states.amazonaws.com"]
    }
  }
}

# ----------------------------------------------------------------------------------------------
# AWS Lambda Role Policy - CloudWatch Events
# ----------------------------------------------------------------------------------------------
data "aws_iam_policy_document" "events" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["events.amazonaws.com"]
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
  name = "${local.project_name_uc}_S3Policy"
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
# AWS Lambda Role - Athena Basic Policy
# ----------------------------------------------------------------------------------------------
resource "aws_iam_policy" "athena_basic" {
  name = "${local.project_name_uc}_AthenaPolicy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "athena:StartQueryExecution",
          "athena:GetQueryExecution",
          "athena:GetQueryResults",
          "s3:GetBucketLocation",
          "s3:GetObject",
          "s3:ListBucket",
          "s3:ListBucketMultipartUploads",
          "s3:AbortMultipartUpload",
          "s3:PutObject",
          "s3:ListMultipartUploadParts",
          "glue:GetTable",
          "glue:DeleteTable",
          "glue:GetDatabases"
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
    actions   = ["execute-api:*"]
    resources = ["*"]
  }
}

# ----------------------------------------------------------------------------------------------
# AWS Role Policy - Lambda
# ----------------------------------------------------------------------------------------------
data "aws_iam_policy_document" "wss_lambda" {
  statement {
    actions   = ["lambda:InvokeFunction"]
    resources = ["*"]
  }
}

# ----------------------------------------------------------------------------------------------
# AWS Role Policy - State Machine
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy" "sfn_role" {
  name = "inline_policy"
  role = aws_iam_role.sfn.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:ListBucketMultipartUploads",
          "s3:ListBucket",
          "s3:ListMultipartUploadParts",
          "s3:GetBucketLocation",
          "s3:GetObject",
          "s3:AbortMultipartUpload",
          "s3:PutObject",
          "athena:StartQueryExecution",
          "athena:GetQueryResults",
          "athena:GetQueryExecution",
          "glue:CreateTable",
          "glue:DeleteTable",
          "glue:GetDatabases",
          "glue:GetTable",
          "dynamodb:ExportTableToPointInTime",
          "dynamodb:DescribeExport",
          "logs:CreateLogDelivery",
          "logs:GetLogDelivery",
          "logs:UpdateLogDelivery",
          "logs:DeleteLogDelivery",
          "logs:ListLogDeliveries",
          "logs:PutResourcePolicy",
          "logs:DescribeResourcePolicies",
          "logs:DescribeLogGroups",
          "lambda:InvokeFunction"
        ]
        Resource = "*"
      },
    ]
  })
}


# ----------------------------------------------------------------------------------------------
# AWS Role Policy - State Machine
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy" "batch_event" {
  name = "inline_policy"
  role = aws_iam_role.batch_event.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "states:StartExecution",
        ]
        Resource = "*"
      },
    ]
  })
}
