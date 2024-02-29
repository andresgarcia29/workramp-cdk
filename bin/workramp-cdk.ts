#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { WorkrampCdkStack } from "../lib/workramp-cdk-stack";

const app = new cdk.App();
new WorkrampCdkStack(app, "WorkrampCdkStack", {
  // env: {
  //   account: process.env.CDK_DEFAULT_ACCOUNT,
  //   region: process.env.CDK_DEFAULT_REGION,
  // },
});
