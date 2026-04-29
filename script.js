const form = document.getElementById("contact-form");
const submitButton = document.getElementById("submit-button");
const formStatus = document.getElementById("form-status");

const fields = [
  { id: "name", label: "Full name" },
  { id: "email", label: "Email address" },
  { id: "subject", label: "Subject" },
  { id: "message", label: "Message" },
];

function getField(id) {
  return document.getElementById(id);
}

function getErrorElement(id) {
  return document.getElementById(`${id}-error`);
}

function setFieldError(id, message) {
  const field = getField(id);
  const errorElement = getErrorElement(id);

  if (!field || !errorElement) {
    return;
  }

  errorElement.textContent = message;

  if (message) {
    field.classList.add("invalid");
    field.setAttribute("aria-invalid", "true");
  } else {
    field.classList.remove("invalid");
    field.removeAttribute("aria-invalid");
  }
}

function clearAllErrors() {
  fields.forEach((field) => {
    setFieldError(field.id, "");
  });
}

function validateField(field) {
  const input = getField(field.id);
  if (!input) {
    return true;
  }

  if (input.validity.valueMissing) {
    setFieldError(field.id, `${field.label} is required.`);
    return false;
  }

  if (input.validity.typeMismatch) {
    setFieldError(field.id, "Please enter a valid email address.");
    return false;
  }

  if (input.validity.tooShort) {
    const minimum = input.getAttribute("minlength");
    setFieldError(field.id, `${field.label} must be at least ${minimum} characters.`);
    return false;
  }

  if (input.validity.tooLong) {
    const maximum = input.getAttribute("maxlength");
    setFieldError(field.id, `${field.label} must be ${maximum} characters or fewer.`);
    return false;
  }

  setFieldError(field.id, "");
  return true;
}

function validateForm() {
  let isValid = true;

  fields.forEach((field) => {
    const fieldIsValid = validateField(field);
    if (!fieldIsValid) {
      isValid = false;
    }
  });

  return isValid;
}

function setFormStatus(message, type) {
  formStatus.textContent = message;
  formStatus.classList.remove("success", "error");
  if (type) {
    formStatus.classList.add(type);
  }
}

fields.forEach((field) => {
  const input = getField(field.id);
  if (!input) {
    return;
  }

  input.addEventListener("input", () => {
    validateField(field);
  });
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearAllErrors();
  setFormStatus("", "");

  const isFormValid = validateForm();
  if (!isFormValid) {
    setFormStatus("Please fix the highlighted fields and try again.", "error");
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Sending...";

  try {
    // Replace this with an actual API endpoint in production.
    await new Promise((resolve) => setTimeout(resolve, 800));
    form.reset();
    setFormStatus("Thanks! Your message has been sent successfully.", "success");
  } catch (error) {
    setFormStatus("Something went wrong. Please try again.", "error");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Send Message";
  }
});
