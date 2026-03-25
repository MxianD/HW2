const nameInput = document.getElementById("name");
const greetingEl = document.getElementById("greeting");

nameInput.addEventListener("input", () => {
  const name = nameInput.value.trim();
  greetingEl.textContent = name ? `Hello ${name}!` : "";
});
