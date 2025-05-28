    let title = document.getElementById("title");
    let price = document.getElementById("price");
    let taxes = document.getElementById("taxes");
    let ads = document.getElementById("ads");
    let discount = document.getElementById("discount");
    let total = document.getElementById("total");
    let count = document.getElementById("count");
    let category = document.getElementById("category");
    let submit = document.getElementById("submit");

    let mood = "create";
    let tmp;

    function getTotal() {
      if (price.value != "") {
        let result = +price.value + +taxes.value + +ads.value - +discount.value;
        total.innerHTML = result;
        total.style.background = "#040";
      } else {
        total.innerHTML = "";
        total.style.background = "#a00d02";
      }
    }

    [price, taxes, ads, discount].forEach(el => el.oninput = getTotal);

    let dataPro = localStorage.products ? JSON.parse(localStorage.products) : [];

    function clearData() {
      title.value = "";
      price.value = "";
      taxes.value = "";
      ads.value = "";
      discount.value = "";
      total.innerHTML = "";
      count.value = "";
      category.value = "";
    }

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
          </tr>
        `;
      }
      document.getElementById("tbody").innerHTML = table;

      let btnDelete = document.getElementById("deleteAll");
      btnDelete.innerHTML = dataPro.length ? `<button onclick="deleteAll()">Delete All (${dataPro.length})</button>` : "";
    }

    function deleteData(i) {
      dataPro.splice(i, 1);
      localStorage.setItem("products", JSON.stringify(dataPro));
      showData();
    }

    function deleteAll() {
      localStorage.removeItem("products");
      dataPro = [];
      showData();
    }

    function updateData(i) {
      let p = dataPro[i];
      title.value = p.title;
      price.value = p.price;
      taxes.value = p.taxes;
      ads.value = p.ads;
      discount.value = p.discount;
      category.value = p.category;
      getTotal();
      count.style.display = "none";
      mood = "update";
      submit.innerHTML = "Update";
      tmp = i;
      scroll({ top: 0, behavior: "smooth" });
    }

    submit.onclick = function () {
      let newPro = {
        title: title.value.trim().toLowerCase(),
        price: price.value,
        taxes: taxes.value,
        ads: ads.value,
        discount: discount.value,
        total: total.innerHTML,
        category: category.value.trim().toLowerCase()
      };

      if (mood === "create") {
        for (let i = 0; i < (count.value || 1); i++) {
          dataPro.push(newPro);
        }
      } else {
        dataPro[tmp] = newPro;
        mood = "create";
        submit.innerHTML = "Create";
        count.style.display = "block";
      }

      localStorage.setItem("products", JSON.stringify(dataPro));
      clearData();
      showData();
    };

    window.onload = showData;
