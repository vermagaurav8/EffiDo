import router from "./routes/api/apiRoutes.mjs";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use('/', router);

app.listen(PORT);