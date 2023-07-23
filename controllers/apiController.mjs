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

// Getting, updating, deleting todos by Id

const validateTodoId = async (id, res) => {
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Todo ID' });
    }
  
    const todo = await database.collection(collectionName).findOne({ _id: new ObjectId(id) });
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
  
    return todo;
};

const getTodoById = async (req, res) => {
    try{
        const id = req.params.id;
        const todo = await validateTodoId(id, res);
        res.status(201).json(todo);
    } catch(error) {
        res.status(500).json(error);
    }
    
}

const updateTodoById = async (req, res) => {
    try{
        const id = req.params.id;
        await validateTodoId(id, res);
    
        const update = req.body;
        const updatedTodo = {...update, updatedAt: Date.now()}
        await database.collection(collectionName).updateOne({ _id: new ObjectId(id) }, { $set: updatedTodo });
        const updatedTodoFromDB = await database.collection(collectionName).findOne({ _id: new ObjectId(id) });
        res.status(200).json(updatedTodoFromDB);
    } catch(error){
        res.status(500).json(error);
    }
}

const deleteTodoById = async (req, res) => {
    try{
        const id = req.params.id;
        await validateTodoId(id, res);
    
        const result = await database.collection(collectionName).deleteOne({ _id: new ObjectId(id)});
        if(result.deletedCount == 1){
            res.status(200).json({ msg: "Todo Deleted Successfully" });
        } else {
            res.status(404).json({ msg: "Todo Not found" });
        }
    } catch (error) {
        res.status(500).json(error);
    }
}

// const markTodoCompleted = async (req, res) => {

// }

const getAllCompletedTodos = async (req, res) => {
    try{

    } catch(error) {
        res.status(500).json(error)
    }
}

const getAllPendingTodos = async (req, res) => {
    try{

    } catch(error) {
        res.status(500).json(error);
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