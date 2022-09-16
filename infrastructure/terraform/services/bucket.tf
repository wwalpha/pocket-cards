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
# WSS Service Environment file
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "wss" {
  bucket  = local.bucket_name_archive
  key     = "envs/wss.env"
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
# S3 Object - API Gateway Authorizer
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "lambda_authorizer_v2" {
  bucket = local.bucket_name_archive
  key    = "lambda/authorizer_v2.zip"
  source = data.archive_file.lambda_authorizer.output_path

  lifecycle {
    ignore_changes = [
      etag
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# S3 Object - API Gateway Authorizer
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "lambda_authorizer_v1" {
  bucket = local.bucket_name_archive
  key    = "lambda/authorizer_v1.zip"
  source = data.archive_file.lambda_authorizer.output_path

  lifecycle {
    ignore_changes = [
      etag
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# S3 Object - Lambda cognito module
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "lambda_cognito" {
  bucket = local.bucket_name_archive
  key    = "lambda/cognito.zip"
  source = data.archive_file.lambda_default.output_path

  lifecycle {
    ignore_changes = [
      etag
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
# Archive file - Lambda default module
# ----------------------------------------------------------------------------------------------
data "archive_file" "lambda_default" {
  type        = "zip"
  output_path = "${path.module}/dist/default.zip"

  source {
    content  = <<EOT
exports.handler = async (event) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify('Hello from Lambda!'),
  };
  return response;
};
EOT
    filename = "index.js"
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
