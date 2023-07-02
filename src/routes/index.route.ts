import { StripeRoutes } from './stripe/index.route';
import { SeekerAuthRoute } from './users/auth.seeker.route';
import { UserRoute } from './users/users.route';

const Routes = [new SeekerAuthRoute(), new UserRoute(), new StripeRoutes()];
export default Routes;
