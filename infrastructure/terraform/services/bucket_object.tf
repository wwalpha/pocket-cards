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
# S3 Object - Lambda start module
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "lambda_start" {
  bucket = local.bucket_name_archive
  key    = local.bucket_key_lambda_start
  source = data.archive_file.lambda_default.output_path

  lifecycle {
    ignore_changes = [
      etag
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# S3 Object - Lambda stop module
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "lambda_stop" {
  bucket = local.bucket_name_archive
  key    = local.bucket_key_lambda_stop
  source = data.archive_file.lambda_default.output_path

  lifecycle {
    ignore_changes = [
      etag
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# S3 Object - Lambda status module
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "lambda_status" {
  bucket = local.bucket_name_archive
  key    = local.bucket_key_lambda_status
  source = data.archive_file.lambda_default.output_path

  lifecycle {
    ignore_changes = [
      etag
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# S3 Object - Lambda vision module
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "lambda_vision" {
  bucket = local.bucket_name_archive
  key    = local.bucket_key_lambda_vision
  source = data.archive_file.lambda_default.output_path

  lifecycle {
    ignore_changes = [
      etag
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# S3 Object - Lambda wss connect module
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "lambda_wss_connect" {
  bucket = local.bucket_name_archive
  key    = local.bucket_key_lambda_wss_connect
  source = data.archive_file.lambda_default.output_path

  lifecycle {
    ignore_changes = [
      etag
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# S3 Object - Lambda wss disconnect module
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "lambda_wss_disconnect" {
  bucket = local.bucket_name_archive
  key    = local.bucket_key_lambda_wss_disconnect
  source = data.archive_file.lambda_default.output_path

  lifecycle {
    ignore_changes = [
      etag
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# S3 Object - Lambda wss commands module
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "lambda_wss_commands" {
  bucket = local.bucket_name_archive
  key    = local.bucket_key_lambda_wss_commands
  source = data.archive_file.lambda_default.output_path

  lifecycle {
    ignore_changes = [
      etag
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# S3 Object - Lambda wss relay module
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "lambda_wss_relay" {
  bucket = local.bucket_name_archive
  key    = local.bucket_key_lambda_wss_relay
  source = data.archive_file.lambda_default.output_path

  lifecycle {
    ignore_changes = [
      etag
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# S3 Object - Lambda notify module
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "lambda_notify" {
  bucket = local.bucket_name_archive
  key    = local.bucket_key_lambda_notify
  source = data.archive_file.lambda_default.output_path

  lifecycle {
    ignore_changes = [
      etag
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# S3 Object - API Gateway Authorizer
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "lambda_authorizer_v2" {
  bucket = local.bucket_name_archive
  key    = local.bucket_key_lambda_authorizer_v2
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
  key    = local.bucket_key_lambda_authorizer_v1
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
  key    = local.bucket_key_lambda_cognito
  source = data.archive_file.lambda_default.output_path

  lifecycle {
    ignore_changes = [
      etag
    ]
  }
}
