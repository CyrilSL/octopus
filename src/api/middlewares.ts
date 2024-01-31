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
    next()
    return
  }
  // retrieve currently logged-in user
  const userService = req.scope.resolve(
    "userService"
  ) as UserService
  const loggedInUser = await userService.retrieve(
    req.user.userId,
    {
      select: ["id"],
      relations: ["teamRole", "teamRole.permissions"],
    })

  if (!loggedInUser.teamRole) {
    // considered as super user
    next()
    return
  }

  const isAllowed = loggedInUser.teamRole?.permissions.some(
    (permission) => {
      const metadataKey = Object.keys(permission.metadata).find(
        (key) => key === req.path
      )
      if (!metadataKey) {
        return false
      }
  
      // boolean value
      return permission.metadata[metadataKey]
    }
  )

  if (isAllowed) {
    next()
    return
  }

  // deny access
  res.sendStatus(401)
}


const corsOptions = {
  origin: 'http://localhost:7001',
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
