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

const corsOptionsSubdomain = {
  origin: function (origin, callback) {
    if (!origin) {
      callback(null, true);
      return;
    }

    // Use STORE_CORS from environment variables to define allowed origins
    const allowedDomain = process.env.STORE_CORS; // e.g., "https://*.yourdomain.com"
    const regex = new RegExp(`^https?:\/\/([a-z0-9]+)\.${allowedDomain.replace('.', '\\.')}$`);

    if (regex.test(origin)) {
      // Allow requests from subdomains
      callback(null, true);
    } else {
      // Disallow other origins
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

const corsOptions = {
  origin: process.env.ADMIN_CORS,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

export const config: MiddlewaresConfig = {
  routes: [
    {
      matcher: /\/admin\/[^(auth)].*/,
      middlewares: [cors(corsOptions) , authenticate(), registerLoggedInUser],
    },
    {
      matcher: "/admin/*",
      middlewares: [permissions],
    },
    {
      matcher: "/store/*",
      middlewares: cors(corsOptionsSubdomain),
    },
  ],
};
