export interface Subnet {
  range: string;
  zone: string;
}

export interface NetworkContsructProps {
  VpcCidrBlock: string;
  PublicSubnets: Subnet[];
  PrivateSubnets: Subnet[];
}
