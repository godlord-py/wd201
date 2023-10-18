const express = require("express");
const app = express();
const { Todo, User } = require("./models");
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
const passport = require('passport');
const connectEnsureLogin = require('connect-ensure-login');
const session = require('express-session');
const flash = require("connect-flash");
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const { request } = require("http");
const saltRounds = 10;
app.use(flash());
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.json()); 
app.use(session({
  secret: "my-super-secret-key-63693875353985691365693",
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
  } 
}))
app.use(function(request, response, next) {
  response.locals.messages = request.flash();
  next();
});
app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy({
  usernameField: "email",
  passwordField: "password",
}, (username, password, done) => {
  User.findOne({where: {email: username}})
    .then(async function(user)  {
      const result = await bcrypt.compare(password, user.password)
      if(result) {
        return done(null, user)
      }else {
        return done(null, false, {message: "Incorrect password"})
      }
    }).catch((error) => {
      return (error)
    }) 
}))

passport.serializeUser((user, done) => {
  console.log("Serializing user: ", user.id);
  done(null, user.id);    
})

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then(user => {
      done(null, user)
    })
    .catch(error => {
      done(error, null)
    })
}); 

app.get("/", async (request, response) => {
  response.render("index", {
    title: "Todo List",
    csrfToken: request.csrfToken(),
  });
});
app.use(express.static(path.join(__dirname, "public")));

app.get("/todos", connectEnsureLogin.ensureLoggedIn(),  async (request, response) => { 
  console.log(request.user)
  const loggedInUser = request.user.id;
  const allTodos = await Todo.getTodos(loggedInUser);   
  const overdue = await Todo.overdue(loggedInUser);
  const dueToday = await Todo.dueToday(loggedInUser);
  const dueLater = await Todo.dueLater(loggedInUser);
  let completeditems = await Todo.completeditems(loggedInUser);

  if(request.accepts("html")) {
    response.render("todos", {
      title: "Todo List",
      allTodos,
      overdue,
      dueToday,
      dueLater,
      completeditems,
      csrfToken: request.csrfToken(),
    });
  }
  else {
    response.json({
      overdue,
      dueToday,
      dueLater,
      completeditems,
    })
  }
});

app.get("/signup", (request , response) => {
  response.render("signup" , {
    title : "Sign Up",  
    csrfToken: request.csrfToken(),
  })
})
app.post("/users", async (request , response) => {
 //hash pass
 const hashedpwd = await bcrypt.hash(request.body.Password, saltRounds)
 try {
 
  const user = await User.create({
    firstName: request.body.firstName,
    lastName: request.body.lastName,
    email: request.body.Email,
    password: hashedpwd,
  });
  request.login(user, (err) => {
    if(err) {
      console.log(err)
    
    } 
    response.redirect("/todos");  
  })
 }catch(error) {
  console.log(error);
  
 }
})

app.get("/login", (request , response) => {
  response.render("login" , {
    title : "Login",
    csrfToken: request.csrfToken()
  })
})

app.post("/session", passport.authenticate('local', {failureRedirect: "/login", failureFlash: true}), 
function (request , response) {
  console.log(request.user);
  response.redirect("/todos");
});

app.get("/signout", (request , response) => {
  request.logout((err) => {
    if (err) {return next(err); }
  response.redirect("/login");
  })
})
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

app.get("/todos/:id", connectEnsureLogin.ensureLoggedIn(), async function (request, response) {
  try {
    const todo = await Todo.findByPk(request.params.id);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.post("/todos", connectEnsureLogin.ensureLoggedIn() , async function (request, response) {
  if(request.title.length === 0) {
    request.flash("error", "This field can't be empty.");
    return response.redirect("/todos");
  }
  if(request.body.dueDate.length === 0) {
    request.flash("error", "This field can't be empty.");
    return response.redirect("/todos");
  }
  try {
    await Todo.addTodo({
      title: request.body.title,
      dueDate: request.body.dueDate,
      userId: request.user.id,  
    })
    return response.redirect("/todos");
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

// app.put("/todos/:id/markAsCompleted", async function (request, response) {
//   const todo = await Todo.findByPk(request.params.id);
//   try {
//     const updatedTodo = await todo.markAsCompleted();
//     return response.json(updatedTodo);
//   } catch (error) {
//     console.log(error);
//     return response.status(422).json(error);
//   }
// });
app.put("/todos/:id",connectEnsureLogin.ensureLoggedIn(), async function (request, response) {
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedTodo = await todo.setCompletionStatus(request.body.completed);
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.delete("/todos/:id",connectEnsureLogin.ensureLoggedIn(), async function (request, response) {
  console.log("We have to delete a Todo with ID: ", request.params.id);
  try {
    await Todo.remove(request.params.id, request.user.id);
    return response.json({success: true});
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  } 
});
module.exports = app;
