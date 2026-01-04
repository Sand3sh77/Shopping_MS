import { Application } from "express";
import bodyParser from 'body-parser';

export default async (app: Application) => {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    return app;
}
