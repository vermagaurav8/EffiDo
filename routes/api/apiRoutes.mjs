import { addTodo, getAllTodos, getTodoById, updateTodoById, deleteTodoById, getAllPendingTodos, getAllCompletedTodos } from "../../controllers/apiController.mjs";
import express from "express";

const router = express.Router();

router.post('/api/todos', addTodo);
router.get('/api/todos', getAllTodos);

router.get('/api/todos/:id', getTodoById);
router.put('/api/todos/:id', updateTodoById);
router.delete('/api/todos/:id', deleteTodoById);

router.get('/api/todos/all/completed', getAllCompletedTodos);
router.get('/api/todos/all/pending', getAllPendingTodos);

export default router;