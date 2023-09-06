
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GithubLoginService } from '../githubUser/githubUser.service';
import { GithubUserOrganizationService } from '../organizations/organization.service';
import { AppWebhook, AppWebhookDocument } from './webhook.dto';
import { GitHubUserOrganization } from 'src/organizations/organization.schema'; // Import your organization model
import { Response } from 'express';
import * as crypto from 'crypto';
import { HttpStatus } from '@nestjs/common/enums';

@Injectable()
export class WebhookEventService {
  constructor(
    @InjectModel(AppWebhook.name) private readonly gitHubAppWebhookModel: Model<AppWebhookDocument>,
    private readonly githubLoginService: GithubLoginService,
    private readonly githubUserOrganizationService: GithubUserOrganizationService,
    @InjectModel(GitHubUserOrganization.name) private readonly gitHubUserOrganizationModel: Model<GitHubUserOrganization>,
  ) {}

  async getOrganizationIdByName(organizationName: string): Promise<string | null> {
    const organization = await this.gitHubUserOrganizationModel.findOne({ org_name: organizationName });

    if (organization) {
      return organization.id.toString();
    } else {
      return null;
    }
  }


  async handleEventUpdate(
    installation: any,
    action: string,
    username: string,
    userId: string,
    appType: string,
    AppEventMetadata: object,
    organizationName: string,
    res: Response
  ): Promise<void> {
    try {
      const userIdDetails = await this.githubLoginService.getGithubUserDetails("Vanshiljain");
      console.log("USERDETAILS:- ", userIdDetails);

      let orgid = null;

      if (appType === 'organization') {
        orgid = await this.getOrganizationIdByName(organizationName);
        if (orgid) {
          console.log(`Organization ID for ${organizationName}: ${orgid}`);
        } else {
          console.log(`Organization ${organizationName} not found.`);
        }
      }

      const installationId = installation.id;

      let webhookModel;
      if (appType === 'User' || appType === 'organization') {
        webhookModel = this.gitHubAppWebhookModel;
      } else {
        console.log(`Unsupported app type: ${appType}`);
        return;
      }

      const existingEvent = await webhookModel.findOneAndUpdate(
        {
          installationId,
          appType,
          action: { $ne: action }, 
        },
        {
          action,
          username,
          userId: userIdDetails,
          orgid: orgid,
          appType,
          AppEventMetadata
        },
        { upsert: true, new: true } 
      );

      if (existingEvent) {
        console.log(`${action} event updated in the database.`);
      } else {
        console.log(`${action} event created and saved to the database.`);
      }

    } catch (error) {
      console.error(`Error handling ${action} event:`, error);
      res.status(500).send('An error occurred while processing the webhook request.');
    }
  }

  async handleGitHubAppEvent(
    installation: any,
    action: string,
    username: string,
    userId: string,
    eventMetadata: object,
    res: Response
  ): Promise<void> {
    try {
      const appType = 'organization'; 
      const organizationName = installation.account.login; 

      await this.handleEventUpdate(
        installation,
        action,
        username,
        userId,
        appType,
        eventMetadata,
        organizationName,
        res
      );

      console.log(`${action} event saved or updated in the database.`);
    } catch (error) {
      console.error(`Error handling ${action} event:`, error);
      res.status(500).send('An error occurred while processing the webhook request.');
    }
  }

  async handleWebhookEvent(payload: any, signature: string, req: Request, res: Response): Promise<void> {
    try {
      const { installation, action } = payload;

      if (installation?.account) {
        const receivedSignature = req.headers['x-hub-signature-256'];
        console.log( "256---------",receivedSignature)

        const isValid = this.isValidRequest(receivedSignature,  JSON.stringify(payload));

        if (!isValid) {
          console.log('Invalid webhook request signature.');
          const successMessage = 'Invalid webhook request signature.';
          res.status(HttpStatus.BAD_REQUEST).json({ message: successMessage });
          return;
        }

        const username = installation.account.login;
        const userId = installation.account.id;
        const appType = installation.account.type;
        const eventMetadata = payload;

        if (appType.toLowerCase() === 'user') {
          await this.handleGitHubAppEvent(
            installation,
            action,
            username,
            userId,
            eventMetadata,
            res
          );
        } else if (appType.toLowerCase() === 'organization') {
          await this.handleOrganizationAppEvent(
            installation,
            action,
            username,
            userId,
            eventMetadata,
            res
          );
        } else {
          console.log(`Unsupported app type: ${appType}`);
          const successMessage = 'Invalid webhook request.';
               res.status(400).json({ message: successMessage });
        }
        const successMessage = 'Webhook event processed successfully.';
        res.status(200).json({ message: successMessage });
      } else {
        console.log('Payload is missing required properties for processing.');
        const errorMessage = 'Payload is missing required properties.';
        res.status(400).json({ message: errorMessage });
      }
    } catch (error) {
      console.error('Error handling webhook event:', error);
      const successMessage = 'An error occurred while processing the webhook request.';
        res.status(500).json({ message: successMessage });
    }
  }

  async handleOrganizationAppEvent(
    installation: any,
    action: string,
    username: string,
    userId: string,
    eventMetadata: object,
    res: Response
  ): Promise<void> {
    try {
      const appType = 'organization';
      const organizationName = installation.account.login; 

      await this.handleEventUpdate(
        installation,
        action,
        username,
        userId,
        appType,
        eventMetadata,
        organizationName,
        res
      );

      console.log(`${action} event saved or updated in the database.`);
    } catch (error) {
      console.error(`Error handling ${action} event:`, error);
      const successMessage = 'An error occurred while processing the webhook request.';
      res.status(500).json({ message: successMessage });
      
    }
  }

  async isValidRequest(receivedSignature: string, body: string): Promise<boolean> {
    const secret = process.env.WEBHOOK_SECRET;
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(body);
    const calculatedSignature = `sha256=${hmac.digest('hex')}`;
    return receivedSignature === calculatedSignature;
  }
  
  
  generateWebhookSecret(length: number): string {
    return crypto.randomBytes(length).toString('hex');
  }
}

