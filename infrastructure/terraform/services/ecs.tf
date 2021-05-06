# ----------------------------------------------------------------------------------------------
# ECS Cluster
# ----------------------------------------------------------------------------------------------
resource "aws_ecs_cluster" "this" {
  name = "pocket-cards-cluster"

  capacity_providers = ["FARGATE", "FARGATE_SPOT"]

  default_capacity_provider_strategy {
    base              = 0
    capacity_provider = "FARGATE_SPOT"
    weight            = 1
  }

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

# ----------------------------------------------------------------------------------------------
# AWS ECS Service - Token Service Task Definition
# ----------------------------------------------------------------------------------------------
resource "aws_ecs_task_definition" "this" {
  depends_on         = [null_resource.nginx]
  family             = local.task_def_family
  task_role_arn      = aws_iam_role.ecs_task.arn
  execution_role_arn = aws_iam_role.ecs_task_exec.arn
  network_mode       = "awsvpc"
  cpu                = "256"
  memory             = "512"

  requires_compatibilities = [
    "FARGATE"
  ]

  # proxy_configuration {
  #   type           = "APPMESH"
  #   container_name = "envoy"
  #   properties = {
  #     "ProxyIngressPort" = "15000"
  #     "ProxyEgressPort"  = "15001"
  #     "AppPorts"         = "8080"
  #     "EgressIgnoredIPs" = "169.254.170.2,169.254.169.254"
  #     "IgnoredUID"       = "1337"
  #   }
  # }

  container_definitions = templatefile(
    "taskdefs/definition.tpl",
    {
      aws_region      = local.region
      container_name  = local.task_def_family
      container_image = "${aws_ecr_repository.this.repository_url}:latest"
      # app_mesh_node     = split(":", aws_appmesh_virtual_node.token.arn)[5]
      # dynamodb_tables   = aws_ssm_parameter.tables.arn
      # service_endpoints = aws_ssm_parameter.endpoints.arn
    }
  )

  provisioner "local-exec" {
    when    = destroy
    command = "sh ${path.module}/scripts/deregister-taskdef.sh ${self.family}"
  }
}

# ----------------------------------------------------------------------------------------------
# ECS Service - Backend Service
# ----------------------------------------------------------------------------------------------
resource "aws_ecs_service" "this" {
  name                               = "backend"
  cluster                            = aws_ecs_cluster.this.id
  desired_count                      = 1
  platform_version                   = "1.4.0"
  task_definition                    = "arn:aws:ecs:${local.region}:${local.account_id}:task-definition/${aws_ecs_task_definition.this.family}:${local.task_def_rev}"
  deployment_maximum_percent         = 200
  deployment_minimum_healthy_percent = 100
  health_check_grace_period_seconds  = 0

  capacity_provider_strategy {
    base              = 0
    weight            = 1
    capacity_provider = "FARGATE_SPOT"
  }

  deployment_circuit_breaker {
    enable   = false
    rollback = false
  }

  deployment_controller {
    type = "ECS"
  }

  network_configuration {
    assign_public_ip = true
    subnets          = module.vpc.public_subnets
    security_groups  = [aws_security_group.ecs_default_sg.id]
  }

  scheduling_strategy = "REPLICA"

  service_registries {
    registry_arn   = aws_service_discovery_service.this.arn
    container_port = 0
    port           = 0
  }

  provisioner "local-exec" {
    when    = destroy
    command = "sh ${path.module}/scripts/servicediscovery-drain.sh ${split("/", self.service_registries[0].registry_arn)[1]}"
  }
}
