import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { NetworkContsructProps } from "./interfaces/network";
import { NetworkConstruct } from "./constructs/network";
import { BastionConstruct } from "./constructs/bastian";

export class WorkrampCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const NetworkContsructProps: NetworkContsructProps = {
      VpcCidrBlock: "10.1.0.0/16",
      PublicSubnets: [
        {
          range: "10.1.0.0/20",
          zone: "us-east-1a",
        },
        {
          range: "10.1.16.0/20",
          zone: "us-east-1b",
        },
        {
          range: "10.1.32.0/20",
          zone: "us-east-1c",
        },
      ],
      PrivateSubnets: [
        {
          range: "10.1.48.0/20",
          zone: "us-east-1a",
        },
        {
          range: "10.1.64.0/20",
          zone: "us-east-1b",
        },
        {
          range: "10.1.80.0/20",
          zone: "us-east-1c",
        },
      ],
    };

    const networkContruct = new NetworkConstruct(
      this,
      "NetworkContruct",
      NetworkContsructProps
    );
    new BastionConstruct(this, "BastionConstruct", {
      vpc: networkContruct.VPC,
      ec2Name: "bastion-host",
      instanceTypeName: "t2.micro",
      sshPort: "22",
      publicSubnets: networkContruct.PublicSubnets,
    });
  }
}
