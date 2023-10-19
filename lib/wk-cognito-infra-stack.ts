import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as cdk from "aws-cdk-lib";
import { callbackify } from "util";
import { OAuthScope } from "aws-cdk-lib/aws-cognito";

export class WkCognitoInfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const userPool = new cognito.UserPool(this, "wouterkroeze", {
      userPoolName: "wouterkroeze",
      selfSignUpEnabled: true,
      signInAliases: {
        email: true
      },
      autoVerify: {
        email: true
      },
      standardAttributes: {
        email: {
          required: true,
          mutable: true
        }
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireSymbols: true,
        requireDigits: true
      }
    });

    // add a custom domain name, note: you will have to manually do the route53 part
    // TODO: uncomment and provide your cert arn
    // const cognitoDomain = new cognito.CfnUserPoolDomain(this, 'tnc-up-dom', {
    //   domain: 'auth.somedomain.com',
    //   customDomainConfig: {
    //     certificateArn: 'yourcertificate.arn',
    //   },
    //   userPoolId: cognitoUP.ref
    // })

    // TODO: route53 to alias not supported yet

    const frontendAppClient = new cognito.UserPoolClient(this, "frontendAppClient", {
      userPool: userPool,
      userPoolClientName: "frontendAppClient",
      generateSecret: true,
      refreshTokenValidity: cdk.Duration.days(30),
      accessTokenValidity: cdk.Duration.minutes(60),
      idTokenValidity: cdk.Duration.minutes(60),
      authFlows: {
        userPassword: false,
        custom: true,
        adminUserPassword: false,
        userSrp: true
      },
      preventUserExistenceErrors: true,
      enableTokenRevocation: true,
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
          implicitCodeGrant: false,
          clientCredentials: false,
        },
        scopes: [OAuthScope.EMAIL, OAuthScope.OPENID, OAuthScope.PROFILE],
        callbackUrls: [
          "http://localhost:3000/api/auth/callback/cognito",
          "https://apps.wouterkroeze.com/api/auth/callback/cognito"
        ]
      }
    });
  }
}
