import * as express from "express";
import * as bodyParser from "body-parser";
import * as morgan from "morgan";
import * as dotenv from "dotenv";
import { startP2PServer, connectToPeers } from "./p2p";
import { getBlockchain, createNewBlock } from "./blockchain";
import { Server } from "http";

dotenv.config();

const PORT: number = parseInt(process.env.HTTP_PORT) || 3000;

const app = express();

app.use(bodyParser.json());
app.use(morgan("combined"));

app.get("/blocks", (req: express.Request, res: express.Response) => {
  res.send(getBlockchain());
});

app.post("/blocks", (req: express.Request, res: express.Response) => {
  const {
    body: { data }
  } = req;
  const newBlock = createNewBlock(data);
  res.send(newBlock);
});

app.post("/peers", (req: express.Request, res: express.Response) => {
  const {
    body: { peer }
  } = req;
  connectToPeers(peer);
});

const server: Server = app.listen(PORT, () =>
  console.log(`✔ Citycoin Server running on ${PORT}`)
);
startP2PServer(server);
