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
        if(title) {
            const newTodo = new Todo(title, description, dueDate, priority, status, tags);
            const todoWithId = { ...newTodo, _id: new ObjectId() };
            const result = await database.collection(collectionName).insertOne(todoWithId);
            res.status(201).json(result);
        } else {
            res.status(401).json({ message: "Title is required"});
        }
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

// Getting, updating, deleting todos by Id

const validateTodoId = async (id) => {
    if (!ObjectId.isValid(id)) {
        throw new Error('Invalid Todo id');
    }
  
    const todo = await database.collection(collectionName).findOne({ _id: new ObjectId(id) });
    if (!todo) {
        throw new Error('Todo not found');
    }

    return todo;
};

const getTodoById = async (req, res) => {
    try{
        const id = req.params.id;
        const todo = await validateTodoId(id);
        res.status(201).json(todo);
    } catch(error) {
        res.status(500).json({ error: error.message});
    }
    
}

const updateTodoById = async (req, res) => {
    try{
        const id = req.params.id;
        await validateTodoId(id);
    
        const update = req.body;
        const updatedTodo = {...update, updatedAt: Date.now()}
        await database.collection(collectionName).updateOne({ _id: new ObjectId(id) }, { $set: updatedTodo });
        const updatedTodoFromDB = await database.collection(collectionName).findOne({ _id: new ObjectId(id) });
        res.status(200).json(updatedTodoFromDB);
    } catch(error){
        res.status(500).json({ error: error.message });
    }
}

const deleteTodoById = async (req, res) => {
    try{
        const id = req.params.id;
        await validateTodoId(id);
     
        const result = await database.collection(collectionName).deleteOne({ _id: new ObjectId(id)});
        if (result.deletedCount === 1) {
            res.status(200).json({ msg: 'Todo Deleted Successfully' });
        } else {
            res.status(404).json({ error: 'Todo not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
}


// Get all completed & pending todos
const getAllCompletedTodos = async (req, res) => {
    try {
        const completedTodos = await database.collection(collectionName).find({ status: { $regex: /^completed$/i }}).toArray();
        res.status(200).json(completedTodos);
    } catch (error) {
        console.error('Error getting all completed Todos:', error);
        res.status(500).json({ error: 'Failed to get completed Todos' });
    }
}

const getAllPendingTodos = async (req, res) => {
    try {
        const pendingTodos = await database.collection(collectionName).find({ status: { $regex: /^pending$/i }}).toArray();
        res.status(200).json(pendingTodos);
    } catch (error) {
        console.error('Error getting all completed Todos:', error);
        res.status(500).json({ error: 'Failed to get completed Todos' });
    }
}

export {
    addTodo,
    getAllTodos,
    getTodoById,
    updateTodoById,
    deleteTodoById,
    getAllCompletedTodos,
    getAllPendingTodos
}