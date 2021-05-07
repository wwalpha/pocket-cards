# # ----------------------------------------------------------------------------------------------
# # VPC Endpoint
# # ----------------------------------------------------------------------------------------------
# resource "aws_vpc_endpoint" "ecr_api" {
#   vpc_id            = module.vpc.vpc_id
#   service_name      = "com.amazonaws.ap-northeast-1.ecr.api"
#   vpc_endpoint_type = "Interface"

#   security_group_ids = [
#     aws_security_group.endpoint.id,
#   ]

#   private_dns_enabled = true
# }

# # ----------------------------------------------------------------------------------------------
# # VPC Endpoint Subnet Association
# # ----------------------------------------------------------------------------------------------
# resource "aws_vpc_endpoint_subnet_association" "ecr_api1" {
#   vpc_endpoint_id = aws_vpc_endpoint.ecr_api.id
#   subnet_id       = module.vpc.private_subnets[0]
# }

# # ----------------------------------------------------------------------------------------------
# # VPC Endpoint Subnet Association
# # ----------------------------------------------------------------------------------------------
# resource "aws_vpc_endpoint_subnet_association" "ecr_api2" {
#   vpc_endpoint_id = aws_vpc_endpoint.ecr_api.id
#   subnet_id       = module.vpc.private_subnets[1]
# }

# # ----------------------------------------------------------------------------------------------
# # VPC Endpoint
# # ----------------------------------------------------------------------------------------------
# resource "aws_vpc_endpoint" "ecr_dkr" {
#   vpc_id            = module.vpc.vpc_id
#   service_name      = "com.amazonaws.ap-northeast-1.ecr.dkr"
#   vpc_endpoint_type = "Interface"

#   security_group_ids = [
#     aws_security_group.endpoint.id,
#   ]

#   private_dns_enabled = true
# }

# # ----------------------------------------------------------------------------------------------
# # VPC Endpoint Subnet Association
# # ----------------------------------------------------------------------------------------------
# resource "aws_vpc_endpoint_subnet_association" "ecr_dkr1" {
#   vpc_endpoint_id = aws_vpc_endpoint.ecr_dkr.id
#   subnet_id       = module.vpc.private_subnets[0]
# }

# # ----------------------------------------------------------------------------------------------
# # VPC Endpoint Subnet Association
# # ----------------------------------------------------------------------------------------------
# resource "aws_vpc_endpoint_subnet_association" "ecr_dkr2" {
#   vpc_endpoint_id = aws_vpc_endpoint.ecr_dkr.id
#   subnet_id       = module.vpc.private_subnets[1]
# }

# # ----------------------------------------------------------------------------------------------
# # VPC Endpoint
# # ----------------------------------------------------------------------------------------------
# resource "aws_vpc_endpoint" "s3" {
#   vpc_id       = module.vpc.vpc_id
#   service_name = "com.amazonaws.ap-northeast-1.s3"
# }

# # ----------------------------------------------------------------------------------------------
# # VPC Endpoint Route Table Association
# # ----------------------------------------------------------------------------------------------
# resource "aws_vpc_endpoint_route_table_association" "private_1" {
#   route_table_id  = module.vpc.private_route_table_ids[0]
#   vpc_endpoint_id = aws_vpc_endpoint.s3.id
# }

# # ----------------------------------------------------------------------------------------------
# # VPC Endpoint Route Table Association
# # ----------------------------------------------------------------------------------------------
# resource "aws_vpc_endpoint_route_table_association" "private_2" {
#   route_table_id  = module.vpc.private_route_table_ids[1]
#   vpc_endpoint_id = aws_vpc_endpoint.s3.id
# }

