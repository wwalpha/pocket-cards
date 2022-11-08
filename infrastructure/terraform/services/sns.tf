# ----------------------------------------------------------------------------------------------
# AWS SNS Topic
# ----------------------------------------------------------------------------------------------
resource "aws_sns_topic" "error_notify" {
  name = "${local.project_name}-error-nofity"
}

# ----------------------------------------------------------------------------------------------
# AWS SNS Topic Policy
# ----------------------------------------------------------------------------------------------
resource "aws_sns_topic_policy" "error_notify" {
  arn    = aws_sns_topic.error_notify.arn
  policy = data.aws_iam_policy_document.sns_topic_policy.json
}

# # ----------------------------------------------------------------------------------------------
# # AWS SNS Topic Subscription
# # ----------------------------------------------------------------------------------------------
# resource "aws_sns_topic_subscription" "error_notify" {
#   topic_arn = aws_sns_topic.error_notify.arn
#   protocol  = "lambda"
#   endpoint  = aws_lambda_function.webhook.arn
# }

# ----------------------------------------------------------------------------------------------
# AWS SNS Topic Subscription - Email
# ----------------------------------------------------------------------------------------------
resource "aws_sns_topic_subscription" "administrator" {
  topic_arn = aws_sns_topic.error_notify.arn
  protocol  = "email"
  endpoint  = var.admin_email
}
