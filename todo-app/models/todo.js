'use strict';
const {
  Model , Op
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
    static addTodo({title, dueDate}) {
      return this.create({title: title, dueDate: dueDate,completed: false})
    }
    static getTodos() {
      return this.findAll(); 
    }
    static async remove(id) {
      return this.destroy({
        where: {
          id,
        },
      });
      }
    markAsCompleted() {
      return this.update({completed: true})
    }
    setCompletionStatus(bool) {
      return this.update({ completed: bool });
    }
    static overdue() {
      return this.findAll({
        where: {
          dueDate: {
            [Op.lt]: new Date().toLocaleDateString("en-CA"),
          },
          completed: false,
        },
        order: [["id", "ASC"]],
      });
    }
    static dueToday() {
      return this.findAll({
        where: {
          dueDate: {
            [Op.eq]: new Date().toLocaleDateString("en-CA"),
          },
          completed: false,
        },
        order: [["id", "ASC"]],
      });
    }
    static dueLater() {
      return this.findAll({
        where: {
          dueDate: {
            [Op.gt]: new Date().toLocaleDateString("en-CA"),
          },
          completed: false,
        },
        order: [["id", "ASC"]],
      });
    }
    static completeditems() {
    return this.findAll({
      where: {
        completed: true,
      },
      order: [["id", "ASC"]],
    });
  }
  static async remove(id) {
    return this.destroy({
      where: { id },
    });
  }
}
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