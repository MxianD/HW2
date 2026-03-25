const input = document.getElementById("reportUrl");
const msg = document.getElementById("msg");

chrome.storage.local.get(["reportUrl"], (r) => {
  if (r.reportUrl) input.value = r.reportUrl;
});

document.getElementById("save").addEventListener("click", () => {
  const v = input.value.trim();
  chrome.storage.local.set({ reportUrl: v }, () => {
    msg.textContent = "Saved.";
  });
});
