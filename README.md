# CloudForge: Enterprise Multi-Tier DevSecOps Platform ☁️🔐
> **Modular, Zero-Trust AWS Cloud Foundation & Automated GitOps Delivery Engine**

CloudForge is a production-grade cloud platform engineered with AWS CDK (TypeScript). Designed as an extensible multi-tier architecture, it bridges enterprise infrastructure engineering with modern DevSecOps governance. It delivers isolated multi-AZ networking, hardened container orchestration with direct IP-target ingress, encrypted database persistence, and automated security controls.

---

## 🏛️ Architectural Highlights (Phase 1 Delivered)

* **Infrastructure as Code (IaC):** Modular, reusable TypeScript constructs powered by AWS CDK.
* **Resilient Multi-AZ Networking:** Custom VPC across 3 Availability Zones featuring strictly segmented Public, Application, and Isolated Database subnets with active VPC Flow Logs.
* **Modernized EKS Control Plane:** Hardened Kubernetes 1.31 runtime authenticated via native EKS IAM Access Entries (`API_AND_CONFIG_MAP`), removing reliance on legacy ConfigMaps.
* **High-Performance Ingress:** Direct Pod IP routing via AWS Load Balancer Controller and Application Load Balancers (eliminating NodePort hops).
* **Zero-Trust Persistence:** Private Amazon RDS PostgreSQL instance configured with storage encryption, automated backups, and restricted ingress security groups.

---

## 🗺️ Project Evolution Roadmap

| Phase | Focus Area | Status | Key Deliverables |
| :--- | :--- | :---: | :--- |
| **Phase 1** | **Cloud Foundation & Ingress** | **Completed** | Multi-AZ VPC, Hardened EKS, IAM Access Entries, ALB IP-Target Routing, RDS |
| **Phase 2** | **Elasticity & Workload Resilience** | **In Progress** | Metrics Server, Horizontal Pod Autoscaler (HPA), Stress Testing, Auto Scaling Groups |
| **Phase 3** | **Automated DevSecOps Pipeline** | **Planned** | CI/CD, SonarQube (SAST), Trivy (CVE scanning), Amazon SNS alerts |
| **Phase 4** | **Cloud Governance & Observability** | **Planned** | cdk-nag security checks, Prometheus & Grafana telemetry, runtime compliance |
