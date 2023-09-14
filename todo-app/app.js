const express = require('express')
const app = express()
const {request, response} = require('express')
const {Todo} = require("./models")
const bodyParser = require('body-parser')
app.use(bodyParser.json());
// const port = 3000
// app.get("/", (req, res) => {
//     res.send("Hello World!")
//     })
// app.listen(port, () => {
//     console.log("started server at port 3000")
// })
app.get("/todo", (request, response) => {D
    console.log("Todo List")
})
app.post("/todo", async (request, response) => {
    console.log("creating a todo", request.body)
    try {
        const todo = await Todo.addTodo({title: request.body.title, dueDate: request.body.dueDate, completed: false})
        console.log(todo,"check3")
        return response.json(todo)

    }   catch(error) {
        console.log(error)
        return response.status(422).json(error)

    }

})  

app.put("/todo/:id/markAsCompleted", async (request, response) => {
    console.log("marking todo with id as completed", request.params.id)
    const todo = await Todo.findByPk(request.params.id)
    try {
    const updatedTodo = await todo.markAsCompleted();
    return response.json(updatedTodo)
    }
    catch(error) {
        console.log(error)
        return response.status(422).json(error)
    }

})

app.delete("/todo/:id", (request, response) => {
    console.log("Delete todo by ID: ", request.params.id)
})
module.exports = app;