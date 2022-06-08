import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cognito from 'aws-cdk-lib/aws-cognito';

export class WkCognitoInfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const userPool = new cognito.UserPool(this, 'wouterkroeze', {
      userPoolName: 'wouterkroeze',
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireSymbols: true,
        requireDigits: true,
      }
    });

    const frontendAppClient = new cognito.UserPoolClient(this, 'frontendAppClient', {
      userPool: userPool,
    });
  }
}``