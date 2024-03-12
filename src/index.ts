import express, {Request, Response} from 'express';
import cors from 'cors';

import router from './router';
const app = express();
const port = 3000;
// 跨域
app.use(cors());

// 解析req.body
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.use(router);

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
