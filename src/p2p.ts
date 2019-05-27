import * as WebSockets from "ws";
import { Server as HTTH_Server } from "http";
import { Server as HTTHS_Server } from "https";

const sockets = [];

const startP2PServer = (server: HTTH_Server | HTTHS_Server) => {
  const wsServer = new WebSockets.Server({ server });
  wsServer.on("connection", ws => {
    console.log(`Hello! ${ws}`);
  });
  console.log("🕸️ Citycoin P2P Server Running!");
};

export { startP2PServer };
