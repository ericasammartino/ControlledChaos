"use strict";

const products = [
  {
    id: "bins-01",
    name: "Acrylic Pantry Bin",
    description: "Clear stackable bin for cabinets, pantries, and bathrooms.",
    price: 18.0,
    image: "./product-bin.jpg",
  },
  {
    id: "labels-01",
    name: "Minimal Label Set",
    description: "Waterproof organizing labels with clean, modern typography.",
    price: 12.0,
    image: "./product-labels.jpg",
  },
  {
    id: "drawer-01",
    name: "Drawer Divider Kit",
    description: "Adjustable dividers for kitchen, office, and closet drawers.",
    price: 26.0,
    image: "./product-dividers.jpg",
  },
  {
    id: "travel-01",
    name: "Packing Cube Set",
    description: "Lightweight packing cubes to keep travel essentials sorted.",
    price: 22.0,
    image: "./product-cubes.jpg",
  },
];

const cart = new Map();

const productGrid = document.getElementById("product-grid");
const cartItems = document.getElementById("cart-items");
const cartSubtotal = document.getElementById("cart-subtotal");
const checkoutButton = document.getElementById("checkout-btn");
const checkoutMessage = document.getElementById("checkout-message");
const hamburger = document.getElementById("hamburger");
const menu = document.getElementById("menu");

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function setFallbackImage(event) {
  event.target.src = "https://placehold.co/700x500/d6e7ec/003e5b?text=Product";
}

function renderProducts() {
  if (!productGrid) return;

  const productMarkup = products
    .map(
      (product) => `
      <article class="shop-card" data-product-id="${product.id}">
        <img src="${product.image}" alt="${product.name}" />
        <div class="shop-card-content">
          <h4>${product.name}</h4>
          <p>${product.description}</p>
          <p class="shop-card-price">${formatCurrency(product.price)}</p>
          <button class="cta add-to-cart-btn" type="button" data-add-id="${product.id}">
            Add to cart
          </button>
        </div>
      </article>
    `
    )
    .join("");

  const actionMarkup = `
    <article class="shop-action-card checkout">
      <h4>Ready to check out?</h4>
      <p>Jump to your cart summary and complete your order.</p>
      <a class="cta" href="#cart">Go to checkout</a>
    </article>
    <article class="shop-action-card more-products">
      <h4>Need more options?</h4>
      <p>Browse the full product collection on the next page.</p>
      <a class="cta" href="/products">More products</a>
    </article>
  `;

  productGrid.innerHTML = productMarkup + actionMarkup;

  productGrid.querySelectorAll("img").forEach((img) => {
    img.addEventListener("error", setFallbackImage, { once: true });
  });

  productGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-add-id]");
    if (!button) return;
    const productId = button.getAttribute("data-add-id");
    addToCart(productId);
  });
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;

  const currentQty = cart.get(productId) ?? 0;
  cart.set(productId, currentQty + 1);
  renderCart();
}

function removeFromCart(productId) {
  const currentQty = cart.get(productId);
  if (!currentQty) return;

  if (currentQty === 1) {
    cart.delete(productId);
  } else {
    cart.set(productId, currentQty - 1);
  }

  renderCart();
}

function renderCart() {
  if (!cartItems || !cartSubtotal || !checkoutButton) return;

  if (cart.size === 0) {
    cartItems.innerHTML = "<li class='cart-empty'>Your cart is empty.</li>";
    cartSubtotal.textContent = formatCurrency(0);
    checkoutButton.disabled = true;
    return;
  }

  const itemsMarkup = [...cart.entries()]
    .map(([productId, qty]) => {
      const product = products.find((item) => item.id === productId);
      if (!product) return "";

      return `
        <li class="cart-item">
          <div>
            <p class="cart-item-name">${product.name}</p>
            <p class="cart-item-meta">${qty} × ${formatCurrency(product.price)}</p>
          </div>
          <button type="button" class="cart-remove-btn" data-remove-id="${product.id}" aria-label="Remove one ${product.name}">
            &minus;
          </button>
        </li>
      `;
    })
    .join("");

  cartItems.innerHTML = itemsMarkup;

  const subtotal = [...cart.entries()].reduce((total, [productId, qty]) => {
    const product = products.find((item) => item.id === productId);
    return total + (product ? product.price * qty : 0);
  }, 0);

  cartSubtotal.textContent = formatCurrency(subtotal);
  checkoutButton.disabled = false;
}

function bindCartEvents() {
  if (!cartItems || !checkoutButton || !checkoutMessage) return;

  cartItems.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-id]");
    if (!button) return;
    const productId = button.getAttribute("data-remove-id");
    removeFromCart(productId);
  });

  checkoutButton.addEventListener("click", () => {
    checkoutMessage.textContent =
      "Checkout routing can be connected next (Stripe/cart page).";
  });
}

function bindNav() {
  if (!hamburger || !menu) return;

  const menuLinks = menu.querySelectorAll("a");

  hamburger.addEventListener("click", () => {
    const isOpen = hamburger.classList.toggle("open");
    menu.classList.toggle("show-menu", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
  });

  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("open");
      menu.classList.remove("show-menu");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });
}

function bindServiceCards() {
  document.querySelectorAll(".service-card").forEach((card) => {
    const openButton = card.querySelector('[data-flip="open"]');
    const closeButton = card.querySelector('[data-flip="close"]');

    openButton?.addEventListener("click", () => card.classList.add("flipped"));
    closeButton?.addEventListener("click", () => card.classList.remove("flipped"));
  });
}

renderProducts();
renderCart();
bindCartEvents();
bindNav();
bindServiceCards();
