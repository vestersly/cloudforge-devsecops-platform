#!/usr/bin/env node

import * as cdk from 'aws-cdk-lib';
import { HardenedVpcStack } from '../lib/hardened-vpc-stack';
import { HardenedEksStack } from '../lib/hardened-eks-stack';

const app = new cdk.App();

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION || 'eu-west-1',
};

// 1. Foundational VPC Stack
const vpcStack = new HardenedVpcStack(app, 'HardenedVpcStack', { env });

// 2. Hardened EKS Cluster connected to the VPC
new HardenedEksStack(app, 'HardenedEksStack', {
  vpc: vpcStack.vpc,
  env,
});  
