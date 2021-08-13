# ----------------------------------------------------------------------------------------------
# Amazon S3 (画像保存用)
# ----------------------------------------------------------------------------------------------
resource "aws_s3_bucket" "archive" {
  bucket = local.bucket_name_archive
  acl    = "private"

  lifecycle_rule {
    enabled = true

    prefix = "images/"

    // 7日後削除
    expiration {
      days = 7
    }
  }
}

# ----------------------------------------------------------------------------------------------
# Amazon S3 (WEBサイト)
# ----------------------------------------------------------------------------------------------
resource "aws_s3_bucket" "frontend" {
  bucket = local.bucket_name_frontend
  acl    = "private"
}

# ----------------------------------------------------------------------------------------------
# DEMO SITE
# ----------------------------------------------------------------------------------------------
resource "aws_s3_bucket_object" "this" {
  for_each     = fileset("website/", "**/*.*")
  bucket       = aws_s3_bucket.frontend.id
  key          = each.value
  source       = "website/${each.value}"
  etag         = filemd5("website/${each.value}")
  content_type = lookup(local.mime_types, split(".", each.value)[length(split(".", each.value)) - 1])

  lifecycle {
    ignore_changes = [
      etag
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# Lambda Dummy Module
# ----------------------------------------------------------------------------------------------
resource "aws_s3_bucket_object" "lambda_dummy" {
  bucket       = aws_s3_bucket.archive.bucket
  key          = "lambda/${data.archive_file.lambda_dummy.output_base64sha256}"
  source       = data.archive_file.lambda_dummy.output_path
  content_type = "application/zip"

  lifecycle {
    ignore_changes = [
      key
    ]
  }
}

data "archive_file" "lambda_dummy" {
  type        = "zip"
  output_path = "./dummy.zip"

  source {
    filename = "index.js"
    content  = <<EOT
exports.handler = async (event) => {
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};
EOT
  }
}
