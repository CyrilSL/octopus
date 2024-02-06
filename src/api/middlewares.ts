import {
  authenticate,
  type MedusaNextFunction,
  type MedusaRequest,
  type MedusaResponse,
  type MiddlewaresConfig,
  type UserService,
} from '@medusajs/medusa';
import cors from 'cors';
import { User } from 'src/models/user';

const registerLoggedInUser = async (req: MedusaRequest, res: MedusaResponse, next: MedusaNextFunction) => {
  let loggedInUser: User | null = null;

  if (req.user && req.user.userId) {
    const userService = req.scope.resolve('userService') as UserService;
    loggedInUser = await userService.retrieve(req.user.userId);
  }

  req.scope.register({
    loggedInUser: {
      resolve: () => loggedInUser,
    },
  });

  next();
};

export const permissions = async (
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) => {
  if (!req.user || !req.user.userId) {
    next();
    return;
  }
  // retrieve currently logged-in user
  const userService = req.scope.resolve("userService") as UserService;
  const loggedInUser = await userService.retrieve(req.user.userId, {
    select: ["id"],
    relations: ["teamRole", "teamRole.permissions"],
  });

  if (!loggedInUser.teamRole) {
    // considered as super user
    next();
    return;
  }

  const isAllowed = loggedInUser.teamRole.permissions.some((permission) => {
    // Find if there's a permission for the current path
    const permissionForRoute = permission.metadata[req.path];
    if (!permissionForRoute) {
      return false;
    }

    // If permissionForRoute.allowed_methods exists, check if the current method is allowed
    if (typeof permissionForRoute === 'object' && permissionForRoute.allowed_methods) {
      return permissionForRoute.allowed_methods.includes(req.method);
    }

    // Fallback to checking boolean value if not structured with allowed_methods
    return Boolean(permissionForRoute);
  });

  if (isAllowed) {
    next();
    return;
  }

  // deny access
  res.sendStatus(401);
};



const corsOptions = {
  origin: process.env.MEDUSA_ADMIN_BACKEND_URL || 'http://localhost:7001' || process.env.STORE_CORS,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

export const config: MiddlewaresConfig = {
  routes: [
    {
      matcher: /\/admin\/[^(auth)].*/,
      middlewares: [cors(corsOptions), authenticate(), registerLoggedInUser],
    },
    {
      matcher: "/admin/*",
      middlewares: [permissions],
    },
  ],
};
