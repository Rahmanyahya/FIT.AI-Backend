import Express from "express";
import cors from "cors";
import helmet from "helmet";
import { ErrorMiddleware } from "./Error/Error.middleware";
import { Router } from "./router/router";
import { GlobalEnv } from "./helper/GlobalEnv";

// Create Express app
export const App = Express();

// Aplly configuration
App.use(Express.json());

// Enable CORS
App.use(cors({ origin: "*" }));

// ly Helmet for security
App.use(helmet());

// Aplly Router
App.use(Router);

// Aplly Error Mindleware
App.use(ErrorMiddleware);

// Initial
export const server = App.listen(GlobalEnv.PORT, () => {
  console.log(`Server is running on port ${GlobalEnv.PORT}`);
});

export default server

