import dbConnect from "../config/database.mjs";
import { ObjectId } from "mongodb";
import Todo from "../models/todoSchema.mjs";


const collectionName = 'todos';

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


const addTodo = async (req, res) => {
    try{
        const { title, description, dueDate, priority, status, tags } = req.body;
        const newTodo = new Todo(title, description, dueDate, priority, status, tags);
        console.log(req.body)
        const todoWithId = { ...newTodo, _id: new ObjectId() };
        const result = await database.collection(collectionName).insertOne(todoWithId);
        res.status(201).json(result);
    } catch(error) {
        console.error(error);
        res.status(500).json({error: 'Failed to create todo'})
    }
}

const getAllTodos = async (req, res) => {
    try{
        const todos = await database.collection(collectionName).find().toArray();
        res.status(201).json(todos)
    } catch(error) {
        console.error(error);
        res.status(500).json({error: 'Failed to get todo'})
    }
}

const getTodoById = async (req, res) => {
    
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid Todo ID' });
    }

    const todo = await database.collection(collectionName).findOne({ _id: new ObjectId(id) });
    if (!todo) {
        return res.status(404).json({ error: 'Todo not found' });
    }

    res.status(201).json(todo);
}

const updateTodoById = async (req, res) => {
    const id = req.params.id;
    if(!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid Todo ID'});
    }

    const todo = await database.collection(collectionName).findOne({ _id: new ObjectId(id) });
    if (!todo) {
        return res.status(404).json({ error: 'Todo not found' });
    }

    const updatedTodo = req.body;
    await database.collection(collectionName).updateOne({ _id: new ObjectId(id) }, { $set: updatedTodo });

    const updatedTodoFromDB = await database.collection(collectionName).findOne({ _id: new ObjectId(id) });

    res.status(200).json(updatedTodoFromDB);
}

const deleteTodoById = async (req, res) => {

}

const markTodoCompleted = async (req, res) => {

}

const getAllCompletedTodos = async (req, res) => {

}

const getAllPendingTodos = async (req, res) => {

}

export {
    addTodo,
    getAllTodos,
    getTodoById,
    updateTodoById,
    deleteTodoById,
    markTodoCompleted,
    getAllCompletedTodos,
    getAllPendingTodos
}