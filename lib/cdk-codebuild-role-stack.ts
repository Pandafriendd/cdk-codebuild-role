import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as iam from 'aws-cdk-lib/aws-iam';

export class CdkCodebuildRoleStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const invalidateBuildProject = new codebuild.PipelineProject(this, `InvalidateProject`, {
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          build: {
            commands:[
              'aws cloudfront create-invalidation --distribution-id ${CLOUDFRONT_ID} --paths "/*"',
            ],
          },
        },
      }),
      role: this.createBuildRole('666'),
      grantReportGroupPermissions: false,
    });
  }
  
  createBuildRole = (name: string): iam.IRole => {
    const role = new iam.Role(this, 'testrole6666', {
      assumedBy: new iam.CompositePrincipal(
        new iam.ServicePrincipal('codebuild.amazonaws.com'),
        new iam.ServicePrincipal('codepipeline.amazonaws.com'),
        new iam.ServicePrincipal('cloudformation.amazonaws.com'),
      ),
    });
    role.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        resources: ['*'],
        actions: [
          'eks:*'
        ],
      }),
    );
    return role;
  };
  
  
}
