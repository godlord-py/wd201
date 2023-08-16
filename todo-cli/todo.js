const todoList = () => {
  all = []
  const add = (todoItem) => {
    all.push(todoItem)
  }
  const markAsComplete = (index) => {
    all[index].completed = true
  }

  const overdue = () => {
    // Write the date check condition here and return the array
    // of overdue items accordingly.
    overdues = []
    for (let i = 0; i < all.length; i++) {
      if (all[i].dueDate < today && all[i].completed == false) {
        overdues.push(all[i])
      }
    }
    return overdues

  }

  const dueToday = () => {
    // Write the date check condition here and return the array
    // of todo items that are due today accordingly.
    dueTodays = []
    for (let i = 0; i < all.length; i++) {
      if (all[i].dueDate == today && all[i].completed == false) {
        dueTodays.push(all[i])
      }
    }
    return dueTodays
  
  }
  const dueLater = () => {
    // Write the date check condition here and return the array
    // of todo items that are due later accordingly.
    dueLaters = []
    for (let i = 0; i < all.length; i++) {
      if (all[i].dueDate > today && all[i].completed == false) {
        dueLaters.push(all[i])
      }
    }
    return dueLaters
  
  
  }

  const toDisplayableList = (list) => {
    // Format the To-Do list here, and return the output string
    // as per the format given above.
    var output = ""
    for (let i = 0; i < list.length; i++) {
      if (list[i].completed == true) {
        output += `[X] ${list[i].title} ${list[i].dueDate}\n`
      }
      else {
        output += `[ ] ${list[i].title} ${list[i].dueDate}\n`
      }
    }
    return output

  
  }

  return {
    all,
    add,
    markAsComplete,
    overdue,
    dueToday,
    dueLater,
    toDisplayableList
  };
};

// ####################################### #
// DO NOT CHANGE ANYTHING BELOW THIS LINE. #
// ####################################### #

const todos = todoList();

const formattedDate = d => {
  return d.toISOString().split("T")[0]
}

var dateToday = new Date()
const today = formattedDate(dateToday)
const yesterday = formattedDate(
  new Date(new Date().setDate(dateToday.getDate() - 1))
)
const tomorrow = formattedDate(
  new Date(new Date().setDate(dateToday.getDate() + 1))
)

todos.add({ title: 'Submit assignment', dueDate: yesterday, completed: false })
todos.add({ title: 'Pay rent', dueDate: today, completed: true })
todos.add({ title: 'Service Vehicle', dueDate: today, completed: false })
todos.add({ title: 'File taxes', dueDate: tomorrow, completed: false })
todos.add({ title: 'Pay electric bill', dueDate: tomorrow, completed: false })

console.log("My Todo-list\n")

console.log("Overdue")
var overdues = todos.overdue()
var formattedOverdues = todos.toDisplayableList(overdues)
console.log(formattedOverdues)
console.log("\n")

console.log("Due Today")
let itemsDueToday = todos.dueToday()
let formattedItemsDueToday = todos.toDisplayableList(itemsDueToday)
console.log(formattedItemsDueToday)
console.log("\n")

console.log("Due Later")
let itemsDueLater = todos.dueLater()
let formattedItemsDueLater = todos.toDisplayableList(itemsDueLater)
console.log(formattedItemsDueLater)
console.log("\n\n")