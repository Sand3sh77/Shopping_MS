import express, { Request, Response } from 'express';

const app = express();

app.use(express.json());

app.use("/", (req: Request, res: Response) => {
    return res.status(200).json({ message: "Shopping Service is up and running!" });
})

app.listen(8003, () => {
    console.log("Shopping Service is running on port 8003");
});
