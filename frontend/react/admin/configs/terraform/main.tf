provider "aws" {}

# ----------------------------------------------------------------------------------------------
# Region
# ----------------------------------------------------------------------------------------------
data "aws_region" "this" {}

# ----------------------------------------------------------------------------------------------
# Terraform Settings
# ----------------------------------------------------------------------------------------------
terraform {
  backend "remote" {
    hostname     = "app.terraform.io"
    organization = "wwalpha"

    workspaces {
      prefix = "pocket-cards-outputs-"
    }
  }
}

# ----------------------------------------------------------------------------------------------
# Remote state - Setup
# ----------------------------------------------------------------------------------------------
data "terraform_remote_state" "setup" {
  backend   = "remote"
  workspace = terraform.workspace

  config = {
    organization = "wwalpha"

    workspaces = {
      prefix = "pocket-cards-setup-"
    }
  }
}

# ----------------------------------------------------------------------------------------------
# Remote state - Services
# ----------------------------------------------------------------------------------------------
data "terraform_remote_state" "services" {
  backend   = "remote"
  workspace = terraform.workspace

  config = {
    organization = "wwalpha"

    workspaces = {
      prefix = "pocket-cards-services-"
    }
  }
}

locals {
  remote_setup    = data.terraform_remote_state.setup.outputs
  remote_services = data.terraform_remote_state.services.outputs

  region = data.aws_region.this.name
}

# ----------------------------------------------------------------------------------------------
# Environment file
# ----------------------------------------------------------------------------------------------
resource "aws_s3_bucket_object" "frontend" {
  bucket  = local.remote_setup.bucket_name_archive
  key     = "envs/frontend.env"
  content = <<EOT
AWS_REGION=${local.region}
IDENTITY_POOL_ID=${local.remote_services.cognito_identity_pool_id}
USER_POOL_ID=${local.remote_services.cognito_user_pool_id}
USER_POOL_WEB_CLIENT_ID=${local.remote_services.cognito_user_pool_client_id}
AUTH_DOMAIN=${local.remote_services.cognito_user_pool_domain}
AUTH_SIGN_IN_URL=${local.remote_services.cognito_callback_url}
AUTH_SIGN_OUT_URL=${local.remote_services.cognito_logout_url}
API_URL=https://api.${local.remote_setup.route53_zone_name}
WSS_URL=wss://socket.${local.remote_setup.route53_zone_name}
DOMAIN_HOST=https://www.${local.remote_setup.route53_zone_name}
EOT
}

# ----------------------------------------------------------------------------------------------
# Outputs
# ----------------------------------------------------------------------------------------------
output "bucket_name_archive" {
  value = local.remote_setup.bucket_name_archive
}

output "bucket_name_frontend" {
  value = local.remote_setup.bucket_name_frontend
}
