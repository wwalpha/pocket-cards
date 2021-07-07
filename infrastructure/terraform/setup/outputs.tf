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
output "dynamodb_name_histories" {
  value = aws_dynamodb_table.histories.name
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
output "ssm_google_client_id" {
  value = "/${var.project_name}/google_client_id"
}

# ----------------------------------------------------------------------------------------------
# Google Client Secret
# ----------------------------------------------------------------------------------------------
output "ssm_google_client_secret" {
  value = "/${var.project_name}/google_client_secret"
}

# ----------------------------------------------------------------------------------------------
# IPA API Key
# ----------------------------------------------------------------------------------------------
output "ssm_api_key_ipa" {
  value = "/${var.project_name}/api_key_ipa"
}

# ----------------------------------------------------------------------------------------------
# Translation API Key
# ----------------------------------------------------------------------------------------------
output "ssm_api_key_translation" {
  value = "/${var.project_name}/api_key_translation"
}
