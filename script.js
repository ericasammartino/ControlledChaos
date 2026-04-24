const slider = document.getElementById("serviceSlider");
const prevSlide = document.getElementById("prevSlide");
const nextSlide = document.getElementById("nextSlide");
const yearEl = document.getElementById("year");
const checkoutButtons = document.querySelectorAll(".checkout-btn");
const checkoutMessage = document.getElementById("checkoutMessage");

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

if (slider && prevSlide && nextSlide) {
  const scrollByCard = () => {
    const card = slider.querySelector(".service-card");
    if (!card) {
      return 280;
    }
    return card.getBoundingClientRect().width + 16;
  };

  prevSlide.addEventListener("click", () => {
    slider.scrollBy({ left: -scrollByCard(), behavior: "smooth" });
  });

  nextSlide.addEventListener("click", () => {
    slider.scrollBy({ left: scrollByCard(), behavior: "smooth" });
  });
}

const renderCheckoutMessage = () => {
  if (!checkoutMessage) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const status = params.get("checkout");

  if (status === "success") {
    checkoutMessage.textContent =
      "Payment successful! Thank you for your order. We will send your shipment details soon.";
    checkoutMessage.classList.add("checkout-message", "checkout-message-success");
    checkoutMessage.classList.remove("checkout-message-error");
  } else if (status === "cancelled") {
    checkoutMessage.textContent = "Checkout cancelled. Your cart has not been charged.";
    checkoutMessage.classList.add("checkout-message", "checkout-message-error");
    checkoutMessage.classList.remove("checkout-message-success");
  } else {
    checkoutMessage.textContent = "";
    checkoutMessage.className = "checkout-message";
  }
};

const handleCheckout = async (button) => {
  const productId = button.dataset.productId;
  if (!productId) {
    return;
  }

  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = "Redirecting...";

  try {
    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ productId })
    });

    const result = await response.json();
    if (!response.ok || !result.url) {
      throw new Error(result.error || "Unable to start Stripe Checkout.");
    }

    window.location.href = result.url;
  } catch (error) {
    if (checkoutMessage) {
      checkoutMessage.textContent = error.message;
      checkoutMessage.classList.add("checkout-message", "checkout-message-error");
      checkoutMessage.classList.remove("checkout-message-success");
    }
    button.disabled = false;
    button.textContent = originalText;
  }
};

if (checkoutButtons.length > 0) {
  checkoutButtons.forEach((button) => {
    button.addEventListener("click", () => handleCheckout(button));
  });
}

renderCheckoutMessage();
