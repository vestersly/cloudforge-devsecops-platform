import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export class HardenedVpcStack extends cdk.Stack {
  public readonly vpc: ec2.Vpc;
  public readonly vpcFlowLogBucket: s3.Bucket;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // S3 Bucket for VPC Flow Logs audit trail
    this.vpcFlowLogBucket = new s3.Bucket(this, 'VpcFlowLogsBucket', {
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Multi-AZ VPC spanning 3 Availability Zones
    this.vpc = new ec2.Vpc(this, 'EnterpriseVpc', {
      ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
      maxAzs: 3,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'PublicIngress',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'ApplicationPrivate',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
          cidrMask: 28,
          name: 'DatabaseIsolated',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
      natGateways: 3,
      natGatewayProvider: ec2.NatProvider.gateway(),
    });

    // Capture all IP traffic for security auditing
    this.vpc.addFlowLog('VpcFlowLog', {
      destination: ec2.FlowLogDestination.toS3(this.vpcFlowLogBucket),
      trafficType: ec2.FlowLogTrafficType.ALL,
    });

    new cdk.CfnOutput(this, 'VpcIdOutput', {
      value: this.vpc.vpcId,
      exportName: 'EnterpriseVpcId',
    });
  }
}
