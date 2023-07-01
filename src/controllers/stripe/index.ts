import { ApiResponse } from '@/utils/apiResponses';
import { Request, Response } from 'express';
import { logger } from '@/utils/logger';
import Stripe from 'stripe';
import { Container } from 'typedi';
import { UserService } from '@/services/users.service';

export class StripeController {
  public responses = Container.get(ApiResponse);
  public users = Container.get(UserService);

  //  Initialize stripe
  public stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15',
  });

  //  Function for stripe webhook
  public userWebhook = async (req: Request, res: Response): Promise<Response> => {
    let event: any;

    const endpointSecret: string = process.env.STRIPE_WEBHOOK;
    try {
      const sig = req.headers['stripe-signature'];
      event = this.stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      logger.error(`❌ Error message: ${err.message}`);
      return this.responses.errorResponse(`Webhook Error: ${err.message}`, res);
    }

    if (event.type === 'identity.verification_session.verified') {
      const verificationSession = event.data.object;
      const metadata = verificationSession.metadata;
      const { user_id } = metadata;
      try {
        this.users.updateUserData(user_id, { isVerified: 1 });
        return this.responses.successResponse('Received successfully', res);
      } catch (err) {
        logger.error(err.raw.message);
      }
    }

    return this.responses.errorResponse('An error occured', res);
  };

  public createSessions = async (req: Request, res: Response): Promise<Response> => {
    const { userId, username, name, type } = req.body;
    if (!userId || !name || !username || !type) {
      return this.responses.errorResponse('Please provide the required credentials', res);
    }

    const verificationSession = await this.stripe.identity.verificationSessions.create({
      type: 'document',
      metadata: {
        user_id: userId,
        name,
        username,
        type,
      },
    });

    const clientSecret = verificationSession.client_secret;
    return this.responses.successWithDataResponse({ client_secret: clientSecret }, 'Success', res);
  };
}
