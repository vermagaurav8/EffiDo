import { addTodo, getAllTodos, getTodoById, updateTodoById, deleteTodoById, markTodoCompleted, getAllPendingTodos, getAllCompletedTodos } from "../../controllers/apiController.mjs";
import express from "express";

const router = express.Router();

router.post('/api/todos', addTodo);
router.get('/api/todos', getAllTodos);

router.get('/api/todos/:id', getTodoById);
router.put('/api/todos/:id', updateTodoById);
router.delete('/api/todos/:id', deleteTodoById);

router.put('/api/todos/:id/completed', markTodoCompleted);

router.get('/api/todos/completed', getAllCompletedTodos);
router.get('/api/todos/pending', getAllPendingTodos);

export default router;