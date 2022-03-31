# --------------------------------------------------------------------------------------------------------------
# Amazon Cognito User Pool
# --------------------------------------------------------------------------------------------------------------
resource "aws_cognito_user_pool" "this" {
  name = "${local.project_name_uc}_UserPool"

  auto_verified_attributes = ["email"]
  mfa_configuration        = "OPTIONAL"

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  software_token_mfa_configuration {
    enabled = true
  }
  # alias_attributes           = var.alias_attributes
  # auto_verified_attributes   = local.auto_verified_attributes
  # mfa_configuration          = var.mfa_configuration
  # email_verification_subject = var.email_verification_subject
  # email_verification_message = var.email_verification_message
  # sms_authentication_message = var.sms_authentication_message
  # sms_verification_message   = var.sms_verification_message
  # username_attributes        = var.username_attributes
  # tags                       = var.user_pool_tags

  admin_create_user_config {
    allow_admin_create_user_only = false

    # temporary_password_validity_days = "${var.unused_account_validity_days}"

    # invite_message_template {
    #   email_subject = var.invite_email_subject
    #   email_message = var.invite_email_message
    #   sms_message   = var.invite_sms_message
    # }
  }

  # dynamic "schema" {
  #   for_each = var.schema

  #   content {
  #     name                     = schema.value.name
  #     attribute_data_type      = schema.value.attribute_data_type
  #     developer_only_attribute = schema.value.developer_only_attribute
  #     mutable                  = schema.value.mutable
  #     required                 = schema.value.required

  #     string_attribute_constraints {
  #       max_length = schema.value.string_attribute_max_length
  #       min_length = schema.value.string_attribute_min_length
  #     }
  #   }
  # }

  # device_configuration {
  #   challenge_required_on_new_device      = var.challenge_required_on_new_device
  #   device_only_remembered_on_user_prompt = var.device_only_remembered_on_user_prompt
  # }

  # email_configuration {
  #   reply_to_email_address = var.reply_to_email_address
  #   source_arn             = var.email_source_arn
  # }

  lambda_config {
    post_confirmation = aws_lambda_function.cognito_post_signup.arn
  }

  # lambda_config {
  #   create_auth_challenge          = var.create_auth_challenge
  #   custom_message                 = var.custom_message
  #   define_auth_challenge          = var.define_auth_challenge
  #   post_authentication            = var.post_authentication
  #   post_confirmation              = var.post_confirmation
  #   pre_authentication             = var.pre_authentication
  #   pre_sign_up                    = var.pre_sign_up
  #   pre_token_generation           = var.pre_token_generation
  #   user_migration                 = var.user_migration
  #   verify_auth_challenge_response = var.verify_auth_challenge_response
  # }

  # password_policy {
  #   minimum_length    = var.password_minimum_length
  #   require_lowercase = var.password_require_lowercase
  #   require_numbers   = var.password_require_numbers
  #   require_symbols   = var.password_require_symbols
  #   require_uppercase = var.password_require_uppercase
  # }

  # dynamic "sms_configuration" {
  #   for_each = local.sms_configuration

  #   content {
  #     external_id    = sms_configuration.value.external_id
  #     sns_caller_arn = sms_configuration.value.sns_caller_arn
  #   }
  # }

  # user_pool_add_ons {
  #   advanced_security_mode = var.advanced_security_mode
  # }

  # verification_message_template {
  #   default_email_option  = var.verify_default_email_option
  #   email_message         = var.verify_email_message
  #   email_message_by_link = var.verify_email_message_by_link
  #   email_subject         = var.verify_email_subject
  #   email_subject_by_link = var.verify_email_subject_by_link
  #   sms_message           = var.verify_sms_message
  # }

  lifecycle {
    ignore_changes = [
      estimated_number_of_users
    ]
  }
}

# -------------------------------------------------------
# Amazon Cognito User Pool Client
# -------------------------------------------------------
resource "aws_cognito_user_pool_client" "this" {
  name = "${aws_cognito_user_pool.this.name}Client"

  user_pool_id    = aws_cognito_user_pool.this.id
  generate_secret = false

  allowed_oauth_flows                  = ["code"]
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_scopes = [
    "aws.cognito.signin.user.admin",
    "email",
    "openid",
    "phone",
    "profile"
  ]
  callback_urls = [
    "https://www.${local.domain_name}/"
  ]
  logout_urls = [
    "https://www.${local.domain_name}/logout"
  ]
  supported_identity_providers = [aws_cognito_identity_provider.google.provider_name]
  explicit_auth_flows = [
    "ALLOW_CUSTOM_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_SRP_AUTH"
  ]
}

# -------------------------------------------------------
# Amazon Cognito User Pool Client
# -------------------------------------------------------
resource "aws_cognito_user_pool_client" "ios" {
  name = "${aws_cognito_user_pool.this.name}_iOS"

  user_pool_id    = aws_cognito_user_pool.this.id
  generate_secret = false

  allowed_oauth_flows                  = ["code"]
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_scopes = [
    "aws.cognito.signin.user.admin",
    "email",
    "openid",
    "phone",
    "profile"
  ]
  callback_urls = [
    "myapp://"
  ]
  logout_urls = [
    "myapp://"
  ]
  supported_identity_providers = [aws_cognito_identity_provider.google.provider_name]
  explicit_auth_flows = [
    "ALLOW_CUSTOM_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_SRP_AUTH"
  ]
}

