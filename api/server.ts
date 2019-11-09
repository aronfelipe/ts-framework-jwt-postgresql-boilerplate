
require("source-map-support").install();
require("reflect-metadata");

// Initialize new relic if enabled
if (process.env.NEW_RELIC_KEY) {
  require("newrelic");
}

import * as express from "express";
import Server, { ServerOptions } from "ts-framework";
import { ServerConfig } from "../config";
import MainDatabase from "./database";
import * as helmet from "helmet";
import * as cors from "cors";

// Prepare the database instance as soon as possible to prevent clashes in
// model registration. We can connect to the real database later.
MainDatabase.getInstance();

export interface MainServerOptions extends ServerOptions {
  port: number;
  smtp?: {
    from: string;
    connectionUrl?: string;
  };
  newrelic?: string;
}

export default class MainServer extends Server {
  public options: MainServerOptions;

  constructor(options: MainServerOptions, app: express.Application = express()) {
    const { children = [], router = {}, ...otherOptions } = options;

    // Setup priority routes, before controller router
    app.get("/", (req, res) => res.redirect("/status"));

    app.use(cors());
    app.use(helmet());
      
    // Initialize the base service with the configurations
    super(
      {
        children: [MainDatabase.getInstance(), ...children],
        router: {
          ...router,
          controllers: require("./controllers").default
        },
        ...ServerConfig,
        ...otherOptions
      } as ServerOptions,
      app
    );
  }

  /**
   * Handles the after-startup routines
   */
  async onReady() {
    await super.onReady();
  }
}