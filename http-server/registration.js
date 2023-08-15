const currentDate = new Date();
const minDate = new Date();
const maxDate = new Date();

minDate.setFullYear(currentDate.getFullYear() - 55);
// minDate.setDate(minDate.getDate() + 1);
maxDate.setFullYear(currentDate.getFullYear() - 18);
// maxDate.setDate(maxDate.getDate() + 1);  

document.getElementById("dob").setAttribute("min", minDate.toISOString().split('T')[0]);
document.getElementById("dob").setAttribute("max", maxDate.toISOString().split('T')[0]);

if (localStorage.getItem("Names") == null) {
    localStorage.setItem("Names", "[]");
}
if (localStorage.getItem("Emails") == null) {
    localStorage.setItem("Emails", "[]");
}
if (localStorage.getItem("Passwords") == null) {
    localStorage.setItem("Passwords", "[]");
}
if (localStorage.getItem("DOBs") == null) {
    localStorage.setItem("DOBs", "[]");
}

function displayData() {
    const names = JSON.parse(localStorage.getItem("Names"));
    const emails = JSON.parse(localStorage.getItem("Emails"));
    const passwords = JSON.parse(localStorage.getItem("Passwords"));
    const dobs = JSON.parse(localStorage.getItem("DOBs"));

    const tableBody = document.querySelector("#tableData tbody");
    // Clear existing table rows
    tableBody.innerHTML = "";

    for (let i = 0; i < names.length; i++) {
        const row = document.createElement("tr");
        const nameCell = document.createElement("td");
        const emailCell = document.createElement("td");
        const passCell = document.createElement("td");
        const dobCell = document.createElement("td");
        const agreedCell = document.createElement("td");

        nameCell.textContent = names[i];
        emailCell.textContent = emails[i];
        passCell.textContent = passwords[i];
        dobCell.textContent = dobs[i];
        agreedCell.textContent = "true";

        row.appendChild(nameCell);
        row.appendChild(emailCell);
        row.appendChild(passCell);
        row.appendChild(dobCell);
        row.appendChild(agreedCell);

        tableBody.appendChild(row);
    }

}

displayData();

function Submit() {

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const dob = document.getElementById("dob").value;

    var old_n = JSON.parse(localStorage.getItem("Names"));
    old_n.push(name);
    localStorage.setItem("Names", JSON.stringify(old_n));
    
    var old_e = JSON.parse(localStorage.getItem("Emails"));
    old_e.push(email);
    localStorage.setItem("Emails", JSON.stringify(old_e));
    
    var old_p = JSON.parse(localStorage.getItem("Passwords"));
    old_p.push(password);
    localStorage.setItem("Passwords", JSON.stringify(old_p));
    
    var old_d = JSON.parse(localStorage.getItem("DOBs"));
    old_d.push(dob);
    localStorage.setItem("DOBs", JSON.stringify(old_d));


    // Clear input fields
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    document.getElementById("dob").value = "";

    displayData();
    return false;
}