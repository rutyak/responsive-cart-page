let menu = document.getElementById("menu");
let mobileMenu = document.getElementById("mobile-menu");
let tableBody = document.getElementById("cart-items");
let loading = document.getElementById("loading");

menu.addEventListener("click", () => {
  mobileMenu.classList.toggle("show");
});

let cartData = [];

async function fetchData() {
  try {
    loading.style.display = "block";
    const res = await fetch(
      "https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889"
    );
    const data = await res.json();

    loading.style.display = "none";

    cartData = data.items; 
    console.log("data: ", cartData);

    updateCartUI(); 
  } catch (error) {
    console.error(error);
  }
}

function updateCartUI() {
  let actualSubtotal = 0;

  tableBody.innerHTML = "";

  cartData.forEach((item, index) => {
    let row = document.createElement("tr");

    // Calculate subtotal for each item
    let newSubtotal = (item.price * item.quantity) / 100;
    actualSubtotal += newSubtotal;

    // Product info cell
    let productInfo = document.createElement("td");
    productInfo.classList.add("product-info");

    let productImage = document.createElement("img");
    productImage.src = item.image;
    productImage.alt = "Product Image";

    let productName = document.createElement("span");
    productName.textContent = item.product_title;

    productInfo.appendChild(productImage);
    productInfo.appendChild(productName);

    // Price cell
    const priceCell = document.createElement("td");
    let formattedPrice = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(item.price / 100);
    priceCell.textContent = formattedPrice;

    // Quantity cell
    const quantityCell = document.createElement("td");
    const quantityInput = document.createElement("input");
    quantityInput.type = "number";
    quantityInput.value = item.quantity;
    quantityInput.min = 1;
    quantityCell.appendChild(quantityInput);

    // Update subtotal and total on quantity change
    quantityInput.addEventListener("input", () => {
      const newQuantity = parseInt(quantityInput.value) || 1;
      item.quantity = newQuantity; 

      const updatedSubtotal = (item.price * newQuantity) / 100;
      subtotal.textContent = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(updatedSubtotal);

      updateTotals();
    });

    // Subtotal cell
    const subtotal = document.createElement("td");
    let subtotalformattedPrice = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(newSubtotal);
    subtotal.textContent = subtotalformattedPrice;

    // Delete button cell
    const deleteCell = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-btn");
    deleteButton.innerHTML = `<img src="./assets/svg/delete.svg" alt="Delete Icon" />`;
    deleteButton.addEventListener("click", () => removeItem(item.id));

    deleteCell.appendChild(deleteButton);

    row.appendChild(productInfo);
    row.appendChild(priceCell);
    row.appendChild(quantityCell);
    row.appendChild(subtotal);
    row.appendChild(deleteCell);

    tableBody.appendChild(row);
  });

  updateTotals();
}

function updateTotals() {
  let actualSubtotal = cartData.reduce((sum, item) => {
    return sum + (item.price * item.quantity) / 100;
  }, 0);

  let finalSubTotal = document.getElementById("subtotal");
  let finalSubTotalFormat = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(actualSubtotal);
  finalSubTotal.innerHTML = finalSubTotalFormat;

  let finalTotal = document.getElementById("total");
  let finalTotalFormat = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(actualSubtotal);
  finalTotal.innerHTML = finalTotalFormat;
}

function removeItem(id) {
  cartData = cartData.filter((item) => item.id !== id);
  // Update the UI
  updateCartUI();
}

fetchData();
