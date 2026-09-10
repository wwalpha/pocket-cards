# ----------------------------------------------------------------------------------------------
# ECR Repository - Backend
# ----------------------------------------------------------------------------------------------
module "ecr_repo_backend" {
  source = "./m_ecr"

  repo_name = "${var.project_name}/backend"
}

# ----------------------------------------------------------------------------------------------
# ECR Repository - Batch
# ----------------------------------------------------------------------------------------------
module "ecr_repo_batch" {
  source = "./m_ecr"

  repo_name = "${var.project_name}/batch"
}

# ----------------------------------------------------------------------------------------------
# ECR Repository - Users
# ----------------------------------------------------------------------------------------------
module "ecr_repo_users" {
  source = "./m_ecr"

  repo_name = "${var.project_name}/users"
}

# ----------------------------------------------------------------------------------------------
# ECR Repository - Auth
# ----------------------------------------------------------------------------------------------
module "ecr_repo_auth" {
  source = "./m_ecr"

  repo_name = "${var.project_name}/auth"
}

# Lambda images must retain digests referenced by functions. Do not use m_ecr:
# its demo bootstrap and three-image expiration policy must stay on legacy repositories.
resource "aws_ecr_repository" "lambda" {
  for_each = toset(["backend", "auth", "users"])

  name                 = "${var.project_name}/${each.key}-lambda"
  image_tag_mutability = "MUTABLE"
}

data "aws_iam_policy_document" "lambda_image_retrieval" {
  statement {
    sid    = "LambdaECRImageRetrievalPolicy"
    effect = "Allow"
    actions = [
      "ecr:BatchGetImage",
      "ecr:GetDownloadUrlForLayer",
    ]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_ecr_repository_policy" "lambda" {
  for_each = aws_ecr_repository.lambda

  repository = each.value.name
  policy     = data.aws_iam_policy_document.lambda_image_retrieval.json
}
