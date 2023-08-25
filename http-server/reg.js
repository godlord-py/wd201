let userForm = document.getElementById("user-form");
const retriveEntries = () => {
    let entries = localStorage.getItem("user-entries");
    if (entries) {
        entries = JSON.parse(entries);   
    }else {
        entries = [];
    }
    return entries;
}
let userEntries = retriveEntries();

const displayEntries = () => {
    const entries = retriveEntries();



    const tableEntries = entries.map((entry) => {
        const name = `<td class= border px-4 py-2'>${entry.name}</td>`;
        const emailCell = `<td class='border px-4 py-2'>${entry.email}</td>`;
        const passwordCell = `<td class='border px-4 py-2'>${entry.password}</td>`;
        const dobCell = `<td class='border px-4 py-2'>${entry.dob}</td>`;
        const acceptTermsCell = `<td class='border px-4 py-2'>${entry.acceptTerms}</td>`;
        const row = `<tr>${name} ${emailCell} ${passwordCell} ${dobCell} ${acceptTermsCell}</tr>`;
        return row;
        }).join("\n");

    const table = `<table class="table-auto w-full"><tr>
        <th class="px-4 py-2">Name</th>
        <th class="px-4 py-2">Email</th>
        <th class="px-4 py-2">Password</th>
        <th class="px-4 py-2">dob</th>
        <th class="px-4 py-2">accepted terms?</th>
    </tr>${tableEntries} </table>`;
    
let details = document.getElementById("user-entries");
details.innerHTML = table;
}

const saveUserForm = (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const dob = document.getElementById("dob").value;
    const acceptTerms = document.getElementById("acceptTerms").checked;
    const entry = {
        name,
        email,
        password,
        dob,
        acceptTerms
    };
    userEntries.push(entry);
    localStorage.setItem("user-entries", JSON.stringify(userEntries));
    displayEntries();
  }
  
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("user-form");
  const dobInput = document.getElementById("dob");
  function validateAge(dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth() ;
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
      age--;
      }
      return age;
    }

    function handleSubmit(event) {
      event.preventDefault();
      const dateOfBirth = dobInput.value;
      const age = validateAge(dateOfBirth);
      if(age > 18 && age < 55){
        saveUserForm(event);
    }
      else {
        alert("You must be between 18 and 55 years old to register.");
      }
    }
    form.addEventListener("submit", handleSubmit);  
displayEntries();
});

