# # output "cloudfront_ditribution_id" {
# #   value = "${aws_cloudfront_distribution.this.id}"
# # }

# output "web_domain_name" {
#   value     = aws_acm_certificate.web
#   sensitive = true
# }

# output "ecs_service" {
#   value = aws_ecs_service.this
# }



# ----------------------------------------------------------------------------------------------
# ALB URL
# ----------------------------------------------------------------------------------------------
output "alb_url" {
  value = "https://backend.${local.domain_name}"
}

# ----------------------------------------------------------------------------------------------
# API Gateway URL
# ----------------------------------------------------------------------------------------------
output "api_url" {
  value = "https://api.${local.domain_name}"
}

output "test" {
  value = aws_apigatewayv2_integration.this
}
