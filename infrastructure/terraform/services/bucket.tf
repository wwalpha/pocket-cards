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
  content = ""

  lifecycle {
    ignore_changes = [
      content
    ]
  }
}
