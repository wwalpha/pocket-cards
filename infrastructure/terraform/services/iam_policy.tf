# ----------------------------------------------------------------------------------------------
# AWS IAM Policy - Dynamodb Basic
# ----------------------------------------------------------------------------------------------
resource "aws_iam_policy" "dynamodb_basic" {
  name = "${local.project_name_uc}_DynamodbBasicPolicy"

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
# AWS IAM Policy - Dynamodb Basic
# ----------------------------------------------------------------------------------------------
resource "aws_iam_policy" "cloudwatch_logs_basic" {
  name = "${local.project_name_uc}_CloudWatchLogsBasicPolicy"

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
# AWS IAM Policy - Cognito Admin
# ----------------------------------------------------------------------------------------------
resource "aws_iam_policy" "ses_basic" {
  name = "${local.project_name_uc}_SESBasicPolicy"

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
