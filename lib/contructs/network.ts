import {
  Vpc,
  PublicSubnet,
  PrivateSubnet,
  CfnInternetGateway,
  IpAddresses,
  CfnVPCGatewayAttachment,
  CfnRouteTable,
  CfnRoute,
  CfnSubnetRouteTableAssociation,
  CfnEIP,
  CfnNatGateway,
} from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

import { NetworkContructProps } from "../interfaces/network";
import { SetName } from "../helper/helper";

export class NetworkConstruct extends Construct {
  public readonly VPC: Vpc;
  public readonly PublicSubnets: PublicSubnet[];
  public readonly PrivateSubnets: PrivateSubnet[];

  constructor(scope: Construct, id: string, props: NetworkContructProps) {
    super(scope, id);

    this.VPC = new Vpc(this, "general", {
      vpcName: "general",
      ipAddresses: IpAddresses.cidr(props.VpcCidrBlock),
      createInternetGateway: false,
      subnetConfiguration: [],
    });

    const internetGateway = new CfnInternetGateway(this, "InternetGateway", {
      tags: [SetName("internet-gateway")],
    });

    new CfnVPCGatewayAttachment(this, "VPCInternetGatewayAttachment", {
      vpcId: this.VPC.vpcId,
      internetGatewayId: internetGateway.attrInternetGatewayId,
    });

    const routeTablePublic = new CfnRouteTable(this, "PublicRouteTable", {
      vpcId: this.VPC.vpcId,
      tags: [SetName("public")],
    });

    new CfnRoute(this, "PublicRoute", {
      routeTableId: routeTablePublic.attrRouteTableId,
      gatewayId: internetGateway.attrInternetGatewayId,
      destinationCidrBlock: "0.0.0.0/0",
    });

    this.PublicSubnets = props.PublicSubnets.map((subnet, index) => {
      const publicSubnet = new PublicSubnet(this, `publicSubnet${index + 1}`, {
        availabilityZone: subnet.zone,
        vpcId: this.VPC.vpcId,
        cidrBlock: subnet.range,
      });
      return publicSubnet;
    });

    // TODO: Resolve dependency issue
    this.PublicSubnets.forEach((publicSubnet, index) => {
      new CfnSubnetRouteTableAssociation(this, `publicSubnet${index + 1}RTA`, {
        routeTableId: routeTablePublic.attrRouteTableId,
        subnetId: publicSubnet.subnetId,
      }).addDependency(routeTablePublic);
    });

    const natGatewayEip = new CfnEIP(this, "NatGatewayEip", {});

    const natGateway = new CfnNatGateway(this, "NatGateway", {
      allocationId: natGatewayEip.attrAllocationId,
      subnetId: this.PublicSubnets[0].subnetId,
      tags: [SetName("nat-gateway")],
    });

    this.PrivateSubnets = props.PrivateSubnets.map((subnet, index) => {
      const privateSubnet = new PrivateSubnet(
        this,
        `privateSubnet${index + 1}`,
        {
          availabilityZone: subnet.zone,
          vpcId: this.VPC.vpcId,
          cidrBlock: subnet.range,
        }
      );
      new CfnRoute(this, `privateSubnet${index + 1}Route`, {
        routeTableId: privateSubnet.routeTable.routeTableId,
        destinationCidrBlock: "0.0.0.0/0",
        natGatewayId: natGateway.attrNatGatewayId,
      });
      return privateSubnet;
    });
  }
}
