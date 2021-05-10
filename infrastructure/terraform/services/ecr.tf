# ----------------------------------------------------------------------------------------------
# ECR
# ----------------------------------------------------------------------------------------------
resource "aws_ecr_repository" "this" {
  name                 = "pocket-cards/backend"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = false
  }
}

# ----------------------------------------------------------------------------------------------
# Null Resource
# ----------------------------------------------------------------------------------------------
resource "null_resource" "nginx" {
  triggers = {
    file_content_md5 = md5(file("${path.module}/scripts/dockerbuild.sh"))
  }

  provisioner "local-exec" {
    command = "sh ${path.module}/scripts/dockerbuild.sh"

    environment = {
      FOLDER_PATH    = "demo"
      AWS_REGION     = local.region
      AWS_ACCOUNT_ID = local.account_id
      REPO_URL       = aws_ecr_repository.this.repository_url
    }
  }
}
