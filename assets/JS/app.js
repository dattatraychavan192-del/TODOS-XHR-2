let baseURL = "https://jsonplaceholder.typicode.com";

const cl = console.log;

const userCard = document.getElementById("userCard");
const name = document.getElementById("name");
const username = document.getElementById("username");
const email = document.getElementById("email");
const address = document.getElementById("address");
const phone = document.getElementById("phone");
const updateBtn = document.getElementById("updateBtn");
const editBtn = document.getElementById("editBtn");

const stdContainer = document.getElementById("stdContainer");

let userArr = [];

function snackbar(msg, icon) {
  swal.fire({
    title: msg,
    icon: icon,
    timer: 2000,
  });
}

const spinner = document.getElementById("spinner");

function fetchUser(ele) {
  spinner.classList.remove("d-none");

  let xhr = new XMLHttpRequest();
  let postURL = `${baseURL}/users`;
  xhr.open("GET", postURL);
  xhr.send(null);
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status <= 299) {
      userArr = JSON.parse(xhr.response);

      creatCard(userArr.reverse());
      spinner.classList.add("d-none");
    }
  };
}

fetchUser();

function creatCard(ele) {
  let result = "";
  ele.forEach((element, i) => {
    result += `
 <tr id="${element.id}">  
              <td>${userArr.length - i}</td>
              <td>${element.name}</td>
              <td>${element.username}</td>
              <td>${element.email}</td>
              <td>${element.address.city}</td>
              <td>${element.phone}</td>
              <td><i class="fa-solid fa-2x  text-primary fa-pen-to-square" onclick = "onedit(this)"></i></td>
              <td><i class="fa-solid fa-2x text-danger fa-trash" onclick = "ondelete(this)"></i></td>

            </tr>
    
    `;
  });

  stdContainer.innerHTML = result;
}

function onSubmitHandalar(ele) {
  ele.preventDefault();
  spinner.classList.remove("d-none");

  let newObj = {
    name: name.value,
    username: username.value,
    email: email.value,
    address: address.value,
    phone: phone.value,
  };

  userArr.push(newObj);
  let xhr = new XMLHttpRequest();
  let postUrl = `${baseURL}/users`;
  xhr.open("POST", postUrl);
  xhr.send(JSON.stringify(newObj));
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status <= 299) {
      let response = JSON.parse(xhr.response);
      let tr = document.createElement("tr");
      tr.id = response.id;
      tr.innerHTML = `
         <td>${userArr.length}</td>
              <td>${newObj.name}</td>
              <td>${newObj.username}</td>
              <td>${newObj.email}</td>
              <td>${newObj.address}</td>
              <td>${newObj.phone}</td>
              <td><i class="fa-solid fa-2x  text-primary fa-pen-to-square" onclick = "onedit(this)"></i></td>
              <td><i class="fa-solid fa-2x text-danger fa-trash" onclick = "ondelete(this)"></i></td>
      `;

      stdContainer.prepend(tr);
      userCard.reset();
      spinner.classList.add("d-none");

      snackbar(`User Add Succssefully`);
    } else {
      cl("something went wrong");
    }
  };
}

function onedit(ele) {
  spinner.classList.remove("d-none");

  let editId = ele.closest("tr").id;
  let editURL = `${baseURL}/users/${editId}`;
  localStorage.setItem("editId", editId);

  let xhr = new XMLHttpRequest();
  xhr.open("GET", editURL);
  xhr.send(null);
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status <= 299) {
      let editObj = JSON.parse(xhr.response);

      name.value = editObj.name;
      username.value = editObj.username;
      email.value = editObj.email;
      address.value = editObj.address.city;
      phone.value = editObj.phone;

      editBtn.classList.add("d-none");
      updateBtn.classList.remove("d-none");

      userCard.classList.remove("d-none");
      spinner.classList.add("d-none");

      userCard.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      snackbar("something went wrong", "error");
    }
  };
}

function onUpdateHandalar(ele) {
  spinner.classList.remove("d-none");

  let updateId = localStorage.getItem("editId");

  let updObj = {
    name: name.value,
    username: username.value,
    email: email.value,
    address: address.value,
    phone: phone.value,
  };

  let xhr = new XMLHttpRequest();
  let updURL = `${baseURL}/users/${updateId}`;
  xhr.open("PUT", updURL);
  xhr.send(JSON.stringify(updObj));

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status <= 299) {
      let tr = document.getElementById(updateId);

      tr.innerHTML = `
     <td>${userArr.length}</td>
              <td>${updObj.name}</td>
              <td>${updObj.username}</td>
              <td>${updObj.email}</td>
              <td>${updObj.address}</td>
              <td>${updObj.phone}</td>
              <td><i class="fa-solid fa-2x  cursor-pointer text-primary fa-pen-to-square" onclick = "onedit(this)"></i></td>
              <td><i class="fa-solid fa-2x cursor-pointer text-danger fa-trash" onclick = "ondelete(this)"></i></td>
    
    `;
      editBtn.classList.remove("d-none");
      updateBtn.classList.add("d-none");
      spinner.classList.add("d-none");

      snackbar("User update successfully", "success");
      tr.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    userCard.reset();
  };
}

function ondelete(ele) {
  spinner.classList.remove("d-none");

  let deleteId = ele.closest("tr").id;

  Swal.fire({
    title: "Are you sure?",
    text: "You want to delete it!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      let deleteURL = `${baseURL}/users/${deleteId}`;
      let xhr = new XMLHttpRequest();
      xhr.open("DELETE", deleteURL);
      xhr.send(null);

      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
          userArr = userArr.filter((user) => user.id != deleteId);
          ele.closest("tr").remove();
          spinner.classList.add("d-none");

          userArr.pop();
          let rows = document.querySelectorAll("#stdContainer tr");

          rows.forEach((row, i) => {
            row.cells[0].innerText = rows.length - i;
          });
        }
      };
    }
  });
}
userCard.addEventListener("submit", onSubmitHandalar);
updateBtn.addEventListener("click", onUpdateHandalar);
