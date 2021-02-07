"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelloCdkStack = void 0;
const cdk = require("@aws-cdk/core");
const lambda = require("@aws-cdk/aws-lambda");
const apigw = require("@aws-cdk/aws-apigateway");
const route53 = require("@aws-cdk/aws-route53");
const r53targets = require("@aws-cdk/aws-route53-targets");
const acm = require("@aws-cdk/aws-certificatemanager");
class HelloCdkStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // Route 53
        const apiDomainName = 'devapi.paolorechia.de';
        const certificateArn = 'arn:aws:acm:us-east-1:743396504149:certificate/a773c824-59c8-4ead-9fcc-0c6c619e9296';
        // const apiZone = route53.HostedZone.fromLookup(this, 'MyZone', {
        //   domainName: 'dev-api.paolorechia.de'
        // });
        const apiZone = new route53.PublicHostedZone(this, 'HostedZone', {
            zoneName: apiDomainName
        });
        // const apiAcmCertificate = new acm.Certificate(this, 'Certificate', {
        //   domainName: apiDomainName,
        //   validation: acm.CertificateValidation.fromDns(apiZone),
        // });
        const certificate = acm.Certificate.fromCertificateArn(this, 'Certificate', certificateArn);
        // Lambdas
        const hello = new lambda.Function(this, 'HelloHandler', {
            runtime: lambda.Runtime.NODEJS_12_X,
            code: lambda.Code.fromAsset('lambda'),
            handler: 'hello.handler'
        });
        // Api Gateway
        const api = new apigw.RestApi(this, 'Endpoint', {
            domainName: {
                domainName: apiDomainName,
                certificate: certificate,
            },
        });
        const integration = new apigw.LambdaIntegration(hello);
        const v1 = api.root.addResource("v1");
        const helloResource = v1.addResource("hello");
        const helloMethod = helloResource.addMethod('GET', integration, { apiKeyRequired: true });
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
            zone: apiZone,
            target: route53.RecordTarget.fromAlias(new r53targets.ApiGateway(api)),
        });
    }
}
exports.HelloCdkStack = HelloCdkStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVsbG8tY2RrLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaGVsbG8tY2RrLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFDQUFxQztBQUNyQyw4Q0FBOEM7QUFDOUMsaURBQWlEO0FBQ2pELGdEQUFnRDtBQUNoRCwyREFBMkQ7QUFDM0QsdURBQXVEO0FBSXZELE1BQWEsYUFBYyxTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQzFDLFlBQVksS0FBYyxFQUFFLEVBQVUsRUFBRSxLQUFzQjtRQUM1RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixXQUFXO1FBQ1gsTUFBTSxhQUFhLEdBQUcsdUJBQXVCLENBQUE7UUFDN0MsTUFBTSxjQUFjLEdBQUcscUZBQXFGLENBQUE7UUFFNUcsa0VBQWtFO1FBQ2xFLHlDQUF5QztRQUN6QyxNQUFNO1FBRU4sTUFBTSxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTtZQUMvRCxRQUFRLEVBQUUsYUFBYTtTQUN4QixDQUFDLENBQUM7UUFFSCx1RUFBdUU7UUFDdkUsK0JBQStCO1FBQy9CLDREQUE0RDtRQUM1RCxNQUFNO1FBSU4sTUFBTSxXQUFXLEdBQUcsR0FBRyxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBRTVGLFVBQVU7UUFDVixNQUFNLEtBQUssR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRTtZQUN0RCxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXO1lBQ25DLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUM7WUFDckMsT0FBTyxFQUFFLGVBQWU7U0FDekIsQ0FBQyxDQUFBO1FBRUYsY0FBYztRQUNkLE1BQU0sR0FBRyxHQUFHLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQzlDLFVBQVUsRUFBRTtnQkFDVixVQUFVLEVBQUUsYUFBYTtnQkFDekIsV0FBVyxFQUFFLFdBQVc7YUFDekI7U0FDRixDQUFDLENBQUE7UUFDRixNQUFNLFdBQVcsR0FBRyxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUV2RCxNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUNyQyxNQUFNLGFBQWEsR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBRTdDLE1BQU0sV0FBVyxHQUFHLGFBQWEsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRSxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFBO1FBRXpGLE1BQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFO1lBQ2xDLFVBQVUsRUFBRSxXQUFXO1lBQ3ZCLEtBQUssRUFBRSxtQ0FBbUM7U0FDM0MsQ0FBQyxDQUFDO1FBRUgsTUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUU7WUFDekMsSUFBSSxFQUFFLE1BQU07WUFDWixNQUFNLEVBQUUsR0FBRztZQUNYLFFBQVEsRUFBRTtnQkFDUixTQUFTLEVBQUUsRUFBRTtnQkFDYixVQUFVLEVBQUUsQ0FBQzthQUNkO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLFdBQVcsQ0FBQztZQUNmLEtBQUssRUFBRSxHQUFHLENBQUMsZUFBZTtZQUMxQixRQUFRLEVBQUU7Z0JBQ1I7b0JBQ0UsTUFBTSxFQUFFLFdBQVc7b0JBQ25CLFFBQVEsRUFBRTt3QkFDUixTQUFTLEVBQUUsRUFBRTt3QkFDYixVQUFVLEVBQUUsQ0FBQztxQkFDZDtpQkFDRjthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsTUFBTSxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxhQUFhLEVBQUU7WUFDdkQsSUFBSSxFQUFFLE9BQU87WUFDYixNQUFNLEVBQUUsT0FBTyxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsSUFBSSxVQUFVLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3ZFLENBQUMsQ0FBQztJQUdMLENBQUM7Q0FDRjtBQWhGRCxzQ0FnRkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnQGF3cy1jZGsvYXdzLWxhbWJkYSc7XG5pbXBvcnQgKiBhcyBhcGlndyBmcm9tICdAYXdzLWNkay9hd3MtYXBpZ2F0ZXdheSc7XG5pbXBvcnQgKiBhcyByb3V0ZTUzIGZyb20gJ0Bhd3MtY2RrL2F3cy1yb3V0ZTUzJztcbmltcG9ydCAqIGFzIHI1M3RhcmdldHMgZnJvbSAnQGF3cy1jZGsvYXdzLXJvdXRlNTMtdGFyZ2V0cyc7XG5pbXBvcnQgKiBhcyBhY20gZnJvbSAnQGF3cy1jZGsvYXdzLWNlcnRpZmljYXRlbWFuYWdlcic7XG5cblxuXG5leHBvcnQgY2xhc3MgSGVsbG9DZGtTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQXBwLCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICAvLyBSb3V0ZSA1M1xuICAgIGNvbnN0IGFwaURvbWFpbk5hbWUgPSAnZGV2YXBpLnBhb2xvcmVjaGlhLmRlJ1xuICAgIGNvbnN0IGNlcnRpZmljYXRlQXJuID0gJ2Fybjphd3M6YWNtOnVzLWVhc3QtMTo3NDMzOTY1MDQxNDk6Y2VydGlmaWNhdGUvYTc3M2M4MjQtNTljOC00ZWFkLTlmY2MtMGM2YzYxOWU5Mjk2J1xuXG4gICAgLy8gY29uc3QgYXBpWm9uZSA9IHJvdXRlNTMuSG9zdGVkWm9uZS5mcm9tTG9va3VwKHRoaXMsICdNeVpvbmUnLCB7XG4gICAgLy8gICBkb21haW5OYW1lOiAnZGV2LWFwaS5wYW9sb3JlY2hpYS5kZSdcbiAgICAvLyB9KTtcblxuICAgIGNvbnN0IGFwaVpvbmUgPSBuZXcgcm91dGU1My5QdWJsaWNIb3N0ZWRab25lKHRoaXMsICdIb3N0ZWRab25lJywge1xuICAgICAgem9uZU5hbWU6IGFwaURvbWFpbk5hbWVcbiAgICB9KTtcblxuICAgIC8vIGNvbnN0IGFwaUFjbUNlcnRpZmljYXRlID0gbmV3IGFjbS5DZXJ0aWZpY2F0ZSh0aGlzLCAnQ2VydGlmaWNhdGUnLCB7XG4gICAgLy8gICBkb21haW5OYW1lOiBhcGlEb21haW5OYW1lLFxuICAgIC8vICAgdmFsaWRhdGlvbjogYWNtLkNlcnRpZmljYXRlVmFsaWRhdGlvbi5mcm9tRG5zKGFwaVpvbmUpLFxuICAgIC8vIH0pO1xuXG5cblxuICAgIGNvbnN0IGNlcnRpZmljYXRlID0gYWNtLkNlcnRpZmljYXRlLmZyb21DZXJ0aWZpY2F0ZUFybih0aGlzLCAnQ2VydGlmaWNhdGUnLCBjZXJ0aWZpY2F0ZUFybik7XG5cbiAgICAvLyBMYW1iZGFzXG4gICAgY29uc3QgaGVsbG8gPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHRoaXMsICdIZWxsb0hhbmRsZXInLCB7XG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTJfWCxcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldCgnbGFtYmRhJyksXG4gICAgICBoYW5kbGVyOiAnaGVsbG8uaGFuZGxlcidcbiAgICB9KVxuXG4gICAgLy8gQXBpIEdhdGV3YXlcbiAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ3cuUmVzdEFwaSh0aGlzLCAnRW5kcG9pbnQnLCB7XG4gICAgICBkb21haW5OYW1lOiB7XG4gICAgICAgIGRvbWFpbk5hbWU6IGFwaURvbWFpbk5hbWUsXG4gICAgICAgIGNlcnRpZmljYXRlOiBjZXJ0aWZpY2F0ZSxcbiAgICAgIH0sXG4gICAgfSlcbiAgICBjb25zdCBpbnRlZ3JhdGlvbiA9IG5ldyBhcGlndy5MYW1iZGFJbnRlZ3JhdGlvbihoZWxsbyk7XG5cbiAgICBjb25zdCB2MSA9IGFwaS5yb290LmFkZFJlc291cmNlKFwidjFcIilcbiAgICBjb25zdCBoZWxsb1Jlc291cmNlID0gdjEuYWRkUmVzb3VyY2UoXCJoZWxsb1wiKVxuXG4gICAgY29uc3QgaGVsbG9NZXRob2QgPSBoZWxsb1Jlc291cmNlLmFkZE1ldGhvZCgnR0VUJywgaW50ZWdyYXRpb24sIHsgYXBpS2V5UmVxdWlyZWQ6IHRydWUgfSlcblxuICAgIGNvbnN0IGtleSA9IGFwaS5hZGRBcGlLZXkoJ0FwaUtleScsIHtcbiAgICAgIGFwaUtleU5hbWU6ICdteUFwaUtleTEnLFxuICAgICAgdmFsdWU6ICdNeUFwaUtleVRoYXRJc0F0TGVhc3QyMENoYXJhY3RlcnMnLFxuICAgIH0pO1xuXG4gICAgY29uc3QgcGxhbiA9IGFwaS5hZGRVc2FnZVBsYW4oJ1VzYWdlUGxhbicsIHtcbiAgICAgIG5hbWU6ICdFYXN5JyxcbiAgICAgIGFwaUtleToga2V5LFxuICAgICAgdGhyb3R0bGU6IHtcbiAgICAgICAgcmF0ZUxpbWl0OiAxMCxcbiAgICAgICAgYnVyc3RMaW1pdDogMlxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcGxhbi5hZGRBcGlTdGFnZSh7XG4gICAgICBzdGFnZTogYXBpLmRlcGxveW1lbnRTdGFnZSxcbiAgICAgIHRocm90dGxlOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBtZXRob2Q6IGhlbGxvTWV0aG9kLFxuICAgICAgICAgIHRocm90dGxlOiB7XG4gICAgICAgICAgICByYXRlTGltaXQ6IDEwLFxuICAgICAgICAgICAgYnVyc3RMaW1pdDogMlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0pO1xuXG4gICAgY29uc3QgYVJlY29yZCA9IG5ldyByb3V0ZTUzLkFSZWNvcmQodGhpcywgJ0FsaWFzUmVjb3JkJywge1xuICAgICAgem9uZTogYXBpWm9uZSxcbiAgICAgIHRhcmdldDogcm91dGU1My5SZWNvcmRUYXJnZXQuZnJvbUFsaWFzKG5ldyByNTN0YXJnZXRzLkFwaUdhdGV3YXkoYXBpKSksXG4gICAgfSk7XG5cblxuICB9XG59XG4iXX0=