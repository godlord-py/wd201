/* eslint-disable space-in-parens */
/* eslint-disable object-curly-spacing */
/* eslint-disable eol-last */
/* eslint-disable padded-blocks */
/* eslint-disable semi */
/* eslint-disable indent */
/* eslint-disable quotes */
/* eslint-disable no-undef */
const todoList = require("../todo");
const { all, markAsComplete, add } = todoList();

describe("todoList", () => {
  beforeAll(() => {
    add({
      title: "Test todo",
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
  test("Creating a new todo", () => {
    const todoItemsCount = all.length;
    add({
      title: "Test todo",
      completed: false,
      dueDate: new Date().toLocaleDateString("en-CA"),
    });
    expect(all.length).toBe(todoItemsCount + 1);
  });
  test("should mark a todo as complete", () => {
    expect(all[0].completed).toBe(true);
    markAsComplete(0);
    expect(all[0].completed).toBe(true);
  });
  test("should return a list of overdue todos", () => {
    expect(todoList().overdue()).toEqual([]);
  });
  test("should return a list of todos due today", () => {
    expect(todoList().dueToday()).toEqual([]);
  });
  test("should return a list of todos due later", () => {
    expect(todoList().dueLater()).toEqual([]);
  });
});
