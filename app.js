import dbConnect from "./config/database.mjs";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors);
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

let database;
async function MongoConnect() {
    try{
        const client =  await dbConnect();
        database = client.db('todotest');
        console.log('DB connected');
    } catch(error) {
        console.log(error);
    }
}
MongoConnect();

async function createTodoCollection(client) {
    const database = client.db(process.env.DB_NAME); 
    await database.createCollection('todos');
    console.log('Todo collection created');
}

app.get('/', (req, res) => {});

app.post('/', (req, res) => {});

app.put('/:id', (req, res) => {});

app.delete('/:id', (req, res) => {});


app.listen(PORT);