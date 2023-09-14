// models/todo.js
'use strict';
const {
  Model
} = require('sequelize');
const { Op } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static async addTask(params) {
      return await Todo.create(params);
    }
    static async showList() {
      console.log("My Todo list \n");

      console.log("Overdue");
      // FILL IN HERE
      const overdueItems = await Todo.overdue();
      overdueItems.forEach((item) => {
        console.log(item.displayableString());
      });
      console.log("\n");

      console.log("Due Today");
      //For an incomplete todo due today, Todo.displayableString should return a string of the format ID. [ ] TITLE (date should not be shown)
      // FILL IN HERE
      const dueTodayItems = await Todo.dueToday();
      dueTodayItems.forEach((item) => {
        console.log(item.displayableString());
      });
      console.log("\n");

      console.log("Due Later");
      // FILL IN HERE
      const dueLaterItems = await Todo.dueLater();
      dueLaterItems.forEach((item) => {
        console.log(item.displayableString());
      }
      );
    }

    static async overdue() {
      // FILL IN HERE TO RETURN OVERDUE ITEMS
      return await Todo.findAll({
        where: {
          dueDate: {
            [Op.lt]: new Date().toISOString().split("T")[0],
          },
        },
      });
    }

    static async dueToday() {
      //For an incomplete todo due today, Todo.displayableString should return a string of the format ID. [ ] TITLE (date should not be shown)
      // FILL IN HERE TO RETURN ITEMS DUE tODAY
      return await Todo.findAll({
        where: {
          dueDate: {
            [Op.eq]: new Date().toISOString().split("T")[0],
          },
        },
      });
    }

      

    static async dueLater() {
      // FILL IN HERE TO RETURN ITEMS DUE LATER
      return await Todo.findAll({
        where: {
          dueDate: {
            [Op.gt]: new Date().toISOString().split("T")[0],
          },
        },
      });
    }


    static async markAsComplete(id) {
      // FILL IN HERE TO MARK AN ITEM AS COMPLETE
      const todo = await Todo.findByPk(id);
      todo.completed = true;
      await todo.save();

    }

    displayableString() {
      let checkbox = this.completed ? "[x]" : "[ ]";
      let displayDate =
        this.dueDate === new Date().toLocaleDateString("en-CA")
          ? ""
          : this.dueDate;
      return `${this.id}. ${checkbox} ${this.title} ${displayDate}`.trim();
    }
  }
      //  `${this.id}. ${checkbox} ${this.title} ${this.dueDate}`;
  Todo.init({
    title: DataTypes.STRING,
    dueDate: DataTypes.DATEONLY,
    completed: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Todo',
  });
  return Todo;
};