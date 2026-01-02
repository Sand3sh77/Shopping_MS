import express from 'express';
import dotenv from "dotenv";
import { connectDb, ExpressApp } from './services';

dotenv.config();

const StartServer = async () => {
    const app = express();

    await connectDb();

    await ExpressApp(app);

    const port = process.env.PORT;

    app.listen(port, () => {
        console.clear();
        console.log("App is listening to the port", port);
    });
}

StartServer();
