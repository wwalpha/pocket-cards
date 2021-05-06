# -----------------------------------------------------------------------------------------------------
# AWS Certificate Manager - Web
# -----------------------------------------------------------------------------------------------------
resource "aws_acm_certificate" "web" {
  provider          = aws.global
  domain_name       = "cards.${local.domain_name}"
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

# -----------------------------------------------------------------------------------------------------
# AWS Route53 Record - Web Certificate
# -----------------------------------------------------------------------------------------------------
resource "aws_route53_record" "web_validation" {
  provider = aws.global

  for_each = {
    for dvo in aws_acm_certificate.web.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  name    = each.value.name
  type    = each.value.type
  records = [each.value.record]
  zone_id = data.aws_route53_zone.this.zone_id
  ttl     = 60
}

# -----------------------------------------------------------------------------------------------------
# AWS Certificate Manager - Web Validation
# -----------------------------------------------------------------------------------------------------
resource "aws_acm_certificate_validation" "web" {
  provider                = aws.global
  certificate_arn         = aws_acm_certificate.web.arn
  validation_record_fqdns = [for record in aws_route53_record.web_validation : record.fqdn]
}

# -----------------------------------------------------------------------------------------------------
# AWS Certificate Manager - API
# -----------------------------------------------------------------------------------------------------
resource "aws_acm_certificate" "api" {
  domain_name       = "api.${local.domain_name}"
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

# -----------------------------------------------------------------------------------------------------
# AWS Route53 Record - Api Certificate
# -----------------------------------------------------------------------------------------------------
resource "aws_route53_record" "api_validation" {
  for_each = {
    for dvo in aws_acm_certificate.api.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  name    = each.value.name
  type    = each.value.type
  records = [each.value.record]
  zone_id = data.aws_route53_zone.this.zone_id
  ttl     = 60
}

# -----------------------------------------------------------------------------------------------------
# AWS Certificate Manager - Api Validation
# -----------------------------------------------------------------------------------------------------
resource "aws_acm_certificate_validation" "api" {
  certificate_arn         = aws_acm_certificate.api.arn
  validation_record_fqdns = [for record in aws_route53_record.api_validation : record.fqdn]
}
