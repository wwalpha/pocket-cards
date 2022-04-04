# ----------------------------------------------------------------------------------------------
# Amazon S3 (archive用)
# ----------------------------------------------------------------------------------------------
resource "aws_s3_bucket" "archive" {
  bucket = local.bucket_name_archive
}

resource "aws_s3_bucket_versioning" "materials" {
  bucket = aws_s3_bucket.materials.id
  versioning_configuration {
    status = "Enabled"
  }
}

# ----------------------------------------------------------------------------------------------
# Amazon S3 (archive用) LifeCycle
# ----------------------------------------------------------------------------------------------
resource "aws_s3_bucket_lifecycle_configuration" "archive" {
  bucket = aws_s3_bucket.archive.id

  rule {
    id     = "images"
    status = "Enabled"

    expiration {
      days = 7
    }

    filter {
      prefix = "images/"
    }
  }

  rule {
    id     = "frontend"
    status = "Enabled"

    expiration {
      days = 30
    }

    filter {
      prefix = "frontend/"
    }
  }

  rule {
    id     = "lambda"
    status = "Enabled"

    noncurrent_version_expiration {
      noncurrent_days = 7
    }

    filter {
      prefix = "lambda/"
    }
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

# resource "aws_s3_bucket_versioning" "materials" {
#   bucket = aws_s3_bucket.materials.id
#   versioning_configuration {
#     status = "Enabled"
#   }
# }

# # ----------------------------------------------------------------------------------------------
# # Amazon S3 Lifecycle - materials
# # ----------------------------------------------------------------------------------------------
# resource "aws_s3_bucket_lifecycle_configuration" "materials" {
#   bucket = aws_s3_bucket.archive.id

#   rule {
#     id = "images"

#     expiration {
#       days = 7
#     }

#     filter {
#       prefix = "images/"
#     }

#     status = "Enabled"
#   }

#   rule {
#     id = "frontend"

#     expiration {
#       days = 30
#     }

#     filter {
#       prefix = "frontend/"
#     }

#     status = "Enabled"
#   }
# }
