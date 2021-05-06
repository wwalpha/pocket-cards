output "api_id" {
  value = module.api.id
}
output "api_domain_name" {
  value = aws_acm_certificate.api.domain_name
}
output "api_execution_arn" {
  value = module.api.execution_arn
}
output "api_invoke_url" {
  value = module.deployment.invoke_url
}
output "api_stage_id" {
  value = module.deployment.stage_id
}
output "rule_target_arn" {
  value = {
    m002 : aws_cloudwatch_event_target.codebuild.arn
    m003 : aws_cloudwatch_event_target.codepipeline.arn
  }
}
output "codedeploy_app_backend_name" {
  value = aws_codedeploy_app.backend.name
}
output "sns_topic_notify_arn" {
  value = aws_sns_topic.notify.arn
}

output "cognito_user_pool_name" {
  value = "${module.cognito.user_pool_name}"
}
output "cognito_user_pool_id" {
  value = "${module.cognito.user_pool_id}"
}
output "cognito_user_pool_arn" {
  value = "${module.cognito.user_pool_arn}"
}
output "cognito_user_pool_endpoint" {
  value = "${module.cognito.user_pool_endpoint}"
}
output "cognito_user_pool_web_client_id" {
  value = "${module.cognito.user_pool_client_id}"
}
output "cognito_identity_pool_id" {
  value = "${module.cognito.identity_pool_id}"
}