const request = require('supertest');
const app = require('../app');
const db = require('../models/index');
// const { DESCRIBE } = require('sequelize/types/query-types');
let server, agent;
describe("Todo test suite", () => {  
    beforeAll(async () => {
        await db.sequelize.sync({force: true});
        server = app.listen(3000, () => { });
        agent = request.agent(server);

    });
    afterAll(async () => {
        await db.sequelize.close();
        server.close();
})
test("responds with json at /todos POST endpoint", async () => {
    const response = await agent.post("/todo").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    // console.log(response,"check1")
    expect(response.statusCode).toBe(200);
    expect(response.header["content-type"]).toBe(
      "application/json; charset=utf-8",
    );
    const parsedResponse = JSON.parse(response.text);
    expect(parsedResponse.id).toBeDefined();
  });
   test("Marks a todo with the given ID as complete", async () => {
    const response = await agent.post("/todo").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    // console.log(response,"check2")
    const parsedResponse = JSON.parse(response.text);
    const todoID = parsedResponse.id;

    expect(parsedResponse.completed).toBe(false);

    const markCompleteResponse = await agent
      .put(`/todo/${todoID}/markASCompleted`)
      .send();
    const parsedUpdateResponse = JSON.parse(markCompleteResponse.text);
    expect(parsedUpdateResponse.completed).toBe(true);
  });
})  