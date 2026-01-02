import express from 'express';
import proxy from 'express-http-proxy';

const app = express();

app.use(express.json());

app.use("/customer", proxy("http://localhost:8001"));
app.use("/shopping", proxy("http://localhost:8003"));
app.use("/", proxy("http://localhost:8002")); //Default route to product service

app.listen(8000, () => {
    console.log("Gateway is running on port 8000");
});
