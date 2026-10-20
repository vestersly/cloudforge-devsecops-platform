# ☁️ CloudForge DevSecOps Platform

### Secure AWS Infrastructure | Kubernetes | CI/CD Security | Observability

![AWS](https://img.shields.io/badge/AWS-Cloud-orange)
![Amazon EKS](https://img.shields.io/badge/Amazon_EKS-Kubernetes-blue)
![AWS CDK](https://img.shields.io/badge/AWS_CDK-TypeScript-blue)
![DevSecOps](https://img.shields.io/badge/DevSecOps-Security_Automation-green)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-CI%2FCD-blue)
![CloudWatch](https://img.shields.io/badge/CloudWatch-Observability-purple)

---

## 📌 Project Overview

**CloudForge DevSecOps Platform** is a hands-on AWS cloud engineering
project demonstrating infrastructure automation, Kubernetes workload
security, continuous integration, security scanning, application
load balancing, horizontal pod autoscaling, and operational monitoring.

The platform was provisioned using **AWS Cloud Development Kit
(AWS CDK v2) with TypeScript**.

The project demonstrates how cloud infrastructure, Kubernetes
orchestration, DevSecOps security controls, and observability
can be integrated into a single AWS environment.

### Key Engineering Objectives

- Provision AWS infrastructure using Infrastructure as Code.
- Deploy Amazon EKS worker nodes into private subnets.
- Implement secure Kubernetes workload configurations.
- Integrate security scanning into GitHub Actions.
- Enforce security gates that reject failing configurations.
- Expose Kubernetes applications through an AWS ALB.
- Demonstrate horizontal pod autoscaling.
- Collect operational metrics using Amazon CloudWatch.
- Apply security engineering and least-privilege principles.

---

# 🏗️ 1. Architecture Overview

```text
                         INTERNET
                            |
                            |
                            v
                +-----------------------+
                | AWS Application       |
                | Load Balancer (ALB)   |
                | HTTP Listener :80     |
                +-----------------------+
                            |
                            v
                +-----------------------+
                | Kubernetes Ingress    |
                | AWS Load Balancer     |
                | Controller            |
                +-----------------------+
                            |
                            v
                +-----------------------+
                | Kubernetes Service    |
                | scalable-app-svc      |
                +-----------------------+
                            |
                 +----------+----------+
                 |                     |
                 v                     v
       +------------------+  +------------------+
       | Private Subnet A |  | Private Subnet C |
       | eu-west-1a       |  | eu-west-1c       |
       +------------------+  +------------------+
                 |                     |
                 v                     v
       +------------------+  +------------------+
       | EKS Worker Node  |  | EKS Worker Node  |
       | 10.0.3.9         |  | 10.0.5.64        |
       +------------------+  +------------------+
                 |                     |
                 v                     v
       +------------------+  +------------------+
       | Hardened NGINX   |  | Hardened NGINX   |
       | Application Pod  |  | Application Pod  |
       |                  |  |                  |
       | Non-root UID 101 |  | Non-root UID 101 |
       | Read-only root   |  | Read-only root   |
       | Drop ALL caps    |  | Drop ALL caps    |
       +------------------+  +------------------+
                 |                     |
                 +----------+----------+
                            |
                            v
                +-----------------------+
                | Kubernetes HPA        |
                | CPU-Based Autoscaling |
                | Min: 2 / Max: 8       |
                +-----------------------+

                 OBSERVABILITY LAYER
                            |
                +-----------------------+
                | CloudWatch Agent      |
                | Fluent Bit            |
                +-----------------------+
                            |
                            v
                +-----------------------+
                | Amazon CloudWatch     |
                | Container Insights    |
                +-----------------------+
```

The architecture uses AWS-managed infrastructure together with
Kubernetes-native application deployment and scaling mechanisms.

The ALB routes HTTP traffic to Kubernetes application pods through
an IP-based target group.

---

# ⚙️ 2. Technology Stack

| Category | Technologies |
|---|---|
| Cloud Provider | Amazon Web Services |
| AWS Region | eu-west-1 (Ireland) |
| Infrastructure as Code | AWS CDK v2, TypeScript |
| Container Orchestration | Amazon EKS |
| Kubernetes Networking | AWS Load Balancer Controller |
| Load Balancing | AWS Application Load Balancer |
| Container Runtime | Kubernetes-managed containers |
| Application | NGINX |
| CI/CD | GitHub Actions |
| Secret Detection | Gitleaks |
| Security Scanning | Trivy |
| Monitoring | Amazon CloudWatch |
| Container Monitoring | CloudWatch Container Insights |
| Log Collection | Fluent Bit |
| Autoscaling | Kubernetes Horizontal Pod Autoscaler |
| Version Control | Git and GitHub |
| Operating Environment | Linux / Ubuntu / WSL2 |

### EKS Infrastructure

- Infrastructure provisioned using AWS CDK.
- Dedicated Amazon VPC.
- Public and private subnet architecture.
- Worker nodes deployed in private subnets.
- Multi-Availability Zone deployment.
- IAM roles and security groups.
- Kubernetes application deployment.
- AWS Load Balancer Controller integration.

---

# 🔐 3. Kubernetes Security Hardening

Security is integrated into the application deployment process.

The Kubernetes workloads use hardened security contexts to
reduce unnecessary privileges and limit container capabilities.

### Implemented Security Controls

```yaml
securityContext:
  runAsNonRoot: true
  runAsUser: 101
  allowPrivilegeEscalation: false
  readOnlyRootFilesystem: true
  capabilities:
    drop:
      - ALL
  seccompProfile:
    type: RuntimeDefault
```

The security configuration demonstrates:

- Non-root container execution.
- Explicit non-privileged user identity.
- Prevention of privilege escalation.
- Removal of unnecessary Linux capabilities.
- Read-only root filesystem.
- RuntimeDefault seccomp configuration.
- Writable runtime paths supplied through ephemeral volumes.

### Security Objective

Reduce the attack surface of Kubernetes application workloads
while preserving application functionality.

**Note:** These controls represent workload hardening. They do not
by themselves prove cluster-wide enforcement of the Kubernetes
Pod Security Standards Restricted profile.

---

# 🔄 4. GitHub Actions CI/CD Pipeline

The project integrates automated security checks into the
continuous integration process.

### Pipeline Workflow

```text
Developer
    |
    v
Git Push
    |
    v
GitHub Repository
    |
    v
GitHub Actions
    |
    +--------------------------+
    |                          |
    v                          v
TypeScript Build          Secret Detection
and Tests                 Gitleaks
    |                          |
    +-------------+------------+
                  |
                  v
          Infrastructure
          Security Scanning
                Trivy
                  |
                  v
          Security Gate
                  |
                  v
          Pipeline Result
```

### Pipeline Components

**1. TypeScript Build and Tests**

Validates the infrastructure project before changes are merged
or deployed.

**2. Gitleaks Secret Detection**

Scans repository content for potential secrets and credentials.

**3. Trivy Security Scanning**

Scans infrastructure and Kubernetes configuration for
security misconfigurations.

### Blocking Security Gate

Trivy is configured to return a non-zero exit code when
findings meet the configured failure criteria.

```yaml
exit-code: '1'
```

The security gate was tested against misconfigurations and
subsequently passed after Kubernetes manifest remediation.

This demonstrates a shift-left approach in which security
issues are identified before deployment.

### Verified GitHub Actions Evidence

Successful pipeline executions were observed for:

- Commit `27f95f1`
- Commit `3d81a10`

The latter introduced additional Kubernetes security
hardening and blocking Trivy gate configuration.

---

# 🌐 5. AWS Application Load Balancer Integration

The project uses the AWS Load Balancer Controller to manage
Kubernetes Ingress resources.

### Verified Components

- AWS Load Balancer Controller deployed.
- Two controller replicas running.
- Kubernetes Ingress resources created.
- AWS Application Load Balancers provisioned.
- HTTP listeners configured.
- IP-based target groups created.
- Kubernetes pod IP addresses registered.
- External application connectivity verified.

### External Connectivity Test

The scalable application was tested using:

```bash
ALB_DNS=$(kubectl get ingress scalable-app-ingress \
  -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')

curl -I "http://$ALB_DNS/"
```

### Observed Result

```text
HTTP/1.1 200 OK
Content-Type: text/html
Server: nginx/1.25.5
```

This verifies successful HTTP connectivity through the
Application Load Balancer to the NGINX application.

### Security Consideration

The demonstration currently uses HTTP on port 80.

HTTPS with AWS Certificate Manager should be implemented
before treating this deployment as production-ready.

---

# 📈 6. Kubernetes Horizontal Pod Autoscaling

The scalable application uses Kubernetes Horizontal Pod
Autoscaling to adjust the number of application replicas
according to resource utilization.

### HPA Configuration

| Parameter | Configuration |
|---|---|
| Minimum Replicas | 2 |
| Maximum Replicas | 8 |
| CPU Utilization Target | 50% |
| Scaling Mechanism | Kubernetes HPA |

### Observed Scaling Behaviour

During earlier workload testing, the application demonstrated:

```text
2 replicas
    |
    v
4 replicas
    |
    v
5 replicas
    |
    v
3 replicas
    |
    v
2 replicas
```

This demonstrates both scale-out and scale-in behaviour.

### Engineering Significance

Horizontal Pod Autoscaling helps applications respond
to changing workload demand while reducing unnecessary
resource consumption when traffic decreases.

**Important:** HPA scales application pods. It does not
automatically guarantee EC2 worker-node autoscaling.

---

# 📊 7. Amazon CloudWatch Observability

Amazon CloudWatch Observability was deployed as an
Amazon EKS managed add-on.

### Installed Components

- Amazon CloudWatch Observability Controller.
- CloudWatch Agent.
- Fluent Bit.
- CloudWatch Container Insights.

### Verified Add-on Status

```text
amazon-cloudwatch-observability
Status: ACTIVE
```

### Kubernetes Monitoring Agents

| Component | Desired | Ready |
|---|---:|---:|
| CloudWatch Agent | 2 | 2 |
| Fluent Bit | 2 | 2 |
| Observability Controller | 1 | 1 |

Both Linux worker nodes have running monitoring agents.

### Verified Container Insights Metrics

The AWS CloudWatch CLI returned metrics in the
`ContainerInsights` namespace, including:

```text
pod_memory_utilization
pod_container_status_running
```

The metrics were associated with the deployed EKS cluster.

This verifies that CloudWatch is receiving Kubernetes
telemetry from the environment.

### Verification Command

```bash
aws cloudwatch list-metrics \
  --namespace ContainerInsights \
  --dimensions Name=ClusterName,Value="$CLUSTER_NAME" \
  --region eu-west-1 \
  --max-items 10
```

### Remaining Observability Work

- Verify CloudWatch log ingestion.
- Retrieve numerical CPU and memory measurements.
- Create a monitoring dashboard.
- Correlate workload scaling with monitoring data.
- Review log retention and monitoring costs.

---

# 🛡️ 8. Security Engineering Principles

The CloudForge project applies several security
engineering concepts.

### Defense in Depth

Security controls are applied at multiple layers:

- AWS networking.
- IAM permissions.
- Kubernetes workload configuration.
- Container runtime restrictions.
- CI/CD security scanning.
- Infrastructure monitoring.

### Least Privilege

Application containers run without root privileges
and unnecessary Linux capabilities.

### Shift-Left Security

Automated scanning is integrated into the CI pipeline
to detect issues earlier in the development lifecycle.

### Infrastructure as Code

AWS infrastructure is defined using TypeScript and
AWS CDK rather than relying entirely on manual configuration.

### Observability

CloudWatch agents and Container Insights provide
operational visibility into Kubernetes workloads.

---

# 🧪 9. Validation and Verification

| Engineering Test | Result |
|---|---|
| AWS CDK Infrastructure Deployment | Passed |
| EKS Cluster Deployment | Passed |
| Kubernetes Workload Deployment | Passed |
| Non-root Container Configuration | Implemented |
| GitHub Actions Pipeline | Passed |
| Gitleaks Scan | Passed |
| Trivy Security Gate | Validated |
| AWS Load Balancer Controller | Running |
| ALB External HTTP Connectivity | HTTP 200 OK |
| Horizontal Pod Autoscaling | Demonstrated |
| CloudWatch Observability Add-on | ACTIVE |
| CloudWatch Agent DaemonSet | 2/2 Ready |
| Fluent Bit DaemonSet | 2/2 Ready |
| Container Insights Metric Discovery | Verified |
| CloudWatch Log Ingestion | Pending |
| Monitoring Dashboard | Pending |
| Dedicated Monitoring IAM Role | Pending |

---

# 📸 10. Project Evidence

Terminal screenshots and deployment evidence will be
organized under:

```text
docs/
└── screenshots/
    ├── eks-cluster-deployment.png
    ├── kubernetes-security-hardening.png
    ├── github-actions-pipeline.png
    ├── trivy-security-gate.png
    ├── alb-external-connectivity.png
    ├── hpa-autoscaling.png
    ├── cloudwatch-agent-status.png
    └── container-insights-metrics.png
```

These filenames are planned documentation assets.
Screenshots will be added as they are collected and reviewed.

---

# 🚧 11. Remaining Improvements

The following enhancements are planned:

1. Verify CloudWatch log ingestion.
2. Create a CloudWatch monitoring dashboard.
3. Configure a dedicated IAM role for monitoring agents.
4. Remove unnecessary monitoring permissions from worker nodes.
5. Configure HTTPS for the public Application Load Balancer.
6. Review duplicate ALB resources and associated costs.
7. Add architecture diagrams and terminal evidence.
8. Finalize project documentation.

---

# 🎯 12. Engineering Outcomes

This project demonstrates hands-on experience with:

- AWS infrastructure design and deployment.
- AWS CDK and TypeScript.
- Amazon EKS administration.
- Kubernetes workload security.
- AWS networking and load balancing.
- GitHub Actions automation.
- Automated security scanning.
- Kubernetes Horizontal Pod Autoscaling.
- Amazon CloudWatch Container Insights.
- Infrastructure troubleshooting and verification.
- DevSecOps engineering practices.

CloudForge brings together infrastructure engineering,
security automation, Kubernetes orchestration, and
operational monitoring in one demonstrable AWS project.

---

# 👨‍💻 Author

**Awungjia Sylvester Bebongchu**

AWS Certified Solutions Architect – Associate  
Cloud & DevSecOps Engineering | Cybersecurity

GitHub: [vestersly](https://github.com/vestersly)

Project Repository:
[CloudForge DevSecOps Platform](https://github.com/vestersly/cloudforge-devsecops-platform)

---

**Project Status:** Active development and validation.

**CloudForge DevSecOps Platform — Building secure, scalable,
and observable cloud infrastructure through automation.**
