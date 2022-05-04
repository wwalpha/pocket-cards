# ----------------------------------------------------------------------------------------------
# ECS Cluster
# ----------------------------------------------------------------------------------------------
resource "aws_ecs_cluster" "this" {
  name = "${local.project_name}-cluster"
}

# ----------------------------------------------------------------------------------------------
# ECS Cluster Capacity Providers
# ----------------------------------------------------------------------------------------------
resource "aws_ecs_cluster_capacity_providers" "this" {
  cluster_name       = aws_ecs_cluster.this.name
  capacity_providers = ["FARGATE", "FARGATE_SPOT"]

  default_capacity_provider_strategy {
    base              = 0
    capacity_provider = "FARGATE_SPOT"
    weight            = 1
  }
}

# ----------------------------------------------------------------------------------------------
# AWS ECS Service - Token Service Task Definition
# ----------------------------------------------------------------------------------------------
resource "aws_ecs_task_definition" "this" {
  family             = local.task_def_family_backend
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
      container_name  = local.task_def_family_backend
      container_image = "${local.repo_url_backend}:latest"
      container_port  = 8080
      env_file_arn    = "${data.aws_s3_bucket.archive.arn}/${aws_s3_object.backend.key}"
      # healthCheck     = "curl -f http://127.0.0.1:8080/v1/health || exit 1"
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
  depends_on = [aws_ecs_cluster.this]

  name                               = "backend"
  cluster                            = aws_ecs_cluster.this.id
  desired_count                      = 0
  platform_version                   = "LATEST"
  task_definition                    = "arn:aws:ecs:${local.region}:${local.account_id}:task-definition/${aws_ecs_task_definition.this.family}:${local.task_def_rev}"
  deployment_maximum_percent         = 200
  deployment_minimum_healthy_percent = 100
  health_check_grace_period_seconds  = 0
  wait_for_steady_state              = false
  scheduling_strategy                = "REPLICA"
  enable_ecs_managed_tags            = true

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
    assign_public_ip = !local.is_dev
    subnets          = local.vpc_subnets
    security_groups  = [aws_security_group.ecs_default_sg.id]
  }

  service_registries {
    registry_arn = aws_service_discovery_service.this.arn
    port         = 8080
  }

  provisioner "local-exec" {
    when    = destroy
    command = "sh ${path.module}/scripts/servicediscovery-drain.sh ${length(self.service_registries) != 0 ? split("/", self.service_registries[0].registry_arn)[1] : ""}"
  }

  lifecycle {
    ignore_changes = [
      desired_count
    ]
  }
}
