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
output "bucket_name_images" {
  value = aws_s3_bucket.images.id
}
output "bucket_name_audios" {
  value = aws_s3_bucket.audios.id
}
output "bucket_name_logging" {
  value = aws_s3_bucket.logging.id
}

output "s3_buckets" {
  value = {
    AUDIOS = aws_s3_bucket.audios.id
    IMAGES = aws_s3_bucket.images.id
  }
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
output "dynamodb_name_history" {
  value = aws_dynamodb_table.history.name
}
output "dynamodb_tables" {
  value = {
    USERS       = aws_dynamodb_table.users.name
    GROUPS      = aws_dynamodb_table.groups.name
    WORDS       = aws_dynamodb_table.words.name
    WORD_MASTER = aws_dynamodb_table.word_master.name
    HISTORY     = aws_dynamodb_table.history.name
  }
}

# ----------------------------------------------------------------------------------------------
# Route53 DNS Servers
# ----------------------------------------------------------------------------------------------
output "route53_dns_name_servers" {
  value = aws_route53_zone.this.name_servers
}

# ----------------------------------------------------------------------------------------------
# Domain Name
# ----------------------------------------------------------------------------------------------
output "domain_name" {
  sensitive = true
  value     = "${local.domain_prefix}${var.domain_name}"
}

# ----------------------------------------------------------------------------------------------
# SSM Key - Identity Provider ID
# ----------------------------------------------------------------------------------------------
output "ssm_key_identity_provider_id" {
  value = "/${var.project_name}/identity_provider_id"
}

# ----------------------------------------------------------------------------------------------
# SSM Key - Identity Provider Secret
# ----------------------------------------------------------------------------------------------
output "ssm_key_identity_provider_secret" {
  value = "/${var.project_name}/identity_provider_secret"
}
