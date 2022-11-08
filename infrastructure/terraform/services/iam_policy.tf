# ----------------------------------------------------------------------------------------------
# AWS IAM Policy - Cognito Admin
# ----------------------------------------------------------------------------------------------
resource "aws_iam_policy" "cognito_admin" {
  name = "${local.project_name_uc}_CognitoAdminPolicy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "cognito-idp:Admin*",
        ]
        Effect   = "Allow"
        Resource = "*"
      },
    ]
  })
}

# ----------------------------------------------------------------------------------------------
# AWS IAM Policy - SES Basic
# ----------------------------------------------------------------------------------------------
resource "aws_iam_policy" "ses_basic" {
  name = "${local.project_name_uc}_SESPolicy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "ses:*",
        ]
        Effect   = "Allow"
        Resource = "*"
      },
    ]
  })
}

# ----------------------------------------------------------------------------------------------
# AWS IAM Policy - CloudWatch Logs Basic
# ----------------------------------------------------------------------------------------------
resource "aws_iam_policy" "cloudwatch_logs_basic" {
  name = "${local.project_name_uc}_CloudWatchLogsPolicy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Effect   = "Allow"
        Resource = "*"
      },
    ]
  })
}

# ----------------------------------------------------------------------------------------------
# AWS IAM Policy - Dynamodb Basic
# ----------------------------------------------------------------------------------------------
resource "aws_iam_policy" "dynamodb_basic" {
  name = "${local.project_name_uc}_DynamodbPolicy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
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
        Effect   = "Allow"
        Resource = "*"
      },
    ]
  })
}

# ----------------------------------------------------------------------------------------------
# AWS IAM Policy - SNS Basic
# ----------------------------------------------------------------------------------------------
resource "aws_iam_policy" "sns_basic" {
  name = "${local.project_name_uc}_SNSPolicy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "sns:Publish"
        ]
        Effect   = "Allow"
        Resource = "*"
      },
    ]
  })
}

# ----------------------------------------------------------------------------------------------
# AWS IAM Policy - Cognito Authenticated
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy" "authenticated" {
  name = "authenticated_policy"
  role = aws_iam_role.authenticated.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      { Effect = "Allow"

        Action = [
          "mobileanalytics:PutEvents",
          "cognito-sync:*",
          "cognito-identity:*"
        ]
        Resource = "*"
      },
      { Effect = "Allow"
        Action = [
          "s3:PutObject"
        ]
        Resource = "arn:aws:s3:::${local.bucket_name_uploads}/*"
      }
    ]
  })
}

# ----------------------------------------------------------------------------------------------
# AWS IAM Policy - SNS Topic Policy
# ----------------------------------------------------------------------------------------------
data "aws_iam_policy_document" "sns_topic_policy" {
  statement {
    effect  = "Allow"
    actions = ["sns:Publish"]

    principals {
      type        = "Service"
      identifiers = ["events.amazonaws.com"]
    }

    resources = ["*"]
  }
}
