# ----------------------------------------------------------------------------------------------
# Backend Environment file
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "backend" {
  bucket  = local.bucket_name_archive
  key     = "envs/backend.env"
  content = ""

  lifecycle {
    ignore_changes = [
      content
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# Users Service Environment file
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "users" {
  bucket  = local.bucket_name_archive
  key     = "envs/users.env"
  content = ""

  lifecycle {
    ignore_changes = [
      content
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# Auth Service Environment file
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "auth" {
  bucket  = local.bucket_name_archive
  key     = "envs/auth.env"
  content = <<EOT
ENDPOINT_USER_SERVICE=http://${aws_service_discovery_service.users.name}.${aws_service_discovery_private_dns_namespace.this.name}:8080
EOT

  lifecycle {
    ignore_changes = [
      content
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# S3 Object - Lambda webhook module
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "lambda_webhook" {
  bucket      = local.bucket_name_archive
  key         = "lambda/webhook.zip"
  source      = data.archive_file.lambda_webhook.output_path
  source_hash = data.archive_file.lambda_webhook.output_sha

  lifecycle {
    ignore_changes = [
      etag
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# Archive file - Lambda authorizer module
# ----------------------------------------------------------------------------------------------
data "archive_file" "lambda_authorizer" {
  type        = "zip"
  output_path = "${path.module}/dist/authorizer.zip"

  source {
    content  = <<EOT
exports.handler = async (event) => {
  const response = {
    "principalId": "abcdef",
    "policyDocument": {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Action": "execute-api:Invoke",
          "Effect": "Allow",
          "Resource": "*"
        }
      ]
    }
  }
  return response;
};
EOT
    filename = "index.js"
  }
}

# ----------------------------------------------------------------------------------------------
# Archive file - Lambda webhook module
# ----------------------------------------------------------------------------------------------
data "archive_file" "lambda_webhook" {
  type        = "zip"
  output_path = "${path.module}/dist/webhook.zip"

  source {
    content  = <<EOT
'use strict';
exports.__esModule = true;
exports.handler = void 0;
var https = require('node:https');
var WEBHOOK_URL = process.env.WEBHOOK_URL;
var handler = function (event) {
  var sns = event.Records[0].Sns;
  var context = JSON.parse(sns.Message);
  var payload = context.responsePayload;
  var datas = JSON.stringify({
    type: 'message',
    attachments: [
      {
        contentType: 'application/vnd.microsoft.card.adaptive',
        content: {
          $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
          type: 'AdaptiveCard',
          version: '1.2',
          body: [
            {
              type: 'TextBlock',
              text: payload.errorType,
              size: 'Large',
              weight: 'Bolder',
              spacing: 'None',
            },
            {
              type: 'TextBlock',
              text: payload.errorMessage,
              wrap: true,
            },
          ],
        },
      },
    ],
  });
  var request = https.request(WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(datas),
    },
  });
  request.write(datas);
  request.end();
};
exports.handler = handler;
EOT
    filename = "index.js"
  }
}

# ----------------------------------------------------------------------------------------------
# React Environment file
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "frontend" {
  bucket  = local.bucket_name_archive
  key     = "envs/react.env"
  content = <<EOT
AWS_REGION=${local.region}
IDENTITY_POOL_ID=${aws_cognito_identity_pool.this.id}
USER_POOL_ID=${aws_cognito_user_pool.this.id}
USER_POOL_WEB_CLIENT_ID=${aws_cognito_user_pool_client.this.id}
AUTH_DOMAIN="${aws_cognito_user_pool_domain.this.id}.auth.${local.region}.amazoncognito.com"
AUTH_SIGN_IN_URL=${one(aws_cognito_user_pool_client.this.callback_urls)}
AUTH_SIGN_OUT_URL=${one(aws_cognito_user_pool_client.this.logout_urls)}
API_URL=https://api.${local.route53_zone_name}
WSS_URL=wss://socket.${local.route53_zone_name}
DOMAIN_HOST=https://www.${local.route53_zone_name}
EOT
}
