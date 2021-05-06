# ----------------------------------------------------------------------------------------------
# Service Discovery Private DNS Namespace
# ----------------------------------------------------------------------------------------------
resource "aws_service_discovery_private_dns_namespace" "this" {
  depends_on  = [module.vpc]
  name        = "pocketcards.local"
  description = "pocketcards.local"
  vpc         = module.vpc.vpc_id
}

# ----------------------------------------------------------------------------------------------
# Service Discovery Service - Auth
# ----------------------------------------------------------------------------------------------
resource "aws_service_discovery_service" "this" {
  name = "backend"

  dns_config {
    namespace_id = aws_service_discovery_private_dns_namespace.this.id

    dns_records {
      ttl  = 60
      type = "A"
    }

    routing_policy = "MULTIVALUE"
  }

  health_check_custom_config {
    failure_threshold = 1
  }
}
