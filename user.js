import { db } from "firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const container = document.getElementById("products");

const loading = document.getElementById("loading");

// لما المنتجات تتحمل → نخفي الـ Spinner ونظهر المنتجات
loading.style.display = "none";
container.style.display = "grid";

const WHATSAPP_NUMBER = "+201009564498"; // رقم الواتساب

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
      ${data.image ? `<img src="${data.image}" alt="${data.name}" />` : ""}
      <h3>${data.name}</h3>
      <p>Price: ${data.price} EGP</p>
      <p>Category: ${data.category || 'N/A'}</p>
      <p>${data.description || ''}</p>
      <button class="buy-btn">Buy</button>
    `;
    
    // زر Buy → يفتح WhatsApp مع رسالة جاهزة
    card.querySelector(".buy-btn").addEventListener("click", () => {
      const message = encodeURIComponent(`مرحبًا، أريد شراء المنتج: ${data.name}, السعر: ${data.price} جنيه`);
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
    });
    
    // عند الضغط على البطاقة → صفحة المنتج
    card.addEventListener("click", (e) => {
      if (!e.target.classList.contains("buy-btn")) {
        window.location.href = `product.html?id=${product.id}`;
      }
    });
    
    container.appendChild(card);
  });
};

fetchProducts();
