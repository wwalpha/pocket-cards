# ----------------------------------------------------------------------------------------------
# Terraform Settings
# ----------------------------------------------------------------------------------------------
terraform {
  backend "s3" {
    bucket = "terraform-state-202106"
    key    = "pkc/setup.state"
    region = "us-east-1"
    acl    = "bucket-owner-full-control"
  }
}
