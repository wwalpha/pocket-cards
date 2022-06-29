# ------------------------------------------------------------------------------------------------
# AWS CloudFront Distribution
# ------------------------------------------------------------------------------------------------
resource "aws_cloudfront_distribution" "this" {
  depends_on          = [aws_acm_certificate_validation.global]
  enabled             = true
  default_root_object = local.default_root_object
  aliases             = ["www.${local.domain_name}"]

  origin {
    domain_name = data.aws_s3_bucket.frontend.bucket_regional_domain_name
    origin_id   = local.origin_id_frontend
    origin_path = "/users"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.this.cloudfront_access_identity_path
    }
  }

  origin {
    domain_name = data.aws_s3_bucket.materials.bucket_regional_domain_name
    origin_id   = local.origin_id_materials

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.this.cloudfront_access_identity_path
    }
  }

  custom_error_response {
    error_caching_min_ttl = 3000
    error_code            = 403
    response_code         = 200
    response_page_path    = "/${local.default_root_object}"
  }

  default_cache_behavior {
    allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = local.origin_id_frontend
    compress               = true
    viewer_protocol_policy = local.viewer_protocol_policy

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }
  }

  ordered_cache_behavior {
    path_pattern     = "/images/*"
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = local.origin_id_materials

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    compress               = true
  }

  ordered_cache_behavior {
    path_pattern     = "/audios/*"
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = local.origin_id_materials

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    compress               = true
  }

  ordered_cache_behavior {
    path_pattern     = "/voices/*"
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = local.origin_id_materials

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    compress               = true
  }

  viewer_certificate {
    cloudfront_default_certificate = false
    acm_certificate_arn            = aws_acm_certificate_validation.global.certificate_arn
    ssl_support_method             = "sni-only"
    minimum_protocol_version       = "TLSv1.1_2016"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
}

# ------------------------------------------------------------------------------------------------
# AWS CloudFront Distribution
# ------------------------------------------------------------------------------------------------
resource "aws_cloudfront_distribution" "admin" {
  depends_on          = [aws_acm_certificate_validation.global]
  enabled             = true
  default_root_object = local.default_root_object
  aliases             = ["admin.${local.domain_name}"]

  origin {
    domain_name = data.aws_s3_bucket.frontend.bucket_regional_domain_name
    origin_id   = local.origin_id_frontend
    origin_path = "/admin"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.this.cloudfront_access_identity_path
    }
  }

  origin {
    domain_name = data.aws_s3_bucket.materials.bucket_regional_domain_name
    origin_id   = local.origin_id_materials

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.this.cloudfront_access_identity_path
    }
  }

  custom_error_response {
    error_caching_min_ttl = 3000
    error_code            = 403
    response_code         = 200
    response_page_path    = "/${local.default_root_object}"
  }

  default_cache_behavior {
    allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = local.origin_id_frontend
    compress               = true
    viewer_protocol_policy = local.viewer_protocol_policy

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }
  }

  ordered_cache_behavior {
    path_pattern     = "/images/*"
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = local.origin_id_materials

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    compress               = true
  }

  ordered_cache_behavior {
    path_pattern     = "/audios/*"
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = local.origin_id_materials

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    compress               = true
  }

  ordered_cache_behavior {
    path_pattern     = "/voices/*"
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = local.origin_id_materials

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    compress               = true
  }


  viewer_certificate {
    cloudfront_default_certificate = false
    acm_certificate_arn            = aws_acm_certificate_validation.global.certificate_arn
    ssl_support_method             = "sni-only"
    minimum_protocol_version       = "TLSv1.1_2016"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
}

# ------------------------------------------------------------------------------------------------
# CloudFront Origin Access Identity
# ------------------------------------------------------------------------------------------------
resource "aws_cloudfront_origin_access_identity" "this" {
  comment = local.project_name
}

# ------------------------------------------------------------------------------------------------
# CloudFront Origin Access Identity Policy (WEB)
# ------------------------------------------------------------------------------------------------
resource "aws_s3_bucket_policy" "this" {
  depends_on = [aws_cloudfront_origin_access_identity.this]

  bucket = local.bucket_name_frontend
  policy = data.aws_iam_policy_document.this.json
}

data "aws_iam_policy_document" "this" {
  statement {
    effect = "Allow"

    principals {
      type        = "AWS"
      identifiers = ["arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity ${aws_cloudfront_origin_access_identity.this.id}"]
    }

    actions = [
      "s3:GetObject",
    ]

    resources = [
      "${data.aws_s3_bucket.frontend.arn}/*"
    ]
  }
}

# ------------------------------------------------------------------------------------------------
# CloudFront Origin Access Identity Policy (Materials)
# ------------------------------------------------------------------------------------------------
resource "aws_s3_bucket_policy" "materials" {
  depends_on = [aws_cloudfront_origin_access_identity.this]

  bucket = local.bucket_name_materials
  policy = data.aws_iam_policy_document.materials.json
}

data "aws_iam_policy_document" "materials" {
  statement {
    effect = "Allow"

    principals {
      type        = "AWS"
      identifiers = ["arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity ${aws_cloudfront_origin_access_identity.this.id}"]
    }

    actions = [
      "s3:GetObject",
    ]

    resources = [
      "${data.aws_s3_bucket.materials.arn}/*"
    ]
  }
}
