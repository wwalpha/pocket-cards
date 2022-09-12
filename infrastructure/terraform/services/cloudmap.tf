# ----------------------------------------------------------------------------------------------
# Service Discovery Private DNS Namespace
# ----------------------------------------------------------------------------------------------
resource "aws_service_discovery_private_dns_namespace" "this" {
  name        = "${local.project_name}.local"
  description = "${local.project_name}.local"
  vpc         = local.vpc_id
}

# ----------------------------------------------------------------------------------------------
# Service Discovery Service - Backend
# ----------------------------------------------------------------------------------------------
resource "aws_service_discovery_service" "this" {
  name = "backend"

  dns_config {
    namespace_id = aws_service_discovery_private_dns_namespace.this.id

    dns_records {
      ttl  = 60
      type = "A"
    }

    dns_records {
      ttl  = 60
      type = "SRV"
    }

    routing_policy = "MULTIVALUE"
  }

  health_check_custom_config {
    failure_threshold = 1
  }
}

# ----------------------------------------------------------------------------------------------
# Service Discovery Service - Auth
# ----------------------------------------------------------------------------------------------
resource "aws_service_discovery_service" "auth" {
  name = "auth"

  dns_config {
    namespace_id = aws_service_discovery_private_dns_namespace.this.id

    dns_records {
      ttl  = 60
      type = "A"
    }

    dns_records {
      ttl  = 60
      type = "SRV"
    }

    routing_policy = "MULTIVALUE"
  }

  health_check_custom_config {
    failure_threshold = 1
  }
}

# ----------------------------------------------------------------------------------------------
# Service Discovery Service - Users
# ----------------------------------------------------------------------------------------------
resource "aws_service_discovery_service" "users" {
  name = "users"

  dns_config {
    namespace_id = aws_service_discovery_private_dns_namespace.this.id

    dns_records {
      ttl  = 60
      type = "A"
    }

    dns_records {
      ttl  = 60
      type = "SRV"
    }

    routing_policy = "MULTIVALUE"
  }

  health_check_custom_config {
    failure_threshold = 1
  }
}


# ----------------------------------------------------------------------------------------------
# Service Discovery Service - Wss
# ----------------------------------------------------------------------------------------------
resource "aws_service_discovery_service" "wss" {
  name = "wss"

  dns_config {
    namespace_id = aws_service_discovery_private_dns_namespace.this.id

    dns_records {
      ttl  = 60
      type = "A"
    }

    dns_records {
      ttl  = 60
      type = "SRV"
    }

    routing_policy = "MULTIVALUE"
  }

  health_check_custom_config {
    failure_threshold = 1
  }
}
