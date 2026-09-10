# Separate roles: no ECS task-role, sidecar, ECR-pull or Lambda-to-Lambda policies.
resource "aws_iam_role" "web" {
  for_each = toset(["backend", "auth", "users"])

  name               = "${local.project_name_uc}_Lambda_${title(each.key)}Role"
  assume_role_policy = data.aws_iam_policy_document.lambda.json
}

resource "aws_iam_role_policy_attachment" "web_logs" {
  for_each = aws_iam_role.web

  role       = each.value.name
  policy_arn = local.iam_policy_arn_lambda_basic
}

resource "aws_iam_role_policy" "web_backend" {
  name = "application_policy"
  role = aws_iam_role.web["backend"].id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        # DBHelper get/query/scan/put/update/delete, bulk and truncate.
        # @alphax/dynamodb truncate also calls DescribeTable for the key schema.
        Action = [
          "dynamodb:GetItem",
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:BatchWriteItem",
          "dynamodb:DescribeTable",
        ]
        Resource = flatten([for table in [
          local.dynamodb_name_groups,
          local.dynamodb_name_user_words,
          local.dynamodb_name_word_master,
          local.dynamodb_name_traces,
          local.dynamodb_name_questions,
          local.dynamodb_name_learning,
          local.dynamodb_name_curriculums,
          local.dynamodb_name_reports,
          local.dynamodb_name_inquiry,
          local.dynamodb_name_accuracy,
          ] : [
          "arn:aws:dynamodb:${local.region}:${local.account_id}:table/${table}",
          "arn:aws:dynamodb:${local.region}:${local.account_id}:table/${table}/index/*",
        ]])
      },
      {
        Effect = "Allow"
        Action = ["s3:GetObject"]
        Resource = [
          "arn:aws:s3:::${local.bucket_name_materials}/*",
          "arn:aws:s3:::${local.bucket_name_uploads}/public/*",
        ]
      },
      {
        Effect = "Allow"
        # lib-storage Upload aborts incomplete multipart uploads on failure.
        Action   = ["s3:PutObject", "s3:DeleteObject", "s3:AbortMultipartUpload"]
        Resource = "arn:aws:s3:::${local.bucket_name_materials}/*"
      },
      {
        Effect   = "Allow"
        Action   = ["polly:SynthesizeSpeech"]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = ["ses:SendEmail"]
        Resource = [
          "arn:aws:ses:${local.region}:${local.account_id}:identity/${local.domain_name}",
          "arn:aws:ses:${local.region}:${local.account_id}:identity/master@${local.domain_name}",
        ]
      },
      {
        Effect   = "Allow"
        Action   = ["timestream:WriteRecords"]
        Resource = "arn:aws:timestream:${local.region}:${local.account_id}:database/${local.timestream_database}/table/${local.timestream_table_traces}"
      },
      {
        Effect = "Allow"
        # TimestreamWrite SDK discovers the endpoint before WriteRecords.
        Action   = ["timestream:DescribeEndpoints"]
        Resource = "*"
      },
    ]
  })
}

resource "aws_iam_role_policy" "web_auth" {
  name = "application_policy"
  role = aws_iam_role.web["auth"].id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = ["cognito-idp:AdminInitiateAuth"]
        # Pool IDs are resolved by the existing application; constrain account/region.
        Resource = "arn:aws:cognito-idp:${local.region}:${local.account_id}:userpool/*"
      },
    ]
  })
}

resource "aws_iam_role_policy" "web_users" {
  name = "application_policy"
  role = aws_iam_role.web["users"].id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = ["dynamodb:GetItem", "dynamodb:Query"]
        Resource = flatten([for table in [
          local.dynamodb_name_users,
          local.dynamodb_name_settings,
          local.dynamodb_name_curriculums,
          local.dynamodb_name_groups,
          ] : [
          "arn:aws:dynamodb:${local.region}:${local.account_id}:table/${table}",
          "arn:aws:dynamodb:${local.region}:${local.account_id}:table/${table}/index/*",
        ]])
      },
      {
        Effect   = "Allow"
        Action   = ["dynamodb:PutItem"]
        Resource = "arn:aws:dynamodb:${local.region}:${local.account_id}:table/${local.dynamodb_name_users}"
      },
      {
        Effect = "Allow"
        Action = [
          "cognito-idp:AdminCreateUser",
          "cognito-idp:ListUsers",
          "cognito-idp:AdminSetUserPassword",
          "cognito-idp:AdminDeleteUser",
        ]
        # Pool IDs come from the settings table, not the identity-pool ARNs.
        Resource = "arn:aws:cognito-idp:${local.region}:${local.account_id}:userpool/*"
      },
      {
        Effect = "Allow"
        # VerifyEmailAddress does not support resource-level permissions.
        Action   = ["ses:VerifyEmailAddress"]
        Resource = "*"
      },
    ]
  })
}
