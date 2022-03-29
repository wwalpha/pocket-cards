# ----------------------------------------------------------------------------------------------
# Lambda Function - Authorizer
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function" "authorizer" {
  function_name = "${local.project_name}-authorizer"
  filename      = data.archive_file.authorizer.output_path
  handler       = local.lambda_handler
  runtime       = local.lambda_runtime
  memory_size   = 128
  role          = aws_iam_role.authorizer.arn
  timeout       = 3
  environment {
    variables = {
      TABLE_NAME_USER = local.dynamodb_name_users
    }
  }
}

data "archive_file" "authorizer" {
  type        = "zip"
  output_path = "${path.module}/dist/authorizer.zip"

  source {
    content  = <<EOT
exports.handler = async (event) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify('Hello from Lambda!'),
  };
  return response;
};
EOT
    filename = "index.js"
  }
}

# ----------------------------------------------------------------------------------------------
# Lambda Permission - Authorizer
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_permission" "authorizer" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.authorizer.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.this.execution_arn}/authorizers/${aws_apigatewayv2_authorizer.this.id}"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Authorizer - Authorization
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_authorizer" "auth" {
  name                              = "Authorizer"
  api_id                            = aws_apigatewayv2_api.this.id
  authorizer_type                   = "REQUEST"
  authorizer_uri                    = aws_lambda_function.authorizer.invoke_arn
  authorizer_payload_format_version = "2.0"
  enable_simple_responses           = true
  authorizer_result_ttl_in_seconds  = 300
  identity_sources                  = ["$request.header.Authorization"]
}
