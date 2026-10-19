import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as eks from 'aws-cdk-lib/aws-eks';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import { KubectlV31Layer } from '@aws-cdk/lambda-layer-kubectl-v31';
import { Construct } from 'constructs';

export interface HardenedEksStackProps extends cdk.StackProps {
  vpc: ec2.IVpc;
}

export class HardenedEksStack extends cdk.Stack {
  public readonly cluster: eks.Cluster;

  constructor(scope: Construct, id: string, props: HardenedEksStackProps) {
    super(scope, id, props);

    // 1. Customer Managed KMS Key for envelope encryption
    const secretsKey = new kms.Key(this, 'EksSecretsKey', {
      enableKeyRotation: true,
      description: 'KMS Key for envelope encryption of Kubernetes secrets in EKS',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // 2. Cluster Admin Master Role (KEEP THIS)
    const clusterAdminRole = new iam.Role(this, 'EksClusterAdminRole', {
      assumedBy: new iam.AccountRootPrincipal(),
      description: 'Dedicated IAM role for EKS cluster administration',
    });

    // 3. Lambda Layer for Kubectl v1.31 (KEEP THIS)
    const kubectlLayer = new KubectlV31Layer(this, 'KubectlLayer');

    // 4. Hardened Amazon EKS Cluster
    this.cluster = new eks.Cluster(this, 'HardenedEksCluster', {
      vpc: props.vpc,
      version: eks.KubernetesVersion.V1_31,
      kubectlLayer: kubectlLayer,
      defaultCapacity: 0,
      clusterLogging: [
        eks.ClusterLoggingTypes.API,
        eks.ClusterLoggingTypes.AUDIT,
        eks.ClusterLoggingTypes.AUTHENTICATOR,
        eks.ClusterLoggingTypes.CONTROLLER_MANAGER,
        eks.ClusterLoggingTypes.SCHEDULER,
      ],
      vpcSubnets: [{ subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS }],
      secretsEncryptionKey: secretsKey,
      mastersRole: clusterAdminRole,
      albController: {
        version: eks.AlbControllerVersion.V2_8_2,
      },
    });
    


// 5. Hardened Managed Node Group
    this.cluster.addNodegroupCapacity('HardenedNodeGroup', {
      instanceTypes: [new ec2.InstanceType('t3.medium')],
      minSize: 2,
      maxSize: 5,
      desiredSize: 2,
      subnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      amiType: eks.NodegroupAmiType.AL2023_X86_64_STANDARD,
      capacityType: eks.CapacityType.ON_DEMAND,
      diskSize: 50,
      labels: {
        environment: 'production',
        workload: 'secure-apps',
      },
      tags: {
        'k8s.io/cluster-autoscaler/enabled': 'true',
      },
    });

    new cdk.CfnOutput(this, 'ClusterName', {
      value: this.cluster.clusterName,
      exportName: 'HardenedClusterName',
    });
  }
}
