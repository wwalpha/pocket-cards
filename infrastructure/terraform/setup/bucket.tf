# ----------------------------------------------------------------------------------------------
# Amazon S3 (archive用)
# ----------------------------------------------------------------------------------------------
resource "aws_s3_bucket" "archive" {
  bucket = local.bucket_name_archive
}

# ----------------------------------------------------------------------------------------------
# Amazon S3 (archive用) LifeCycle
# ----------------------------------------------------------------------------------------------
resource "aws_s3_bucket_lifecycle_configuration" "archive_images" {
  bucket = aws_s3_bucket.archive.id

  rule {
    id = "images"

    expiration {
      days = 7
    }

    filter {
      prefix = "images/"
    }

    status = "Enabled"
  }

  rule {
    id = "frontend"

    expiration {
      days = 30
    }

    filter {
      prefix = "frontend/"
    }

    status = "Enabled"
  }
}

# ----------------------------------------------------------------------------------------------
# Amazon S3 (WEBサイト)
# ----------------------------------------------------------------------------------------------
resource "aws_s3_bucket" "frontend" {
  bucket = local.bucket_name_frontend
}

# ----------------------------------------------------------------------------------------------
# DEMO SITE
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "this" {
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
# Amazon S3 (資材)
# ----------------------------------------------------------------------------------------------
resource "aws_s3_bucket" "materials" {
  bucket = local.bucket_name_materials
}

resource "aws_s3_bucket_acl" "materials" {
  bucket = aws_s3_bucket.materials.id
  acl    = "private"
}
