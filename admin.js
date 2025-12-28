import { auth, db, storage } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { collection, getDocs, addDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
import {setPersistence, browserLocalPersistence, browserSessionPersistence } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
// =======================
// ====== DOM Elements ====
// =======================
const loginSection = document.getElementById("login-section");
const adminSection = document.getElementById("admin-section");
const loginBtn = document.getElementById("loginBtn");
const loginMsg = document.getElementById("loginMsg");

const nameInput = document.getElementById("name");
const priceInput = document.getElementById("price");
const categoryInput = document.getElementById("category");
const descriptionInput = document.getElementById("description");
const fileInput = document.getElementById("image-file");
const urlInput = document.getElementById("image-url");
const addBtn = document.getElementById("addBtn");
const msg = document.getElementById("msg");
const container = document.getElementById("products-container");

// =======================
// ===== Constants =======
// =======================
const ADMIN_EMAIL = "ahmedsayedsharaf0@gmail.com";

// =======================
// ===== Login Section ====
// =======================
loginBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const rememberMe = document.getElementById("rememberMe").checked; // ✅ حالة checkbox

  if (!email || !password) {
    loginMsg.textContent = "Please enter email and password";
    return;
  }

  try {
    // تحديد Persistence حسب اختيار المستخدم
    if (rememberMe) {
      await setPersistence(auth, browserLocalPersistence); // يحفظ الجلسة على الجهاز
    } else {
      await setPersistence(auth, browserSessionPersistence); // ينتهي عند غلق المتصفح
    }

    // تسجيل الدخول بعد تحديد Persistence
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // تحقق إذا الادمن
    if (email !== ADMIN_EMAIL) {
      loginMsg.textContent = "You are not admin!";
      await auth.signOut(); // خروج تلقائي لو مش الادمن
      return;
    }

    // دخول ناجح
    loginSection.style.display = "none";
    adminSection.style.display = "block";
    renderProducts();

  } catch (err) {
    if (err.code === "auth/wrong-password") {
      loginMsg.textContent = "كلمة المرور خاطئة، يرجى إعادة المحاولة";
    } else if (err.code === "auth/user-not-found") {
      loginMsg.textContent = "الإيميل غير موجود، يرجى التحقق";
    } else {
      loginMsg.textContent = "حدث خطأ، يرجى المحاولة مرة أخرى";
    }
    console.error(err);
  }
});

// =======================
// ===== Add Product ======
// =======================
addBtn.addEventListener("click", async () => {
  const name = nameInput.value.trim();
  const price = parseFloat(priceInput.value);
  const category = categoryInput.value.trim();
  const description = descriptionInput.value.trim();
  
  if (!name || isNaN(price)) {
    msg.textContent = "Enter valid name and price";
    return;
  }
  
  let imageUrl = "";
  
  // 1️⃣ أولاً: إذا دخل رابط Cloudinary
  if (urlInput.value.trim()) {
    imageUrl = urlInput.value.trim();
  }
  // 2️⃣ ثانيًا: إذا اختر ملف من الجهاز
  else if (fileInput.files[0]) {
    const file = fileInput.files[0];
    const storageRef = ref(storage, `products/${file.name}-${Date.now()}`);
    await uploadBytes(storageRef, file);
    imageUrl = await getDownloadURL(storageRef);
  }
  
  // إضافة المنتج
  await addDoc(collection(db, "products"), {
    name,
    price,
    category,
    description,
    image: imageUrl,
    createdAt: new Date()
  });
  
  // إعادة ضبط الحقول
  msg.textContent = "Product added!";
  nameInput.value = "";
  priceInput.value = "";
  categoryInput.value = "";
  descriptionInput.value = "";
  fileInput.value = "";
  urlInput.value = "";
  
  renderProducts();
});

// =======================
// ===== Render Products ===
// =======================
const renderProducts = async () => {
  const snapshot = await getDocs(collection(db, "products"));
  container.innerHTML = "";
  
  snapshot.docs.forEach(product => {
    const data = product.data();
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      ${data.image ? `<img src="${data.image}" alt="${data.name}" />` : ""}
      <h3>${data.name}</h3>
      <p>Price: ${data.price} EGP</p>
      <p>Category: ${data.category || ''}</p>
      <p>${data.description || ''}</p>
      <button class="delete-btn">Delete</button>
    `;
    
    // حذف المنتج
    card.querySelector(".delete-btn").addEventListener("click", async () => {
      await deleteDoc(doc(db, "products", product.id));
      renderProducts();
    });
    
    container.appendChild(card);
  });
};