# ----------------------------------------------------------------------------------------------
# AWS ECS Task Role
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role" "ecs_task" {
  name               = "${local.project_name_uc}_ECSTaskRole"
  assume_role_policy = data.aws_iam_policy_document.ecs_task_role_policy.json

  lifecycle {
    create_before_destroy = false
  }
}

# ----------------------------------------------------------------------------------------------
# AWS ECS Task Role Policy - CloudWatch Full Access
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy_attachment" "ecs_task_cloudwatch" {
  role       = aws_iam_role.ecs_task.name
  policy_arn = aws_iam_policy.cloudwatch_logs_basic.arn
}

# ----------------------------------------------------------------------------------------------
# AWS ECS Task Role Policy - XRay Daemon WriteAccess
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy_attachment" "ecs_task_xray" {
  role       = aws_iam_role.ecs_task.name
  policy_arn = "arn:aws:iam::aws:policy/AWSXRayDaemonWriteAccess"
}

# ----------------------------------------------------------------------------------------------
# AWS ECS Task Role Policy - DynamoDB Full Access
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy_attachment" "ecs_task_dynamodb" {
  role       = aws_iam_role.ecs_task.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess"
}

# ----------------------------------------------------------------------------------------------
# AWS ECS Task Role Policy - App Mesh Envoy Access
# ----------------------------------------------------------------------------------------------
# resource "aws_iam_role_policy_attachment" "ecs_task_envoy" {
#   role       = aws_iam_role.ecs_task.name
#   policy_arn = "arn:aws:iam::aws:policy/AWSAppMeshEnvoyAccess"
# }

# ----------------------------------------------------------------------------------------------
# AWS ECS Task Role Policy
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy" "ecs_task" {
  name = "inline_policy"
  role = aws_iam_role.ecs_task.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "polly:SynthesizeSpeech",
          "s3:PutObject",
          "cognito-idp:AdminInitiateAuth"
        ]
        Effect   = "Allow"
        Resource = "*"
      }
    ]
  })
}

# ----------------------------------------------------------------------------------------------
# AWS ECS Task Execution Role
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role" "ecs_task_exec" {
  name               = "${local.project_name_uc}_ECSTaskExecutionRole"
  assume_role_policy = data.aws_iam_policy_document.ecs_task_role_policy.json
  lifecycle {
    create_before_destroy = false
  }
}

# ----------------------------------------------------------------------------------------------
# AWS ECS Task Execution Policy - ECS Task Execution Policy
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy_attachment" "ecs_task_exec_default" {
  role       = aws_iam_role.ecs_task_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# ----------------------------------------------------------------------------------------------
# AWS ECS Task Execution Policy - CloudWatch Full Access
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy_attachment" "ecs_task_exec_cloudwatch" {
  role       = aws_iam_role.ecs_task_exec.name
  policy_arn = aws_iam_policy.cloudwatch_logs_basic.arn
}

# ----------------------------------------------------------------------------------------------
# AWS ECS Task Role Policy - SSM Parameter Store Access
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy_attachment" "ecs_task_exec_ssm" {
  role       = aws_iam_role.ecs_task_exec.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMReadOnlyAccess"
}

# ----------------------------------------------------------------------------------------------
# AWS ECS Task Role Policy
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy" "ecs_task_exec" {
  name = "s3_policy"
  role = aws_iam_role.ecs_task_exec.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "s3:GetObject",
        ]
        Effect   = "Allow"
        Resource = "${data.aws_s3_bucket.archive.arn}/*"
      },
      {
        Action = [
          "s3:GetBucketLocation",
        ]
        Effect   = "Allow"
        Resource = "${data.aws_s3_bucket.archive.arn}"
      }
    ]
  })
}

# ----------------------------------------------------------------------------------------------
# AWS ECS Task Role Policy - SES Access
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy_attachment" "ecs_task_ses" {
  role       = aws_iam_role.ecs_task.name
  policy_arn = aws_iam_policy.ses_basic.arn
}

# ----------------------------------------------------------------------------------------------
# Cognito Authenticated Role
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role" "authenticated" {
  name = "${local.project_name_uc}_CognitoAuthenticatedRole"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "cognito-identity.amazonaws.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "cognito-identity.amazonaws.com:aud": "${aws_cognito_identity_pool.this.id}"
        },
        "ForAnyValue:StringLike": {
          "cognito-identity.amazonaws.com:amr": "authenticated"
        }
      }
    }
  ]
}
EOF
}

# ----------------------------------------------------------------------------------------------
# Cognito Authenticated Role Policy
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy" "authenticated" {
  name = "${local.project_name_uc}_CognitoAuthenticatedPolicy"
  role = aws_iam_role.authenticated.id

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "mobileanalytics:PutEvents",
        "cognito-sync:*",
        "cognito-identity:*"
      ],
      "Resource": [
        "*"
      ]
    }
  ]
}
EOF
}

