# ----------------------------------------------------------------------------------------------
# Amazon S3 (画像保存用)
# ----------------------------------------------------------------------------------------------
resource "aws_s3_bucket" "images" {
  bucket = local.bucket_name_images
  acl    = "private"

  lifecycle_rule {
    enabled = true

    // 7日後削除
    expiration {
      days = 7
    }
  }
}

# ----------------------------------------------------------------------------------------------
# Amazon S3 (MP3保存用)
# ----------------------------------------------------------------------------------------------
resource "aws_s3_bucket" "audios" {
  bucket = local.bucket_name_audio
  acl    = "private"
}

# ----------------------------------------------------------------------------------------------
# Amazon S3 (WEBサイト)
# ----------------------------------------------------------------------------------------------
resource "aws_s3_bucket" "frontend" {
  bucket = local.bucket_name_frontend
  acl    = "private"
}

# ----------------------------------------------------------------------------------------------
# Amazon S3 (ログ保存用)
# ----------------------------------------------------------------------------------------------
resource "aws_s3_bucket" "logging" {
  bucket = local.bucket_name_logging
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
