const express = require("express");
const app = express();
const { Todo } = require("./models");
const bodyParser = require("body-parser");
const path = require("path");
const csrf = require("tiny-csrf");
const cookieParser = require("cookie-parser");
app.use(bodyParser.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser("shhhh, very secret"));
app.use(csrf("this_should_be_32_character_long", ["POST", "PUT", "DELETE"]));
app.set("view engine", "ejs");
const ejs = require('ejs');
// ejs.renderFile(path.join(__dirname, 'views', 'index.ejs'), { async: true }, (err, html) => {
//   if (err) {
//     console.error(err);
//   } else {
//     console.log(html);
//   }
// });

// app.get("/", function (request, response) {
//   response.send("Hello World");
// });
app.use(express.static(path.join(__dirname, "public")));
app.get("/", async (request, response) => { 
  const allTodos = await Todo.getTodos();   
  const overdue = await Todo.overdue();
  const dueToday = await Todo.dueToday();
  const dueLater = await Todo.dueLater();

  if(request.accepts("html")) {
    response.render("index", {
      title: "Todo List",
      allTodos,
      overdue,
      dueToday,
      dueLater,
      csrfToken: request.csrfToken(),
    });
  }
  else {
    response.json({
      overdue,
      dueToday,
      dueLater,
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
  try {
    await Todo.remove(request.params.id);
    return response.json({success: true});
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});
module.exports = app;
