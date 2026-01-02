import express, { Request, Response } from 'express';

const app = express();

app.use(express.json());

app.use("/", (req: Request, res: Response) => {
    return res.status(200).json({ message: "Product Service is up and running!" });
})

app.listen(8002, () => {
    console.log("Product Service is running on port 8002");
});