# ----------------------------------------------------------------------------------------------
# Cognito Authenticated Role Policy
# ----------------------------------------------------------------------------------------------
resource "aws_cognito_identity_pool_roles_attachment" "authenticated" {
  identity_pool_id = aws_cognito_identity_pool.this.id

  # role_mapping {
  #   identity_provider         = "graph.facebook.com"
  #   ambiguous_role_resolution = "AuthenticatedRole"
  #   type                      = "Rules"

  #   mapping_rule {
  #     claim      = "isAdmin"
  #     match_type = "Equals"
  #     role_arn   = aws_iam_role.authenticated.arn
  #     value      = "paid"
  #   }
  # }

  roles = {
    "authenticated" = aws_iam_role.authenticated.arn
  }
}

# ----------------------------------------------------------------------------------------------
# AWS Lambda Execution Role - Authorizer
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role" "authorizer" {
  name               = "${local.project_name_uc}_AuthorizerRole"
  assume_role_policy = data.aws_iam_policy_document.lambda.json

  lifecycle {
    create_before_destroy = false
  }
}

# ----------------------------------------------------------------------------------------------
# AWS Lambda Execution Policy - Lambda Basic Policy
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy_attachment" "authorizer" {
  role       = aws_iam_role.authorizer.name
  policy_arn = aws_iam_policy.cloudwatch_logs_basic.arn
}

# ----------------------------------------------------------------------------------------------
# AWS Lambda Execution Policy - Dynamodb Basic
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy_attachment" "authorizer_dynamodb" {
  role       = aws_iam_role.authorizer.name
  policy_arn = aws_iam_policy.dynamodb_basic.arn
}

# ----------------------------------------------------------------------------------------------
# AWS Lambda Role - Cognito
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role" "cognito_post_signup" {
  name               = "${local.project_name_uc}_Lambda_CognitoPostSignupRole"
  assume_role_policy = data.aws_iam_policy_document.lambda.json

  lifecycle {
    create_before_destroy = false
  }
}

# ----------------------------------------------------------------------------------------------
# AWS Lambda Execution Policy - CloudWatch Full Access
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy_attachment" "cognito_post_signup_cloudwatch_logs" {
  role       = aws_iam_role.cognito_post_signup.name
  policy_arn = aws_iam_policy.cloudwatch_logs_basic.arn
}

# ----------------------------------------------------------------------------------------------
# AWS ECS Task Role
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role" "ecs_task_users" {
  name               = "${local.project_name_uc}_ECSTask_UsersRole"
  assume_role_policy = data.aws_iam_policy_document.ecs_task_role_policy.json

  lifecycle {
    create_before_destroy = false
  }
}

# ----------------------------------------------------------------------------------------------
# AWS ECS Task Role Policy - CloudWatch Basic Policy
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy_attachment" "ecs_task_users_cloudwatch" {
  role       = aws_iam_role.ecs_task_users.name
  policy_arn = aws_iam_policy.cloudwatch_logs_basic.arn
}

# ----------------------------------------------------------------------------------------------
# AWS ECS Task Role Policy - Dynamodb Basic Policy
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy_attachment" "ecs_task_users_dynamodb" {
  role       = aws_iam_role.ecs_task_users.name
  policy_arn = aws_iam_policy.dynamodb_basic.arn
}

# ----------------------------------------------------------------------------------------------
# AWS ECS Task Role Policy - Cognito Admin Policy
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy_attachment" "ecs_task_users_cognito" {
  role       = aws_iam_role.ecs_task_users.name
  policy_arn = aws_iam_policy.cognito_admin.arn
}

# ----------------------------------------------------------------------------------------------
# AWS ECS Task Role Policy - SES Policy
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy_attachment" "ecs_task_users_ses" {
  role       = aws_iam_role.ecs_task_users.name
  policy_arn = aws_iam_policy.ses_basic.arn
}

# ----------------------------------------------------------------------------------------------
# AWS ECS Task Role - Backup
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role" "backup" {
  name               = "${local.project_name_uc}_BackupRole"
  assume_role_policy = data.aws_iam_policy_document.backup.json

  lifecycle {
    create_before_destroy = false
  }
}


# ----------------------------------------------------------------------------------------------
# AWS IAM Policy - Backup
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy_attachment" "backup" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSBackupServiceRolePolicyForBackup"
  role       = aws_iam_role.backup.name
}

# ----------------------------------------------------------------------------------------------
# AWS Lambda Role - Webhook
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role" "webhook" {
  name               = "${local.project_name_uc}_WebhookRole"
  assume_role_policy = data.aws_iam_policy_document.lambda.json

  lifecycle {
    create_before_destroy = false
  }
}

# ----------------------------------------------------------------------------------------------
# AWS Lambda Execution Policy - CloudWatch Full Access
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy_attachment" "webhook_policy" {
  role       = aws_iam_role.webhook.name
  policy_arn = local.lambda_basic_policy_arn
}
