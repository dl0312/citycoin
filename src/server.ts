import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import * as dotenv from 'dotenv';
import { getBlockchain, createNewBlock } from './blockchain';

dotenv.config();

const PORT: string = process.env.PORT;

const app = express();

app.use(bodyParser.json());
app.use(morgan('combined'));

app.get('/blocks', (req: express.Request, res: express.Response) => {
  res.send(getBlockchain());
});

app.post('/blocks', (req: express.Request, res: express.Response) => {
  const {
    body: { data }
  } = req;
  const newBlock = createNewBlock(data);
  res.send(newBlock);
});

app.listen(PORT, () => console.log(`✔ Citycoin Server running on ${PORT}`));
