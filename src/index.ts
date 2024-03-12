import express, {Request, Response} from 'express';
import cors from 'cors';
// import {sqlConnection} from './database';

import router from './router';
const app = express();
const port = 3000;

app.use(cors());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

// sqlConnection.connect();
app.use(router);

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
