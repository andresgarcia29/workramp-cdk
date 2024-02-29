import { Vpc, PublicSubnet } from "aws-cdk-lib/aws-ec2";

export interface BastionConstructProps {
  vpc: Vpc;
  instanceTypeName: string;
  sshPort: string;
  ec2Name: string;
  publicSubnets: PublicSubnet[];
}
