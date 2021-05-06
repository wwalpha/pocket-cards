# ----------------------------------------------------------------------------------------------
# AWS ECS Task Role Policy
# ----------------------------------------------------------------------------------------------
data "aws_iam_policy_document" "ecs_task_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

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
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchFullAccess"
}

# ----------------------------------------------------------------------------------------------
# AWS ECS Task Role Policy - XRay Daemon WriteAccess
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy_attachment" "ecs_task_xray" {
  role       = aws_iam_role.ecs_task.name
  policy_arn = "arn:aws:iam::aws:policy/AWSXRayDaemonWriteAccess"
}

# ----------------------------------------------------------------------------------------------
# AWS ECS Task Role Policy - App Mesh Envoy Access
# ----------------------------------------------------------------------------------------------
# resource "aws_iam_role_policy_attachment" "ecs_task_envoy" {
#   role       = aws_iam_role.ecs_task.name
#   policy_arn = "arn:aws:iam::aws:policy/AWSAppMeshEnvoyAccess"
# }

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
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchFullAccess"
}

# ----------------------------------------------------------------------------------------------
# AWS ECS Task Role Policy - SSM Parameter Store Access
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy_attachment" "ecs_task_exec_ssm" {
  role       = aws_iam_role.ecs_task_exec.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMReadOnlyAccess"
}
