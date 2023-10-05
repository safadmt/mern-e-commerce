import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import path, {dirname} from 'path'
import { fileURLToPath } from 'url';
const app = express();

import adminRouter from './router/admin.js';
import userRouter from './router/user.js';
import { errorMiddleware } from './middleware/error.mdiddleware.js';

const currenFilePath = fileURLToPath(import.meta.url);
const __dirname = dirname(currenFilePath);

app.use(express.static(path.join(__dirname + '/public')));

app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", 'stackpath.bootstrapcdn.com'],
        scriptSrc: ["'self'", 'js.stripe.com'],
    }
}))
app.use(cors({origin: 'http://localhost:3000', credentials: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL)
.then(()=> {
    console.log("Database connected");
})
.catch(err=> {
    next
})

app.use('/admin', adminRouter);
app.use('/user', userRouter);

app.get('*', (req, res) => {
    res.status(404).send('Page Not Found');
  });


app.use(errorMiddleware);

app.listen(PORT, err=> err ? console.log(err) : console.log(`Server connected to ${PORT}`));


