import express from 'express';
import dotenv from "dotenv";
import { connectDB } from './database';
import ExpressApp from './ExpressApp';

dotenv.config();

const StartServer = async () => {
    const app = express();

    await connectDB();

    await ExpressApp(app);

    const port = process.env.PORT;

    app.listen(port, () => {
        console.clear();
        console.log("App is listening to the port", port);
    });
}

StartServer();
