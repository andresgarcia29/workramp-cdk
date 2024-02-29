export interface Subnet {
  range: string;
  zone: string;
}

export interface NetworkContructProps {
  VpcCidrBlock: string;
  PublicSubnets: Subnet[];
  PrivateSubnets: Subnet[];
}
