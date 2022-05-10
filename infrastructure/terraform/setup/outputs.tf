# ----------------------------------------------------------------------------------------------
# Project Name
# ----------------------------------------------------------------------------------------------
output "project_name" {
  value = var.project_name
}

# ----------------------------------------------------------------------------------------------
# Project Name UC
# ----------------------------------------------------------------------------------------------
output "project_name_uc" {
  value = local.project_name_uc
}

# ----------------------------------------------------------------------------------------------
# S3 Bucket
# ----------------------------------------------------------------------------------------------
output "bucket_name_frontend" {
  value = aws_s3_bucket.frontend.id
}
output "bucket_name_archive" {
  value = aws_s3_bucket.archive.id
}
output "bucket_name_materials" {
  value = aws_s3_bucket.materials.id
}

# ----------------------------------------------------------------------------------------------
# DynamoDB
# ----------------------------------------------------------------------------------------------
output "dynamodb_name_users" {
  value = aws_dynamodb_table.users.name
}
output "dynamodb_name_groups" {
  value = aws_dynamodb_table.groups.name
}
output "dynamodb_name_words" {
  value = aws_dynamodb_table.words.name
}
output "dynamodb_name_word_master" {
  value = aws_dynamodb_table.word_master.name
}
output "dynamodb_name_word_ignore" {
  value = aws_dynamodb_table.word_ignore.name
}
output "dynamodb_name_questions" {
  value = aws_dynamodb_table.questions.name
}
output "dynamodb_name_learning" {
  value = aws_dynamodb_table.learning.name
}
output "dynamodb_name_traces" {
  value = aws_dynamodb_table.traces.name
}
output "dynamodb_name_settings" {
  value = aws_dynamodb_table.settings.name
}
output "dynamodb_name_curriculums" {
  value = aws_dynamodb_table.curriculums.name
}
output "dynamodb_name_reports" {
  value = aws_dynamodb_table.reports.name
}
output "dynamodb_name_weekly_ability" {
  value = aws_dynamodb_table.weekly_ability.name
}
# ----------------------------------------------------------------------------------------------
# Route53 DNS Servers
# ----------------------------------------------------------------------------------------------
output "dns_name_servers" {
  sensitive = true
  value     = aws_route53_zone.this.name_servers
}

# ----------------------------------------------------------------------------------------------
# Domain Name
# ----------------------------------------------------------------------------------------------
output "route53_zone_name" {
  sensitive = true
  value     = aws_route53_zone.this.name
}

# ----------------------------------------------------------------------------------------------
# Google Client ID
# ----------------------------------------------------------------------------------------------
output "google_client_id" {
  sensitive = true
  value     = var.google_client_id
}

# ----------------------------------------------------------------------------------------------
# Google Client Secret
# ----------------------------------------------------------------------------------------------
output "google_client_secret" {
  sensitive = true
  value     = var.google_client_secret
}

# ----------------------------------------------------------------------------------------------
# IPA API URL
# ----------------------------------------------------------------------------------------------
output "ssm_ipa_api_url" {
  value = aws_ssm_parameter.ipa_api_url.name
}

# ----------------------------------------------------------------------------------------------
# IPA API Key
# ----------------------------------------------------------------------------------------------
output "ssm_ipa_api_key" {
  value = aws_ssm_parameter.ipa_api_key.name
}

# ----------------------------------------------------------------------------------------------
# Translation API URL
# ----------------------------------------------------------------------------------------------
output "ssm_translation_api_url" {
  value = aws_ssm_parameter.translation_api_url.name
}

# ----------------------------------------------------------------------------------------------
# Translation API Key
# ----------------------------------------------------------------------------------------------
output "ssm_translation_api_key" {
  value = aws_ssm_parameter.translation_api_key.name
}

# ----------------------------------------------------------------------------------------------
# Vision API URL
# ----------------------------------------------------------------------------------------------
output "ssm_vision_api_url" {
  value = aws_ssm_parameter.vision_api_url.name
}

# ----------------------------------------------------------------------------------------------
# Vision API Key
# ----------------------------------------------------------------------------------------------
output "ssm_vision_api_key" {
  value = aws_ssm_parameter.vision_api_key.name
}

# ----------------------------------------------------------------------------------------------
# ECR Repository URL - Backend
# ----------------------------------------------------------------------------------------------
output "repo_url_backend" {
  value = module.ecr_repo_backend.repository_url
}

# ----------------------------------------------------------------------------------------------
# ECR Repository URL - Auth
# ----------------------------------------------------------------------------------------------
output "repo_url_auth" {
  value = module.ecr_repo_auth.repository_url
}

# ----------------------------------------------------------------------------------------------
# ECR Repository URL - Batch
# ----------------------------------------------------------------------------------------------
output "repo_url_batch" {
  value = module.ecr_repo_batch.repository_url
}

# ----------------------------------------------------------------------------------------------
# ECR Repository URL - Users
# ----------------------------------------------------------------------------------------------
output "repo_url_users" {
  value = module.ecr_repo_users.repository_url
}

# ----------------------------------------------------------------------------------------------
# Repository URL (Batch)
# ----------------------------------------------------------------------------------------------
output "ssm_repo_url_batch" {
  value = aws_ssm_parameter.repo_url_batch.name
}
