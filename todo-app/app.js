const express = require("express");
const app = express();
const { Todo } = require("./models");
const bodyParser = require("body-parser");
const path = require("path");
app.use(bodyParser.json());
app.use(express.urlencoded({extended: false}));

// app.get("/", function (request, response) {
//   response.send("Hello World");
// });
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.get("/", async (request, response) => { 
  const allTodos = await Todo.getTodos();   
  const overdue = await Todo.overdue();
  if(request.accepts("html")) {
    response.render("index", { allTodos });
  }
  else {
    response.json({
      allTodos
    })
  }
});

app.get("/todos", async function (_request, response) {
  console.log("Processing list of all Todos ...");
  try {
    const todos = await Todo.findAll();
    return response.json(todos);
  }
  catch (error) {
    console.log(error);
    return response.send(todos)
  }
});

app.get("/todos/:id", async function (request, response) {
  try {
    const todo = await Todo.findByPk(request.params.id);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.post("/todos", async function (request, response) {
  try {
    await Todo.addTodo({
      title: request.body.title,
      dueDate: request.body.dueDate,
    })
    return response.redirect("/");
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id/markAsCompleted", async function (request, response) {
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedTodo = await todo.markAsCompleted();
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.delete("/todos/:id", async function (request, response) {
  console.log("We have to delete a Todo with ID: ", request.params.id);
  // FILL IN YOUR CODE HERE
  // First, we have to query our database to delete a Todo by ID.
  // Then, we have to respond back with true/false based on whether the Todo was deleted or not.
  // response.send(true)
  const delete_todo = await Todo.destroy({ where: { id: request.params.id } });
  // console.log(delete_todo);
  response.send(delete_todo ? true : false);
});

module.exports = app;
