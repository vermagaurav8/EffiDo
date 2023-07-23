class Todo {
    constructor(title, description, dueDate, priority, status, tags) {
        this.title = title,
        this.description = description,
        this.dueDate = dueDate,
        this.priority = priority,
        this.status = status,
        this.tags = tags,
        this.createdAt = Date.now(),
        this.updatedAt = Date.now()
    }
}

export default Todo;