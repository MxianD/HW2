const nameInput = document.getElementById("name");
const greetingEl = document.getElementById("greeting");
const matchInput = document.getElementById("match");
const replaceInput = document.getElementById("replaceWith");
const applyBtn = document.getElementById("applyReplace");
const statusEl = document.getElementById("status");

nameInput.addEventListener("input", () => {
  const name = nameInput.value.trim();
  greetingEl.textContent = name ? `Hello ${name}!` : "";
});

applyBtn.addEventListener("click", async () => {
  statusEl.textContent = "";
  const match = matchInput.value;
  const replaceWith = replaceInput.value;

  if (!match) {
    statusEl.textContent = "Enter text to match.";
    return;
  }

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) {
    statusEl.textContent = "No active tab.";
    return;
  }

  try {
    const res = await chrome.tabs.sendMessage(tab.id, {
      type: "REPLACE_TEXT",
      match,
      replaceWith,
    });
    statusEl.textContent = res?.ok ? "Replace request sent." : "Could not replace.";
  } catch {
    statusEl.textContent =
      "Message failed — open a page under developer.chrome.com/docs/extensions/ and reload.";
  }
});
