import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigw from '@aws-cdk/aws-apigateway';
import * as route53 from '@aws-cdk/aws-route53';
import * as r53targets from '@aws-cdk/aws-route53-targets';
import * as acm from '@aws-cdk/aws-certificatemanager';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3deploy from '@aws-cdk/aws-s3-deployment';



export class HelloCdkStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Route 53
    const domainName = 'paolorechia.de'
    // const certificateArn = 'arn:aws:acm:us-east-1:743396504149:certificate/a773c824-59c8-4ead-9fcc-0c6c619e9296'

    const testCertificateArn = 'arn:aws:acm:us-east-1:743396504149:certificate/f5ada23d-506f-4e7e-9951-f4f3bbd2d437'
    const zone = route53.HostedZone.fromLookup(this, 'MyZone', {
      domainName: domainName
    });

    // const apiZone = new route53.PublicHostedZone(this, 'HostedZone', {
    //   zoneName: apiDomainName
    // });

    // const apiAcmCertificate = new acm.Certificate(this, 'Certificate', {
    //   domainName: apiDomainName,
    //   validation: acm.CertificateValidation.fromDns(apiZone),
    // });


    const certificate = acm.Certificate.fromCertificateArn(this, 'Certificate', testCertificateArn);

    // Lambdas
    const hello = new lambda.Function(this, 'HelloHandler', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'hello.handler'
    })

    // Api Gateway
    const api = new apigw.RestApi(this, 'Endpoint', {
      domainName: {
        domainName: "test." + domainName,
        certificate: certificate
      }
    })

    const integration = new apigw.LambdaIntegration(hello);

    const v1 = api.root.addResource("v1")
    const helloResource = v1.addResource("hello")

    const helloMethod = helloResource.addMethod('GET', integration, { apiKeyRequired: true })

    const key = api.addApiKey('ApiKey', {
      apiKeyName: 'myApiKey1',
      value: 'MyApiKeyThatIsAtLeast20Characters',
    });

    const plan = api.addUsagePlan('UsagePlan', {
      name: 'Easy',
      apiKey: key,
      throttle: {
        rateLimit: 10,
        burstLimit: 2
      }
    });

    plan.addApiStage({
      stage: api.deploymentStage,
      throttle: [
        {
          method: helloMethod,
          throttle: {
            rateLimit: 10,
            burstLimit: 2
          }
        }
      ]
    });


    const aRecord = new route53.ARecord(this, 'AliasRecord', {
      zone: zone,
      recordName: "test",
      target: route53.RecordTarget.fromAlias(new r53targets.ApiGateway(api)),
    });


    const websiteBucket = new s3.Bucket(this, 'WebsiteBucket', {
      websiteIndexDocument: 'index.html',
      publicReadAccess: true,
      bucketName: "dev-kanban-test"
    });

    new s3deploy.BucketDeployment(this, 'DeployWebsite', {
      sources: [s3deploy.Source.asset('../frontend/build')],
      destinationBucket: websiteBucket,
    })
  }
}
