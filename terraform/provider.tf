terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  required_version = ">= 1.2.0"
}

provider "aws" {
  region = var.aws_region
  
  # For local testing, you could mock the credentials
  # access_key = "mock_access_key"
  # secret_key = "mock_secret_key"
}
