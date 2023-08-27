/* eslint-disable space-in-parens */
/* eslint-disable object-curly-spacing */
/* eslint-disable eol-last */
/* eslint-disable padded-blocks */
/* eslint-disable semi */
/* eslint-disable indent */
/* eslint-disable quotes */
/* eslint-disable no-undef */
const todoList = require("../todo");
const today = new Date();
const oneDay = 60 * 60 * 24 * 1000;
const { all, markAsComplete, add, overdue, dueLater, dueToday } = todoList();
describe("todoList", () => {
  beforeAll(() => {
    const today = new Date();
    const oneDay = 60 * 60 * 24 * 1000; //referred to discord forum for this line of code
    add({
      title: "overDue",
      completed: false,
      dueDate: new Date(today.getTime() - 1 * oneDay).toLocaleDateString(
        "en-CA",
      ),
    });
    add({
      title: "dueLater",
      completed: false,
      dueDate: new Date(today.getTime() + 1 * oneDay).toLocaleDateString(
        "en-CA",
      ),
    });
    add({
      title: "Test todo3",
      completed: false,
      dueDate: new Date().toLocaleDateString("en-CA"),
    });
  });
  test("Should add new todo", () => {
    const todoItemsCount = all.length;
    add({
      title: "Test todo",
      completed: false,
      dueDate: new Date().toLocaleDateString("en-CA"),
    });
    expect(all.length).toBe(todoItemsCount + 1);
  });
  test("should mark a todo as complete", () => {
    expect(all[0].completed).toBe(false);
    markAsComplete(0);
    expect(all[0].completed).toBe(true);
  });

  test("checks return a list of overdue todos", () => {
    const overDueTodoItemsCount = overdue().length;
    add({
      ///////////
      title: "overdue",
      completed: false,
      dueDate: new Date(today.getTime() - 1 * oneDay).toLocaleDateString(
        "en-CA",
      ),
    });
    expect(overdue().length).toEqual(overDueTodoItemsCount + 1);
  });
  test("checks return a list of todos due today", () => {
    const dueTodayTodoItemsCount = dueToday().length; ////////////
    add({
      title: "dueToday",
      completed: false,
      dueDate: new Date().toLocaleDateString("en-CA"),
    });
    expect(dueToday().length).toEqual(dueTodayTodoItemsCount + 1);
  });
  test("checks return a list of todos due later", () => {
    const dueLaterTodoItemsCount = dueLater().length;
    add({
      title: "dueLater", /////////////
      completed: false,
      dueDate: new Date(today.getTime() + 2 * oneDay)
        .toISOString()
        .slice(0, 10),
    });
    expect(dueLater().length).toEqual(dueLaterTodoItemsCount + 1);
  });
});
