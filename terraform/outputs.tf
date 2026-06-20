output "cluster_endpoint" {
  description = "Endpoint for EKS control plane"
  value       = aws_eks_cluster.beacon_cluster.endpoint
}

output "cluster_name" {
  description = "Kubernetes Cluster Name"
  value       = aws_eks_cluster.beacon_cluster.name
}

output "vpc_id" {
  description = "VPC ID where the cluster is deployed"
  value       = aws_vpc.beacon_vpc.id
}
