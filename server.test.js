const test = require("node:test");
const assert = require("node:assert/strict");
const { validateContactPayload } = require("./server");

test("validateContactPayload returns no errors for valid payload", () => {
  const payload = {
    name: "Jane Doe",
    email: "jane@example.com",
    subject: "General question",
    message: "Could you tell me more about your services?",
  };

  const result = validateContactPayload(payload);
  assert.deepEqual(result.errors, {});
  assert.equal(result.data.name, payload.name);
});

test("validateContactPayload returns errors for invalid payload", () => {
  const payload = {
    name: "A",
    email: "not-an-email",
    subject: "Hi",
    message: "short",
  };

  const result = validateContactPayload(payload);

  assert.equal(result.errors.name, "Full name must be between 2 and 80 characters.");
  assert.equal(result.errors.email, "Please enter a valid email address.");
  assert.equal(result.errors.subject, "Subject must be between 3 and 120 characters.");
  assert.equal(result.errors.message, "Message must be between 10 and 1000 characters.");
});
