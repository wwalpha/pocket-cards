# ---------------------------------------------------------------------------------------------
# Dynamodb Table Item - TENANT_ADMIN
# ---------------------------------------------------------------------------------------------
resource "aws_dynamodb_table_item" "tenant_admin" {
  table_name = data.aws_dynamodb_table.settings.name
  hash_key   = data.aws_dynamodb_table.settings.hash_key

  item = <<ITEM
{
  "id": {"S": "TENANT_ADMIN"},
  "clientId": {"S": "${aws_cognito_user_pool_client.admin.id}"},
  "identityPoolId": {"S": "${aws_cognito_identity_pool.admin.id}"},
  "userPoolId": {"S": "${aws_cognito_user_pool.admin.id}"}
}
ITEM
}

# ---------------------------------------------------------------------------------------------
# Dynamodb Table Item - TENANT_USER
# ---------------------------------------------------------------------------------------------
resource "aws_dynamodb_table_item" "tenant_user" {
  table_name = data.aws_dynamodb_table.settings.name
  hash_key   = data.aws_dynamodb_table.settings.hash_key

  item = <<ITEM
{
  "id": {"S": "TENANT_USER"},
  "clientId": {"S": "${aws_cognito_user_pool_client.this.id}"},
  "identityPoolId": {"S": "${aws_cognito_identity_pool.this.id}"},
  "userPoolId": {"S": "${aws_cognito_user_pool.this.id}"}
}
ITEM
}
