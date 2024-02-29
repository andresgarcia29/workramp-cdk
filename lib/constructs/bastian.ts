import {
  Vpc,
  Instance,
  InstanceType,
  AmazonLinuxImage,
  SecurityGroup,
  Port,
  Peer,
  CfnEIP,
  CfnEIPAssociation,
} from "aws-cdk-lib/aws-ec2";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import { BastionConstructProps } from "../interfaces/bastian";

export class BastionConstruct extends Construct {
  constructor(scope: Construct, id: string, props: BastionConstructProps) {
    super(scope, id);

    const securityGroup = new SecurityGroup(this, "BastionSecurityGroup", {
      vpc: props.vpc,
      allowAllOutbound: true,
    });

    securityGroup.addIngressRule(
      Peer.anyIpv4(),
      Port.tcp(parseInt(props.sshPort)),
      "Allow SSH access"
    );

    const instance = new Instance(this, "Bastion", {
      vpc: props.vpc,
      instanceName: props.ec2Name,
      instanceType: new InstanceType("t2.micro"),
      machineImage: new AmazonLinuxImage(),
      vpcSubnets: {
        subnets: props.publicSubnets,
      },
      securityGroup: securityGroup,
    });

    const instancetGatewayEip = new CfnEIP(this, "BastionEip", {});
    new CfnEIPAssociation(this, "BastionEipAssociation", {
      instanceId: instance.instanceId,
      allocationId: instancetGatewayEip.attrAllocationId,
    });

    new cdk.CfnOutput(this, "PublicIP", {
      value: instancetGatewayEip.attrPublicIp,
    });
  }
}
