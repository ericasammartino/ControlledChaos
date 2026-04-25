"use strict";

const hamburger = document.getElementById("hamburger");
const menu = document.getElementById("menu");
const container = document.querySelector(".service-card-container");
const cards = document.querySelectorAll(".service-card");
const dotsContainer = document.querySelector(".scroll-dots");
const steps = document.querySelectorAll(".about-sub");

// HAMBURGER TRANSITION
if (hamburger && menu) {
  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("open");
    menu.classList.toggle("show-menu");
  });
}

// FLIP CARD
document.querySelectorAll(".service-card").forEach((card) => {
  card.addEventListener("click", () => {
    document.querySelectorAll(".service-card.flipped").forEach((flippedCard) => {
      if (flippedCard !== card) flippedCard.classList.remove("flipped");
    });
    card.classList.toggle("flipped");
  });
});

if (container && dotsContainer && cards.length > 0) {
  // CREATE DOTS
  cards.forEach((_, i) => {
    const dot = document.createElement("button");
    if (i === 0) dot.classList.add("active");
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll(".scroll-dots button");

  // GET TRUE SCROLL STEP
  function getScrollStep() {
    const card = cards[0];
    const style = window.getComputedStyle(container);
    const gap = parseInt(style.gap, 10) || 0;
    return card.offsetWidth + gap;
  }

  // UPDATE ACTIVE DOT ON SCROLL
  container.addEventListener("scroll", () => {
    const step = getScrollStep();
    const index = Math.round(container.scrollLeft / step);

    dots.forEach((dot) => dot.classList.remove("active"));
    if (dots[index]) dots[index].classList.add("active");
  });

  // CLICK DOT -> SCROLL
  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      const step = getScrollStep();
      container.scrollTo({
        left: i * step,
        behavior: "smooth",
      });
    });
  });
}

// CHECK BOXES
steps.forEach((step) => {
  const img = step.querySelector("img");
  if (!img) return;

  const original = img.src;
  const hover = img.dataset.hover;
  if (!hover) return;

  step.addEventListener("mouseenter", () => {
    img.src = hover;
  });

  step.addEventListener("mouseleave", () => {
    img.src = original;
  });
});

// SHOP + CART
const products = [
  {
    id: "starter-bin-set",
    name: "Starter Bin Set",
    description: "Clear labeled bins for pantry, closet, or bathroom systems.",
    price: 39.0,
    image: "./images/starter-bin-set.jpg",
  },
  {
    id: "drawer-divider-kit",
    name: "Drawer Divider Kit",
    description:
      "Adjustable bamboo dividers to keep drawers neat and functional.",
    price: 29.0,
    image: "./images/drawer-divider-kit.jpg",
  },
  {
    id: "label-bundle",
    name: "Home Label Bundle",
    description: "Pre-printed and blank labels for fast, clean organization.",
    price: 19.0,
    image: "./images/label-bundle.jpg",
  },
];

const cart = new Map();

const productGrid = document.getElementById("product-grid");
const cartItems = document.getElementById("cart-items");
const cartSubtotal = document.getElementById("cart-subtotal");
const checkoutBtn = document.getElementById("checkout-btn");
const checkoutMessage = document.getElementById("checkout-message");

function money(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

function renderProducts() {
  if (!productGrid) return;

  const productCards = products
    .map(
      (p) => `
      <article class="product-card">
        <div class="product-image-wrap">
          <img src="${p.image}" alt="${p.name}" loading="lazy" />
        </div>
        <div class="product-body">
          <h4>${p.name}</h4>
          <p class="product-desc">${p.description}</p>
          <p class="product-price">${money(p.price)}</p>
          <button class="add-btn" data-add-id="${p.id}">Add to Cart</button>
        </div>
      </article>
    `
    )
    .join("");

  const actionCards = `
    <article class="product-card shop-action-card checkout">
      <h4>Ready to check out?</h4>
      <p>Jump to your cart summary and complete your order.</p>
      <a class="cta" href="#cart">Go to checkout</a>
    </article>
    <article class="product-card shop-action-card more-products">
      <h4>Need more options?</h4>
      <p>Browse the full product collection on the next page.</p>
      <a class="cta" href="/products">More products</a>
    </article>
  `;

  productGrid.innerHTML = productCards + actionCards;
}

function cartSubtotalValue() {
  let total = 0;
  for (const [id, qty] of cart.entries()) {
    const product = products.find((p) => p.id === id);
    if (product) total += product.price * qty;
  }
  return total;
}

function renderCart() {
  if (!cartItems || !cartSubtotal || !checkoutBtn) return;

  const rows = [];
  for (const [id, qty] of cart.entries()) {
    const p = products.find((x) => x.id === id);
    if (!p) continue;

    rows.push(`
      <li class="cart-item">
        <span>${p.name}</span>
        <div class="qty-controls">
          <button class="qty-btn" data-dec-id="${p.id}" aria-label="Decrease ${p.name} quantity">-</button>
          <span>${qty}</span>
          <button class="qty-btn" data-inc-id="${p.id}" aria-label="Increase ${p.name} quantity">+</button>
        </div>
        <button class="remove-btn" data-remove-id="${p.id}">Remove</button>
      </li>
    `);
  }

  cartItems.innerHTML = rows.length
    ? rows.join("")
    : "<li class='cart-empty'>Your cart is empty.</li>";
  cartSubtotal.textContent = money(cartSubtotalValue());
  checkoutBtn.disabled = cart.size === 0;
}

document.addEventListener("click", (e) => {
  const target = e.target;
  if (!(target instanceof Element)) return;

  const addId = target.getAttribute("data-add-id");
  const incId = target.getAttribute("data-inc-id");
  const decId = target.getAttribute("data-dec-id");
  const removeId = target.getAttribute("data-remove-id");

  if (addId) {
    cart.set(addId, (cart.get(addId) || 0) + 1);
    renderCart();
  }

  if (incId) {
    cart.set(incId, (cart.get(incId) || 0) + 1);
    renderCart();
  }

  if (decId) {
    const qty = cart.get(decId) || 0;
    if (qty <= 1) cart.delete(decId);
    else cart.set(decId, qty - 1);
    renderCart();
  }

  if (removeId) {
    cart.delete(removeId);
    renderCart();
  }
});

if (checkoutBtn) {
  checkoutBtn.addEventListener("click", async () => {
    if (!checkoutMessage) return;

    checkoutMessage.textContent = "";
    checkoutBtn.disabled = true;
    checkoutBtn.textContent = "Redirecting...";

    try {
      const items = [...cart.entries()].map(([id, quantity]) => ({
        id,
        quantity,
      }));

      const res = await fetch("/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      if (!res.ok) throw new Error("Could not start checkout");
      const data = await res.json();

      if (!data.url) throw new Error("Missing checkout URL");
      window.location.href = data.url;
    } catch (err) {
      checkoutMessage.textContent = "Checkout failed. Please try again.";
      checkoutBtn.disabled = false;
      checkoutBtn.textContent = "Checkout with Stripe";
    }
  });
}

renderProducts();
renderCart();
