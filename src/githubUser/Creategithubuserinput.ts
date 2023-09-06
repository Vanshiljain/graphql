import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateGitHubUserInput {
    @Field()
    accessToken: string;

    @Field()
    email: string;

    
   
}

