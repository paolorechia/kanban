#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("@aws-cdk/core");
const hello_cdk_stack_1 = require("../lib/hello-cdk-stack");
const app = new cdk.App();
new hello_cdk_stack_1.HelloCdkStack(app, 'HelloCdkStack', {
    env: {
        region: "us-east-1",
        account: "743396504149"
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVsbG8tY2RrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaGVsbG8tY2RrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHFDQUFxQztBQUNyQyw0REFBdUQ7QUFFdkQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDMUIsSUFBSSwrQkFBYSxDQUFDLEdBQUcsRUFBRSxlQUFlLEVBQUU7SUFDcEMsR0FBRyxFQUFFO1FBQ0QsTUFBTSxFQUFFLFdBQVc7UUFDbkIsT0FBTyxFQUFFLGNBQWM7S0FDMUI7Q0FDSixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiBub2RlXG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBIZWxsb0Nka1N0YWNrIH0gZnJvbSAnLi4vbGliL2hlbGxvLWNkay1zdGFjayc7XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5uZXcgSGVsbG9DZGtTdGFjayhhcHAsICdIZWxsb0Nka1N0YWNrJywge1xuICAgIGVudjoge1xuICAgICAgICByZWdpb246IFwidXMtZWFzdC0xXCIsXG4gICAgICAgIGFjY291bnQ6IFwiNzQzMzk2NTA0MTQ5XCJcbiAgICB9XG59KTtcbiJdfQ==