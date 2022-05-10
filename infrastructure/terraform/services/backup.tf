# ---------------------------------------------------------------------------------------------
# AWS Backup Vault
# ---------------------------------------------------------------------------------------------
resource "aws_backup_vault" "dynamodb" {
  name = "${local.project_name}-dynamodb-vault"
}


# ---------------------------------------------------------------------------------------------
# AWS Backup Plan
# ---------------------------------------------------------------------------------------------
resource "aws_backup_plan" "dynamodb" {
  name = "${local.project_name}-dynamodb"

  rule {
    rule_name                = "daily"
    schedule                 = "cron(0 17 * * ? *)"
    target_vault_name        = aws_backup_vault.dynamodb.name
    enable_continuous_backup = false
    start_window             = 60
    completion_window        = 120

    lifecycle {
      cold_storage_after = 0
      delete_after       = 7
    }
  }

  rule {
    rule_name                = "weekly"
    schedule                 = "cron(0 17 ? * 2 *)"
    target_vault_name        = aws_backup_vault.dynamodb.name
    enable_continuous_backup = false
    start_window             = 60
    completion_window        = 120

    lifecycle {
      cold_storage_after = 0
      delete_after       = 168
    }
  }
}

# ---------------------------------------------------------------------------------------------
# AWS Backup Selection
# ---------------------------------------------------------------------------------------------
resource "aws_backup_selection" "dynamodb" {
  iam_role_arn = aws_iam_role.backup.arn
  name         = "dynamodb"
  plan_id      = aws_backup_plan.dynamodb.id
  resources    = ["arn:aws:dynamodb:*:*:table/pkc-*"]

  selection_tag {
    type  = "STRINGEQUALS"
    key   = "aws:ResourceTag/Project"
    value = local.project_name
  }
}
