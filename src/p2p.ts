import * as WebSockets from "ws";
import { Server as HTTH_Server } from "http";
import { Server as HTTHS_Server } from "https";
import { Socket } from "net";

const sockets: unknown[] = [];

const getSockets = () => sockets;

const startP2PServer = (server: HTTH_Server | HTTHS_Server) => {
  const wsServer = new WebSockets.Server({ server });
  wsServer.on("connection", ws => {
    initSocketConnection(ws);
  });
  console.log("🕸️ Citycoin P2P Server Running!");
};

const initSocketConnection = (socket: WebSockets) => {
  sockets.push(socket);
  handleSocketError(socket);
  socket.on("message", (data: unknown) => {
    console.log(data);
  });
  setTimeout(() => {
    socket.send("welcome");
  }, 5000);
};

const handleSocketError = (ws: WebSockets) => {
  const closeSocketConnection = (ws: WebSockets) => {
    ws.close();
    sockets.splice(sockets.indexOf(ws), 1);
  };
  ws.on("close", () => closeSocketConnection(ws));
  ws.on("error", () => closeSocketConnection(ws));
};

const connectToPeers = (newPeer: string) => {
  const ws = new WebSockets(newPeer);
  ws.on("open", () => {
    initSocketConnection(ws);
  });
};

export { startP2PServer, connectToPeers };
