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

# ----------------------------------------------------------------------------------------------
# AWS Lambda Role - Vision
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role" "vision" {
  name               = "${local.project_name_uc}_Lambda_VisionRole"
  assume_role_policy = data.aws_iam_policy_document.lambda.json

  lifecycle {
    create_before_destroy = false
  }
}

# ----------------------------------------------------------------------------------------------
# AWS Lambda Role Policy - Vision Basic Policy
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy_attachment" "vision_basic" {
  role       = aws_iam_role.vision.name
  policy_arn = local.lambda_basic_policy_arn
}

# ----------------------------------------------------------------------------------------------
# AWS Lambda Role Policy - Vision SES Policy
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy_attachment" "vision_ses" {
  role       = aws_iam_role.vision.name
  policy_arn = local.iam_policy_arn_ses
}

# ----------------------------------------------------------------------------------------------
# AWS Lambda Role Policy - Vision S3 ReadOnly Policy
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy_attachment" "vision_s3_readonly" {
  role       = aws_iam_role.vision.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess"
}

# ----------------------------------------------------------------------------------------------
# AWS Lambda Role - WSS Connect
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role" "wss" {
  name               = "${local.project_name_uc}_Lambda_WSSRole"
  assume_role_policy = data.aws_iam_policy_document.lambda.json

  lifecycle {
    create_before_destroy = false
  }
}

# ----------------------------------------------------------------------------------------------
# AWS Lambda Role Policy - API Gateway Execution
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy" "wss_apigw" {
  name = "apigw_policy"
  role = aws_iam_role.wss.id

  policy = data.aws_iam_policy_document.wss_apigw.json
}

# ----------------------------------------------------------------------------------------------
# AWS Lambda Role Policy - Lambda basic policy
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy_attachment" "wss_basic" {
  role       = aws_iam_role.wss.name
  policy_arn = local.lambda_basic_policy_arn
}

# ----------------------------------------------------------------------------------------------
# AWS Lambda Role Policy - Dynamodb Policy
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy_attachment" "wss_dynamodb" {
  role       = aws_iam_role.wss.name
  policy_arn = local.iam_policy_arn_dynamodb
}

# ----------------------------------------------------------------------------------------------
# AWS Lambda Role - WSS Connect
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role" "wss_commands" {
  name               = "${local.project_name_uc}_Lambda_WSSCommandsRole"
  assume_role_policy = data.aws_iam_policy_document.lambda.json

  lifecycle {
    create_before_destroy = false
  }
}

# ----------------------------------------------------------------------------------------------
# AWS Lambda Role Policy - Lambda basic policy
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy_attachment" "wss_commands_basic" {
  role       = aws_iam_role.wss_commands.name
  policy_arn = local.lambda_basic_policy_arn
}

# ----------------------------------------------------------------------------------------------
# AWS Lambda Role Policy - Dynamodb Policy
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy_attachment" "wss_commands_dynamodb" {
  role       = aws_iam_role.wss_commands.name
  policy_arn = local.iam_policy_arn_dynamodb
}

# ----------------------------------------------------------------------------------------------
# AWS Lambda Role Policy - API Gateway Execution
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy" "wss_commands_apigw" {
  name = "apigw_policy"
  role = aws_iam_role.wss_commands.id

  policy = data.aws_iam_policy_document.wss_apigw.json
}

