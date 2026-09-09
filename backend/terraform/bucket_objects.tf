# ----------------------------------------------------------------------------------------------
# S3 Object - Lambda wss connect module
# ----------------------------------------------------------------------------------------------
data "aws_s3_object" "lambda_wss_connect" {
  bucket = local.bucket_name_archive
  key    = local.bucket_key_lambda_wss_connect
}

# ----------------------------------------------------------------------------------------------
# S3 Object - Lambda wss disconnect module
# ----------------------------------------------------------------------------------------------
data "aws_s3_object" "lambda_wss_disconnect" {
  bucket = local.bucket_name_archive
  key    = local.bucket_key_lambda_wss_disconnect
}

# ----------------------------------------------------------------------------------------------
# S3 Object - Lambda wss commands module
# ----------------------------------------------------------------------------------------------
data "aws_s3_object" "lambda_wss_commands" {
  bucket = local.bucket_name_archive
  key    = local.bucket_key_lambda_wss_commands
}

# ----------------------------------------------------------------------------------------------
# S3 Object - Lambda wss relay module
# ----------------------------------------------------------------------------------------------
data "aws_s3_object" "lambda_wss_relay" {
  bucket = local.bucket_name_archive
  key    = local.bucket_key_lambda_wss_relay
}

# ----------------------------------------------------------------------------------------------
# S3 Object - Lambda notify module
# ----------------------------------------------------------------------------------------------
data "aws_s3_object" "lambda_notify" {
  bucket = local.bucket_name_archive
  key    = local.bucket_key_lambda_notify
}

# ----------------------------------------------------------------------------------------------
# S3 Object - Lambda vision module
# ----------------------------------------------------------------------------------------------
data "aws_s3_object" "lambda_vision" {
  bucket = local.bucket_name_archive
  key    = local.bucket_key_lambda_vision
}

# ----------------------------------------------------------------------------------------------
# S3 Object - Lambda start module
# ----------------------------------------------------------------------------------------------
data "aws_s3_object" "lambda_start" {
  bucket = local.bucket_name_archive
  key    = local.bucket_key_lambda_start
}

# ----------------------------------------------------------------------------------------------
# S3 Object - Lambda stop module
# ----------------------------------------------------------------------------------------------
data "aws_s3_object" "lambda_stop" {
  bucket = local.bucket_name_archive
  key    = local.bucket_key_lambda_stop
}

# ----------------------------------------------------------------------------------------------
# S3 Object - Lambda status module
# ----------------------------------------------------------------------------------------------
data "aws_s3_object" "lambda_status" {
  bucket = local.bucket_name_archive
  key    = local.bucket_key_lambda_status
}
