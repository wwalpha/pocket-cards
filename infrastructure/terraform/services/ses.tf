# --------------------------------------------------------------------------------------------------------------
# AWS SES Domain Identity
# --------------------------------------------------------------------------------------------------------------
resource "aws_ses_domain_identity" "this" {
  domain = local.domain_name
}

# --------------------------------------------------------------------------------------------------------------
# AWS Route53 Verify TXT Record
# --------------------------------------------------------------------------------------------------------------
resource "aws_route53_record" "amazonses_verification_record" {
  zone_id = data.aws_route53_zone.this.id
  name    = "_amazonses.${local.domain_name}"
  type    = "TXT"
  ttl     = "600"
  records = [aws_ses_domain_identity.this.verification_token]
}

# --------------------------------------------------------------------------------------------------------------
# AWS SES Domain Identity Verification
# --------------------------------------------------------------------------------------------------------------
resource "aws_ses_domain_identity_verification" "this" {
  domain = aws_ses_domain_identity.this.id

  depends_on = [aws_route53_record.amazonses_verification_record]
}
