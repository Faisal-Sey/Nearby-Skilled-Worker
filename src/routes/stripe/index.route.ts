import { Router } from 'express';
import { Routes } from '../../interfaces/routes.interface';
import { StripeController } from '../../controllers/stripe';
import bodyParser from 'body-parser';

export class StripeRoutes implements Routes {
  public path = '/stripe/';
  public router = Router();
  public stripe = new StripeController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}webhook`, bodyParser.raw({ type: 'application/json' }), this.stripe.userWebhook);
    this.router.post(`${this.path}create-verification-session`, this.stripe.createSessions);
  }
}