# --------------------------------------------------------------------------------------------------------------
# Amazon Cognito User Pool Client Domain
# --------------------------------------------------------------------------------------------------------------
resource "aws_cognito_user_pool_domain" "this" {
  domain       = "${terraform.workspace}-${local.project_name}"
  user_pool_id = aws_cognito_user_pool.this.id
}

# --------------------------------------------------------------------------------------------------------------
# Amazon Cognito Identity Provider
# --------------------------------------------------------------------------------------------------------------
resource "aws_cognito_identity_provider" "google" {
  user_pool_id  = aws_cognito_user_pool.this.id
  provider_name = "Google"
  provider_type = "Google"

  provider_details = {
    authorize_scopes              = "email profile openid"
    client_id                     = local.google_client_id
    client_secret                 = local.google_client_secret
    attributes_url                = "https://people.googleapis.com/v1/people/me?personFields="
    attributes_url_add_attributes = "true"
    authorize_url                 = "https://accounts.google.com/o/oauth2/v2/auth"
    oidc_issuer                   = "https://accounts.google.com"
    token_request_method          = "POST"
    token_url                     = "https://www.googleapis.com/oauth2/v4/token"
  }

  attribute_mapping = {
    email    = "email"
    username = "sub"
  }

  lifecycle {
    ignore_changes = [
      provider_details["client_id"],
      provider_details["client_secret"],
    ]
  }
}

# --------------------------------------------------------------------------------------------------------------
# Amazon Cognito Identity Pool
# --------------------------------------------------------------------------------------------------------------
resource "aws_cognito_identity_pool" "this" {
  identity_pool_name = "${local.project_name_uc}_IdentityPool"

  cognito_identity_providers {
    client_id               = aws_cognito_user_pool_client.this.id
    provider_name           = aws_cognito_user_pool.this.endpoint
    server_side_token_check = false
  }
}

# --------------------------------------------------------------------------------------------------------------
# Amazon Cognito User Pool - Tenant Admin
# --------------------------------------------------------------------------------------------------------------
resource "aws_cognito_user_pool" "admin" {
  name                     = "${local.project_name}-AdminUserPool"
  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]
  mfa_configuration        = "OFF"

  username_configuration {
    case_sensitive = true
  }

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  admin_create_user_config {
    allow_admin_create_user_only = true
  }

  schema {
    name                     = "email"
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    required                 = true

    string_attribute_constraints {
      max_length = 2048
      min_length = 0
    }
  }

  schema {
    name                     = "name"
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    required                 = true

    string_attribute_constraints {
      max_length = 2048
      min_length = 0
    }
  }

  schema {
    name                = "role"
    attribute_data_type = "String"
    mutable             = true

    string_attribute_constraints {
      min_length = 1
      max_length = 256
    }
  }

  password_policy {
    minimum_length                   = 10
    require_lowercase                = true
    require_numbers                  = true
    require_symbols                  = true
    require_uppercase                = true
    temporary_password_validity_days = 7
  }

  lambda_config {
    post_confirmation = aws_lambda_function.cognito_post_signup.arn
  }

  lifecycle {
    ignore_changes = [
      estimated_number_of_users
    ]
  }
}

# -------------------------------------------------------
# Amazon Cognito User Pool Client
# -------------------------------------------------------
resource "aws_cognito_user_pool_client" "admin" {
  name = "${aws_cognito_user_pool.admin.name}Client"

  user_pool_id    = aws_cognito_user_pool.admin.id
  generate_secret = false

  allowed_oauth_flows                  = ["code"]
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_scopes = [
    "aws.cognito.signin.user.admin",
    "email",
    "openid",
    "phone",
    "profile"
  ]
  callback_urls = ["https://www.${local.domain_name}/admin"]
  logout_urls   = ["https://www.${local.domain_name}/admin/logout"]
  explicit_auth_flows = [
    "ALLOW_CUSTOM_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_ADMIN_USER_PASSWORD_AUTH",
  ]
}

# --------------------------------------------------------------------------------------------------------------
# Amazon Cognito User Pool Client Domain
# --------------------------------------------------------------------------------------------------------------
resource "aws_cognito_user_pool_domain" "admin" {
  domain       = "${terraform.workspace}-${local.project_name}-admin"
  user_pool_id = aws_cognito_user_pool.admin.id
}

# --------------------------------------------------------------------------------------------------------------
# Amazon Cognito Identity Pool
# --------------------------------------------------------------------------------------------------------------
resource "aws_cognito_identity_pool" "admin" {
  identity_pool_name = "${terraform.workspace}-${local.project_name}-admin"

  cognito_identity_providers {
    client_id               = aws_cognito_user_pool_client.admin.id
    provider_name           = aws_cognito_user_pool.admin.endpoint
    server_side_token_check = false
  }
}

# --------------------------------------------------------------------------------------------------------------
# Amazon Cognito Admin User
# --------------------------------------------------------------------------------------------------------------
resource "aws_cognito_user" "cognito_admin" {
  user_pool_id = aws_cognito_user_pool.admin.id
  username     = var.admin_email

  attributes = {
    name           = var.admin_email
    email          = var.admin_email
    email_verified = true
    role           = "SYSTEM_ADMIN"
  }
}
