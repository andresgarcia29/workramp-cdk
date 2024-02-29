# AWS CDK WorkRamp Documentation

## Overview

This documentation provides a comprehensive guide to two AWS CDK constructs for creating essential networking components and a bastion host in Amazon Web Services (AWS) environments. These constructs simplify the provisioning process, allowing developers to define their infrastructure as code using familiar programming languages.

## Constructs Included:

**Network Construct**: Creates a VPC with public and private subnets, internet gateway, NAT gateway, and route tables.

**Bastion Host Construct**: Sets up a bastion host (EC2 instance) with SSH access control and Elastic IP association.

## Prerequisites

Before using these constructs, ensure you have the following prerequisites:

- AWS CDK installed globally (npm install -g aws-cdk)
- AWS CLI configured with appropriate credentials and default region
- Basic understanding of AWS services and CDK concepts

## Installation

To include these constructs in your AWS CDK project, follow these steps:

1. Install Dependencies: Ensure that your project's package.json file includes the necessary dependencies for AWS CDK and AWS SDK. You can install them using npm install aws-cdk aws-sdk.

2. Copy Constructs: Copy the source code of the NetworkConstruct and BastionConstruct classes into your project's directory structure.

3. Import Constructs: Import the constructs into your CDK stack file using the appropriate relative paths.

## Constructs Usage

#### 1. Network Construct

Features:

- Creates a VPC with specified CIDR block.
- Configures public and private subnets across multiple availability zones.
  Attaches an internet gateway for outbound internet access.
- Sets up NAT gateway for private subnet outbound traffic.
- Manages route tables for effective routing within the VPC.

Example:

```typescript
import { Stack, App } from "aws-cdk-lib";
import { NetworkConstruct } from "./path/to/network-construct";

const app = new App();
const stack = new Stack(app, "MyNetworkStack");

new NetworkConstruct(stack, "MyNetwork", {
  VpcCidrBlock: "10.0.0.0/16",
  PublicSubnets: [
    { zone: "us-east-1a", range: "10.0.1.0/24" },
    { zone: "us-east-1b", range: "10.0.2.0/24" },
  ],
  PrivateSubnets: [
    { zone: "us-east-1a", range: "10.0.11.0/24" },
    { zone: "us-east-1b", range: "10.0.12.0/24" },
  ],
});
```

#### 2. Bastion Host Construct

Features:

- Creates an EC2 instance configured as a bastion host.
- Configures security groups to allow SSH access from specified IP addresses.
  Associates an Elastic IP address for static public IP access.
- Exposes the bastion host's public IP address as a CDK output.

Example:

```typescript
import { Stack, App } from "aws-cdk-lib";
import { BastionConstruct } from "./path/to/bastion-construct";
import { Vpc } from "aws-cdk-lib/aws-ec2";

const app = new App();
const stack = new Stack(app, "MyBastionStack");

const vpc = Vpc.fromLookup(stack, "VPC", {
  isDefault: true,
});

new BastionConstruct(stack, "MyBastion", {
  vpc: vpc,
  ec2Name: "MyBastionInstance",
  publicSubnets: { subnets: [] },
  sshPort: "22",
});
```

## Running Tests

To run the tests for this project, execute the following command:

```bash
npm run test
```

#### Test Cases

This project includes two test cases to ensure the correctness of the infrastructure components:

1. **VPC Creation Test**: Verifies that the VPC is created correctly with the specified CIDR block.
2. **Bastion Host EC2 Creation Test**: Validates that the EC2 instance for the bastion host is created successfully, checking for the correct Availability Zone and Instance Type.

Make sure to review the test cases and adjust them according to any modifications made to the constructs or infrastructure configuration. Additionally, consider expanding the test suite to cover more scenarios and edge cases as needed.

## Dependencies

- AWS CDK v2.x.x
- aws-cdk-lib v2.x.x

## License

This project is licensed under the MIT License.

## Contributing

Contributions to this project are welcome! If you encounter any issues or have suggestions for improvements, please feel free to open an issue or submit a pull request on the project's repository.

## Resources

- AWS CDK Documentation
- AWS CDK GitHub Repository
- AWS SDK for JavaScript Documentation

---

Note: Ensure that you review and modify the constructs according to your specific requirements and security best practices before deploying them to production environments.
