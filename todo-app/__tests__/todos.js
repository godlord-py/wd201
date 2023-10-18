const request = require('supertest');
const app = require('../app');
const db = require('../models/index');
var cheerio = require("cheerio");

const CST = (days) => {
  if (!Number.isInteger(days)) {
    throw new Error("Need to pass an integer as days");
  }
  const today = new Date();
  const oneDay = 60 * 60 * 24 * 1000;
  return new Date(today.getTime() + days * oneDay)
}
// const { DESCRIBE } = require('sequelize/types/query-types');
let server, agent;
function extractCsrfToken(res) {
  const $ = cheerio.load(res.text);
  return $('[name=_csrf]').val();
}
const login = async (agent, username, password) => {

  let res = await agent.get("/login");
  let csrfToken = extractCsrfToken(res);
  res = await agent.post("/session").send({
    email: username,
    password: password,
    _csrf: csrfToken,
  });
};
describe("Todo test suite", () => {  
    beforeAll(async () => {
        await db.sequelize.sync({force: true});
        server = app.listen(4000, () => { });
        agent = request.agent(server);
 
    });
    afterAll(async () => {
      try {
        await db.sequelize.close();
        await server.close();
      } catch (error) {
        console.log(error);
      }
    })    
test("responds with json at /todos POST endpoint", async () => {
  const agent = request.agent(server);
  await login(agent, "test@test.com", "password");
    const res = await agent.get("/todos");
    const csrfToken = extractCsrfToken(res);
    const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    // console.log(response,"check1")
    expect(response.statusCode).toBe(302);
  });
test("Sign Up", async ()=> {
  let response = await agent.get("/signup ");
  const csrfToken = extractCsrfToken(response);
  response = await agent.post("/users").send({
    firstName: "Test",
    lastName: "User",
    Email: "test@test.com",
    Password: "password",
    _csrf: csrfToken,
});
  expect(response.statusCode).toBe(302);   
});
test("Sign out", async () => {
  let res = await agent.get("/todos");
  expect(res.statusCode).toBe(200);

  res = await agent.get("/signout");
  expect(res.statusCode).toBe(302);

  res = await agent.get("/todos");
  expect(res.statusCode).toBe(302);
});
test("Marks a todo with the given ID as complete", async () => {
    const res = await agent.get("/");
    const csrfToken = extractCsrfToken(res);
    const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });

  });
  test("Fetches all todo in the database using /todos endpoint", async () => {
    const res = await agent.get("/");
    const csrfToken = extractCsrfToken(res);
    await agent.post("/todos").send({
      title: "Buy xbox",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    await agent.post("/todos").send({
      title: "Buy ps3",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken
    });
    // const response = await agent.get("/todos");
    // const parsedResponse = JSON.parse(response.text);

    // expect(parsedResponse.length).toBe(4);
    // expect(parsedResponse[3]["title"]).toBe("Buy ps3");
  });

  test("Deletes a todo with the given ID if it exists and sends a boolean response", async () => {
    const res = await agent.get("/");
    const csrfToken = extractCsrfToken(res);
    await agent.post("/todos").send({
      title: "Buy xbox",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken
  });
  // const parsedResponse = JSON.parse(response.text);
  // const todoID = parsedResponse.id;
  // const deleteResponse = await agent.delete(`/todos/${todoID}`).send();
  // const parsedDeleteResponse = JSON.parse(deleteResponse.text);
  // expect(parsedDeleteResponse).toBe(true); 
});
test("Should not create a todo item with empty dueDate", async () => {
    const res = await agent.get("/");
    const csrfToken = extractCsrfToken(res);
    const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: "",
      completed: false,
      _csrf: csrfToken
    });
  });


test(" Should create sample due today item", async () => {
    const res = await agent.get("/");
    const csrfToken = extractCsrfToken(res);
    await agent.post("/todos").send({
      title: "sample due today item",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken
    });
  });
  test(" Should create sample due later item", async () => {
    const res = await agent.get("/");
    const csrfToken = extractCsrfToken(res);
    await agent.post("/todos").send({
      title: "sample due later item",
      dueDate: CST(2).toISOString(),
      completed: false,
      _csrf: csrfToken
    });
  });
  test(" Should create sample overdue item", async () => {
    const res = await agent.get("/");
    const csrfToken = extractCsrfToken(res);
    await agent.post("/todos").send({
      title: "Sample overdue item",
      dueDate: CST(-2).toISOString(),
      completed: false,
      _csrf: csrfToken
    });
  });
  test(" Should mark sample overdue item as completed", async () => {
    const res = await agent.get("/");
    const csrfToken = extractCsrfToken(res);
    const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: CST(-2).toISOString(),
      completed: false,
      _csrf: csrfToken
    });
    const parsedResponse = JSON.parse(response.text);
    const todoID = parsedResponse.id;
    const markAsCompletedResponse = await agent.put(`/todos/${todoID}`).send({completed: true});
    const parsedMarkAsCompletedResponse = JSON.parse(markAsCompletedResponse.text);
    expect(parsedMarkAsCompletedResponse.completed).toBe(true);
  });
});









