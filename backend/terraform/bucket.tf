# ----------------------------------------------------------------------------------------------
# Backend Environment file
# ----------------------------------------------------------------------------------------------
resource "aws_s3_bucket_object" "resource" {
  bucket  = local.bucket_name_archive
  key     = "envs/backend.env"
  content = <<EOT
AWS_DEFAULT_REGION=ap-northeast-1
IPA_API_URL=${data.aws_ssm_parameter.ipa_api_url.value}
IPA_API_KEY=${data.aws_ssm_parameter.ipa_api_key.value}
TRANSLATION_API_URL=${data.aws_ssm_parameter.translation_api_url.value}
TRANSLATION_API_KEY=${data.aws_ssm_parameter.translation_api_key.value}
VISION_API_URL=${data.aws_ssm_parameter.vision_api_url.value}
VISION_API_KEY=${data.aws_ssm_parameter.vision_api_key.value}
TABLE_NAME_USERS=${local.dynamodb_name_users}
TABLE_NAME_GROUPS=${local.dynamodb_name_groups}
TABLE_NAME_WORDS=${local.dynamodb_name_words}
TABLE_NAME_WORD_MASTER=${local.dynamodb_name_word_master}
TABLE_NAME_WORD_IGNORE=${local.dynamodb_name_word_ignore}
TABLE_NAME_HISTORIES=${local.dynamodb_name_histories}
BUCKET_NAME_FRONTEND=${local.bucket_name_frontend}
PATH_PATTERN=audio
EOT
}
