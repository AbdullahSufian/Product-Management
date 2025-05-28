// Input elements

let title = document.getElementById("title");
let price = document.getElementById("price");
let taxes = document.getElementById("taxes");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let total = document.getElementById("total");
let count = document.getElementById("count");
let category = document.getElementById("category");
let submit = document.getElementById("submit");
let search = document.getElementById("search");

let mood = "create";
let tmp;

// Calculate the total
function getTotal() {
  if (price.value !== "") {
    let result = (+price.value || 0) + (+taxes.value || 0) + (+ads.value || 0) - (+discount.value || 0);
    total.innerHTML = result;
    total.style.background = "#040";
  } else {
    total.innerHTML = "";
    total.style.background = "#a00d02";
  }
}
[price, taxes, ads, discount].forEach(el => el.addEventListener("input", getTotal));

// Load data from Local Storage
let dataPro = localStorage.products ? JSON.parse(localStorage.products) : [];

//Create or modify a product
submit.onclick = function () {
  let newPro = {
    title: title.value.trim().toLowerCase(),
    price: price.value,
    taxes: taxes.value,
    ads: ads.value,
    discount: discount.value,
    total: total.innerHTML,
    category: category.value.trim().toLowerCase(),
  };

  if (
    newPro.title !== "" &&
    newPro.price !== "" &&
    newPro.category !== ""
  ) {
    if (mood === "create") {
      let copies = count.value > 1 ? Math.min(+count.value, 100) : 1;
      for (let i = 0; i < copies; i++) {
        dataPro.push(newPro);
      }
    } else {
      dataPro[tmp] = newPro; // Update only the selected item
      mood = "create";
      submit.innerHTML = "Create";
      count.style.display = "block";
    }

    clearData();
    localStorage.setItem("products", JSON.stringify(dataPro));
    showData();
  } else {
    alert("Please fill all fields");
  }
};

// Clear fields
function clearData() {
  title.value = "";
  price.value = "";
  taxes.value = "";
  ads.value = "";
  discount.value = "";
  total.innerHTML = "";
  count.value = "";
  category.value = "";
  total.style.background = "#a00d02";
}

// Display data
function showData() {
  let table = "";
  for (let i = 0; i < dataPro.length; i++) {
    table += `
      <tr>
        <td>${i + 1}</td>
        <td>${dataPro[i].title}</td>
        <td>${dataPro[i].price}</td>
        <td>${dataPro[i].taxes}</td>
        <td>${dataPro[i].ads}</td>
        <td>${dataPro[i].discount}</td>
        <td>${dataPro[i].total}</td>
        <td>${dataPro[i].category}</td>
        <td><button onclick="updateData(${i})">Update</button></td>
        <td><button onclick="deleteData(${i})">Delete</button></td>
      </tr>`;
  }
  document.getElementById("tbody").innerHTML = table;

  let btnDelete = document.getElementById("deleteAll");
  if (dataPro.length > 0) {
    btnDelete.innerHTML = `<button onclick="deleteAll()">Delete All (${dataPro.length})</button>`;
  } else {
    btnDelete.innerHTML = "";
  }
}

//Delete an item
function deleteData(i) {
  dataPro.splice(i, 1);
  localStorage.setItem("products", JSON.stringify(dataPro));
  showData();
}

// Delete all
function deleteAll() {
  localStorage.removeItem("products");
  dataPro = [];
  showData();
}

// Update an item
function updateData(i) {
  let d = dataPro[i];
  title.value = d.title;
  price.value = d.price;
  taxes.value = d.taxes;
  ads.value = d.ads;
  discount.value = d.discount;
  category.value = d.category;
  getTotal();
  count.style.display = "none";
  submit.innerHTML = "Update";
  mood = "update";
  tmp = i;
  scroll({ top: 0, behavior: "smooth" });
}

//Search mode
let searchMode = "title";

function setSearchMode(mode) {
  searchMode = mode;
  search.placeholder = "Search by " + mode;
  search.focus();
  search.value = "";
  showData();
}

// Search
function searchData(value) {
  let table = "";
  for (let i = 0; i < dataPro.length; i++) {
    if (
      (searchMode === "title" && dataPro[i].title.includes(value.toLowerCase())) ||
      (searchMode === "category" && dataPro[i].category.includes(value.toLowerCase()))
    ) {
      table += `
        <tr>
          <td>${i + 1}</td>
          <td>${dataPro[i].title}</td>
          <td>${dataPro[i].price}</td>
          <td>${dataPro[i].taxes}</td>
          <td>${dataPro[i].ads}</td>
          <td>${dataPro[i].discount}</td>
          <td>${dataPro[i].total}</td>
          <td>${dataPro[i].category}</td>
          <td><button onclick="updateData(${i})">Update</button></td>
          <td><button onclick="deleteData(${i})">Delete</button></td>
        </tr>`;
    }
  }
  document.getElementById("tbody").innerHTML = table;
}

//Excel export
function exportToExcel() {
  let csv = 'ID,Title,Price,Taxes,Ads,Discount,Total,Category\n';
  dataPro.forEach((item, index) => {
    csv += `${index + 1},${item.title},${item.price},${item.taxes},${item.ads},${item.discount},${item.total},${item.category}\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "products.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

window.onload = showData;
