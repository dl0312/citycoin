import * as WebSockets from "ws";
import { Server as HTTH_Server } from "http";
import { Server as HTTHS_Server } from "https";
import { Socket } from "net";
import { getLatestBlock, Block } from "./blockchain";

const sockets: unknown[] = [];

// Message Types
const GET_LATEST = "GET_LATEST";
const GET_ALL = "GET_ALL";
const BLOCKCHAIN_RESPONSE = "BLOCKCHAIN_RESPONSE";

// Message Creators
const getLatest = () => {
  return {
    type: GET_LATEST,
    data: null
  };
};

const getAll = () => {
  return {
    type: GET_ALL,
    data: null
  };
};

const blockchainResponse = (data: unknown) => {
  return {
    type: BLOCKCHAIN_RESPONSE,
    data
  };
};

const getSockets = () => sockets;

const startP2PServer = (server: HTTH_Server | HTTHS_Server) => {
  const wsServer = new WebSockets.Server({ server });
  wsServer.on("connection", ws => {
    initSocketConnection(ws);
  });
  console.log("🕸️ Citycoin P2P Server Running!");
};

const initSocketConnection = (ws: WebSockets) => {
  sockets.push(ws);
  handleSocketMessages(ws);
  handleSocketError(ws);
  sendMessage(ws, getLatest());
};

const parseData = (data: string) => {
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error(error);
    return null;
  }
};

const handleSocketMessages = (ws: WebSockets) => {
  ws.on("message", (data: string) => {
    const message = parseData(data);
    if (message === null) {
      return;
    }
    console.log(message);
    switch (message.type) {
      case GET_LATEST:
        sendMessage(ws, getLatestBlock());
        break;
      case GET_LATEST:
        break;
      case GET_LATEST:
        break;
      default:
        break;
    }
  });
};

const sendMessage = (ws: WebSockets, message: object) =>
  ws.send(JSON.stringify(message));

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
