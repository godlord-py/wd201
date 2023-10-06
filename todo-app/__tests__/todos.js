const request = require('supertest');
const app = require('../app');
const db = require('../models/index');
var cheerio = require("cheerio");
// const { DESCRIBE } = require('sequelize/types/query-types');
let server, agent;
function extractCsrfToken(res) {
  const $ = cheerio.load(res.text);
  return $('[name=_csrf]').val();
}
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
    const res = await agent.get("/");
    const csrfToken = extractCsrfToken(res);
    const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      "_csrf": csrfToken,
    });
    // console.log(response,"check1")
    expect(response.statusCode).toBe(302);
    // expect(response.header["content-type"]).toBe(
    //   "application/json; charset=utf-8",
    // );
    // const parsedResponse = JSON.parse(response.text);
    // expect(parsedResponse.id).toBeDefined();

  });
   test("Marks a todo with the given ID as complete", async () => {
    const res = await agent.get("/");
    const csrfToken = extractCsrfToken(res);
    const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      "_csrf": csrfToken,
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
      "_csrf": csrfToken
    });
    // const response = await agent.get("/todos");
    // const parsedResponse = JSON.parse(response.text);

    // expect(parsedResponse.length).toBe(4);
    // expect(parsedResponse[3]["title"]).toBe("Buy ps3");
  });

//   test("Deletes a todo with the given ID if it exists and sends a boolean response", async () => {
//     // FILL IN YOUR CODE HERE
//     const response = await agent.post("/todos").send({
//       title: "Buy xbox",
//       dueDate: new Date().toISOString(),
//       completed: false,

//   });
//   const parsedResponse = JSON.parse(response.text);
//   const todoID = parsedResponse.id;
//   const deleteResponse = await agent.delete(`/todos/${todoID}`).send();
//   const parsedDeleteResponse = JSON.parse(deleteResponse.text);
//   expect(parsedDeleteResponse).toBe(true);
  
// });

});








