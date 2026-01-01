import { db } from "/js/firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const container = document.getElementById("products");
const loading = document.getElementById("loading");

loading.style.display = "none";
container.style.display = "grid";

const WHATSAPP_NUMBER = "201009564498";

const fetchProducts = async () => {
  const snapshot = await getDocs(collection(db, "products"));
  container.innerHTML = "";

  if (snapshot.empty) {
    container.innerHTML = "<p>No products available</p>";
    return;
  }

  snapshot.docs.forEach(product => {
    const data = product.data();
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      ${data.image ? `<img src="${data.image}" alt="${data.name}" loading="lazy" />` : ""}
      <h3>${data.name}</h3>
      <p>Price: ${data.price} EGP</p>
      <p>Category: ${data.category || 'N/A'}</p>
      <p>${data.description || ''}</p>
      <button class="buy-btn">Buy</button>
    `;

    // Buy → WhatsApp
    card.querySelector(".buy-btn").addEventListener("click", (e) => {
      e.stopPropagation(); // عشان ميحولش لصفحة المنتج
      const message = encodeURIComponent(
        `مرحبًا، أريد شراء المنتج: ${data.name}\nالسعر: ${data.price} جنيه`
      );
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
    });

    // الضغط على الكارد → صفحة المنتج
    card.addEventListener("click", () => {
      window.location.href = `product.html?id=${product.id}`;
    });

    container.appendChild(card);
  });
};

fetchProducts();
