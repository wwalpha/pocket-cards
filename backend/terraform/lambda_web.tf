# Parallel Web Adapter functions. Existing ECS services and routes stay in place.
# Environment values follow bucket.tf, excluding Lambda-reserved region variables.
resource "aws_lambda_function" "backend" {
  function_name = "${local.project_name}-backend"
  package_type  = "Image"
  image_uri     = data.aws_ssm_parameter.repo_url_backend_lambda.value
  architectures = ["x86_64"]
  memory_size   = 512
  role          = aws_iam_role.web["backend"].arn
  timeout       = 30

  depends_on = [aws_iam_role_policy.web_backend, aws_iam_role_policy_attachment.web_logs]

  environment {
    variables = {
      IPA_API_URL                         = data.aws_ssm_parameter.ipa_api_url.value
      IPA_API_KEY                         = data.aws_ssm_parameter.ipa_api_key.value
      TRANSLATION_API_URL                 = data.aws_ssm_parameter.translation_api_url.value
      TRANSLATION_API_KEY                 = data.aws_ssm_parameter.translation_api_key.value
      VISION_API_URL                      = data.aws_ssm_parameter.vision_api_url.value
      VISION_API_KEY                      = data.aws_ssm_parameter.vision_api_key.value
      TABLE_NAME_USERS                    = local.dynamodb_name_users
      TABLE_NAME_GROUPS                   = local.dynamodb_name_groups
      TABLE_NAME_USER_WORDS               = local.dynamodb_name_user_words
      TABLE_NAME_WORD_MASTER              = local.dynamodb_name_word_master
      TABLE_NAME_WORD_IGNORE              = local.dynamodb_name_word_ignore
      TABLE_NAME_TRACES                   = local.dynamodb_name_traces
      TABLE_NAME_QUESTIONS                = local.dynamodb_name_questions
      TABLE_NAME_LEARNING                 = local.dynamodb_name_learning
      TABLE_NAME_CURRICULUMS              = local.dynamodb_name_curriculums
      TABLE_NAME_REPORTS                  = local.dynamodb_name_reports
      TABLE_NAME_INQUIRY                  = local.dynamodb_name_inquiry
      TABLE_NAME_ACCURACY                 = local.dynamodb_name_accuracy
      BUCKET_NAME_FRONTEND                = local.bucket_name_frontend
      BUCKET_NAME_MATERAILS               = local.bucket_name_materials
      BUCKET_NAME_UPLOADS                 = local.bucket_name_uploads
      MASTER_EMAIL_ADDRESS                = "master@${local.domain_name}"
      PATH_PATTERN                        = "audio"
      TZ                                  = "Asia/Tokyo"
      AWS_NODEJS_CONNECTION_REUSE_ENABLED = "1"
      # Private Cloud Map HTTP is retained until the later service-call migration.
      ENDPOINT_USERS_SERVICE  = "http://${local.cloudmap_service_users}.${local.cloudmap_namespace}:8080/v1"
      TIMESTREAM_DATABASE     = local.timestream_database
      TIMESTREAM_TABLE_TRACES = local.timestream_table_traces

      AWS_LWA_PORT                           = "8080"
      AWS_LWA_READINESS_CHECK_PATH           = "/v1/health"
      AWS_LWA_READINESS_CHECK_HEALTHY_STATUS = "200-399"
    }
  }
}

resource "aws_lambda_function" "auth" {
  function_name = "${local.project_name}-auth"
  package_type  = "Image"
  image_uri     = data.aws_ssm_parameter.repo_url_auth_lambda.value
  architectures = ["x86_64"]
  memory_size   = 512
  role          = aws_iam_role.web["auth"].arn
  timeout       = 30

  depends_on = [aws_iam_role_policy.web_auth, aws_iam_role_policy_attachment.web_logs]

  environment {
    variables = {
      TZ                  = "Asia/Tokyo"
      TABLE_NAME_SETTINGS = local.dynamodb_name_settings
      # Private Cloud Map HTTP is retained until the later service-call migration.
      ENDPOINT_USERS_SERVICE              = "http://${local.cloudmap_service_users}.${local.cloudmap_namespace}:8080/v1"
      AWS_NODEJS_CONNECTION_REUSE_ENABLED = "1"

      AWS_LWA_PORT                           = "8080"
      AWS_LWA_READINESS_CHECK_PATH           = "/v1/auth/health"
      AWS_LWA_READINESS_CHECK_HEALTHY_STATUS = "200-399"
    }
  }
}

resource "aws_lambda_function" "users" {
  function_name = "${local.project_name}-users"
  package_type  = "Image"
  image_uri     = data.aws_ssm_parameter.repo_url_users_lambda.value
  architectures = ["x86_64"]
  memory_size   = 512
  role          = aws_iam_role.web["users"].arn
  timeout       = 30

  depends_on = [aws_iam_role_policy.web_users, aws_iam_role_policy_attachment.web_logs]

  environment {
    variables = {
      TABLE_NAME_USERS                    = local.dynamodb_name_users
      TABLE_NAME_SETTINGS                 = local.dynamodb_name_settings
      TABLE_NAME_CURRICULUMS              = local.dynamodb_name_curriculums
      TABLE_NAME_GROUPS                   = local.dynamodb_name_groups
      TZ                                  = "Asia/Tokyo"
      AWS_NODEJS_CONNECTION_REUSE_ENABLED = "1"

      AWS_LWA_PORT                           = "8080"
      AWS_LWA_READINESS_CHECK_PATH           = "/v1/users/health"
      AWS_LWA_READINESS_CHECK_HEALTHY_STATUS = "200-399"
    }
  }
}
