import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { WorkrampCdkStack } from "../lib/workramp-cdk-stack";

let app: cdk.App, stack: cdk.Stack, template: Template;

beforeAll(() => {
  app = new cdk.App();
  const stack = new WorkrampCdkStack(app, "stack");
  template = Template.fromStack(stack);
});

test("Network construct VPC", () => {
  template.hasResourceProperties("AWS::EC2::VPC", {
    CidrBlock: "10.1.0.0/16",
  });
});

test("Bastion construct Instance", () => {
  template.hasResourceProperties("AWS::EC2::Instance", {
    AvailabilityZone: "us-east-1a",
    InstanceType: "t2.micro",
  });
});
