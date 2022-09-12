# ----------------------------------------------------------------------------------------------
# Network Load Balancer - VPC Link
# ----------------------------------------------------------------------------------------------
resource "aws_lb" "wss" {
  name               = "${local.project_name}-wss-nlb"
  internal           = true
  load_balancer_type = "network"
  subnets            = local.vpc_subnets

  enable_deletion_protection = false

  count = local.is_dev_only
}


# ----------------------------------------------------------------------------------------------
# Application Load Balancer Target Group
# ----------------------------------------------------------------------------------------------
resource "aws_lb_target_group" "wss" {
  name_prefix = "wss"
  port        = 8080
  protocol    = "TCP"
  target_type = "ip"
  vpc_id      = local.vpc_id

  lifecycle {
    create_before_destroy = true
  }

  count = local.is_dev_only
}

# ----------------------------------------------------------------------------------------------
# Network Load Balancer Target Group
# ----------------------------------------------------------------------------------------------
resource "aws_lb_listener" "wss" {
  depends_on = [aws_lb.wss, aws_lb_target_group.wss]

  load_balancer_arn = aws_lb.wss[0].arn
  port              = "80"
  protocol          = "TCP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.wss[0].arn
  }

  count = local.is_dev_only
}
