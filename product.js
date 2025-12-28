/*/
import { db } from "/js/firebase.js";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  limit
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const container = document.getElementById("product-details");
const similarContainer = document.getElementById("similar-products");
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

const WHATSAPP_NUMBER = "201009564498";

const fetchProduct = async () => {
  const docRef = doc(db, "products", productId);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    container.innerHTML = "<p>Product not found</p>";
    return;
  }
  
  const product = docSnap.data();
  
  container.innerHTML = `
    <div class="product-page">
      <img src="${product.image}" id="productImage" />

      <div class="info">
        <h2>${product.name}</h2>
        <p class="price">${product.price} EGP</p>
        <p>${product.description || ""}</p>

        <label>Size</label>
        <select id="sizeSelect">
          ${(product.sizes || []).map(s => `<option>${s}</option>`).join("")}
        </select>

        <label>Color</label>
        <select id="colorSelect">
          ${(product.colors || []).map(c => `<option>${c}</option>`).join("")}
        </select>

        <button id="buyBtn">Buy on WhatsApp</button>
      </div>
    </div>

    <h3>Customer Reviews</h3>
    <div class="reviews">
      ⭐⭐⭐⭐☆ – Very good quality <br>
      ⭐⭐⭐⭐⭐ – Worth the price
    </div>
  `;
  
  // Zoom image
  const img = document.getElementById("productImage");
  img.onclick = () => img.classList.toggle("zoomed");
  
  // Buy button
  document.getElementById("buyBtn").onclick = () => {
    const size = document.getElementById("sizeSelect").value;
    const color = document.getElementById("colorSelect").value;
    
    const msg = encodeURIComponent(
      `I want to buy:\n${product.name}\nSize: ${size}\nColor: ${color}\nPrice: ${product.price} EGP`
    );
    
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  };
  
  loadSimilar(product.category);
};

const loadSimilar = async (category) => {
  const q = query(
    collection(db, "products"),
    where("category", "==", category),
    limit(4)
  );
  
  const snap = await getDocs(q);
  similarContainer.innerHTML = "";
  
  snap.forEach(doc => {
    const p = doc.data();
    similarContainer.innerHTML += `
      <div class="similar-card">
        <img src="${p.image}">
        <p>${p.name}</p>
        <p>${p.price} EGP</p>
      </div>
    `;
  });
};

fetchProduct();
/*/

import { db } from "/js/firebase.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const container = document.getElementById("product-details");
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

const WHATSAPP_NUMBER = "201009564498";

const fetchProduct = async () => {
  if (!productId) {
    container.innerHTML = "<p>Invalid product ID</p>";
    return;
  }

  const docRef = doc(db, "products", productId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    container.innerHTML = "<p>Product not found</p>";
    return;
  }

  const product = docSnap.data();

  container.innerHTML = `
    <div class="product-page">
      ${product.image ? `<img src="${product.image}" id="productImage" />` : ""}
      <div class="info">
        <h2>${product.name}</h2>
        <p class="price">${product.price} EGP</p>
        <p>${product.description || ""}</p>

        ${product.sizes ? `
          <label>Size</label>
          <select id="sizeSelect">
            ${(product.sizes || []).map(s => `<option>${s}</option>`).join("")}
          </select>
        ` : ""}

        ${product.colors ? `
          <label>Color</label>
          <select id="colorSelect">
            ${(product.colors || []).map(c => `<option>${c}</option>`).join("")}
          </select>
        ` : ""}

        <button id="buyBtn">Buy on WhatsApp</button>
      </div>
    </div>
  `;

  // Zoom على الصورة
  const img = document.getElementById("productImage");
  if (img) img.onclick = () => img.classList.toggle("zoomed");

  // Buy button
  const buyBtn = document.getElementById("buyBtn");
  if (buyBtn) {
    buyBtn.onclick = () => {
      const size = document.getElementById("sizeSelect")?.value || "";
      const color = document.getElementById("colorSelect")?.value || "";

      const msg = encodeURIComponent(
        `مرحبًا، أريد شراء المنتج:\n${product.name}\n${size ? "Size: " + size + "\n" : ""}${color ? "Color: " + color + "\n" : ""}السعر: ${product.price} EGP`
      );

      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
    };
  }
};

fetchProduct();
