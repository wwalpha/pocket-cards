# ----------------------------------------------------------------------------------------------
# ECR Repository - Backend
# ----------------------------------------------------------------------------------------------
module "ecr_repo_backend" {
  source = "./m_ecr"

  repo_name = "${local.project_name}/backend2"
}

# ----------------------------------------------------------------------------------------------
# ECR Repository - Batch
# ----------------------------------------------------------------------------------------------
module "ecr_repo_batch" {
  source = "./m_ecr"

  repo_name = "${local.project_name}/batch2"
}

# ----------------------------------------------------------------------------------------------
# ECR Repository - Users
# ----------------------------------------------------------------------------------------------
module "ecr_repo_users" {
  source = "./m_ecr"

  repo_name = "${local.project_name}/users"
}

# resource "aws_ecr_repository" "backend" {
#   name = "${local.project_name}/backend"
# }

# resource "aws_ecr_repository" "this" {
#   name                 = "${local.project_name}/backend"
#   image_tag_mutability = "MUTABLE"

#   image_scanning_configuration {
#     scan_on_push = false
#   }
# }

# # ----------------------------------------------------------------------------------------------
# # ECR Lifecycle Policy
# # ----------------------------------------------------------------------------------------------
# resource "aws_ecr_lifecycle_policy" "this" {
#   repository = aws_ecr_repository.this.name

#   policy = <<EOF
# {
#     "rules": [
#         {
#             "rulePriority": 1,
#             "description": "Expire images count more than 3",
#             "selection": {
#                 "tagStatus": "any",
#                 "countType": "imageCountMoreThan",
#                 "countNumber": 3
#             },
#             "action": {
#                 "type": "expire"
#             }
#         }
#     ]
# }
# EOF
# }

# # ----------------------------------------------------------------------------------------------
# # Null Resource
# # ----------------------------------------------------------------------------------------------
# resource "null_resource" "nginx" {
#   triggers = {
#     file_content_md5 = md5(file("${path.module}/scripts/dockerbuild.sh"))
#   }

#   provisioner "local-exec" {
#     command = "sh ${path.module}/scripts/dockerbuild.sh"

#     environment = {
#       FOLDER_PATH    = "demo"
#       AWS_REGION     = local.region
#       AWS_ACCOUNT_ID = local.account_id
#       REPO_URL       = aws_ecr_repository.this.repository_url
#     }
#   }
# }

# # ----------------------------------------------------------------------------------------------
# # ECR
# # ----------------------------------------------------------------------------------------------
# resource "aws_ecr_repository" "batch" {
#   name                 = "${local.project_name}/batch"
#   image_tag_mutability = "MUTABLE"

#   image_scanning_configuration {
#     scan_on_push = false
#   }
# }

# # ----------------------------------------------------------------------------------------------
# # ECR Lifecycle Policy
# # ----------------------------------------------------------------------------------------------
# resource "aws_ecr_lifecycle_policy" "batch" {
#   repository = aws_ecr_repository.batch.name

#   policy = <<EOF
# {
#     "rules": [
#         {
#             "rulePriority": 1,
#             "description": "Expire images count more than 3",
#             "selection": {
#                 "tagStatus": "any",
#                 "countType": "imageCountMoreThan",
#                 "countNumber": 3
#             },
#             "action": {
#                 "type": "expire"
#             }
#         }
#     ]
# }
# EOF
# }

# # ----------------------------------------------------------------------------------------------
# # Null Resource
# # ----------------------------------------------------------------------------------------------
# resource "null_resource" "batch" {
#   triggers = {
#     file_content_md5 = md5(file("${path.module}/scripts/dockerbuild.sh"))
#   }

#   provisioner "local-exec" {
#     command = "sh ${path.module}/scripts/dockerbuild.sh"

#     environment = {
#       FOLDER_PATH    = "demo"
#       AWS_REGION     = local.region
#       AWS_ACCOUNT_ID = local.account_id
#       REPO_URL       = aws_ecr_repository.batch.repository_url
#     }
#   }
# }

