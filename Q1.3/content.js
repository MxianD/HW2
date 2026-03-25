/**
 * Q1.2 behavior + Q1.3: handle REPLACE_TEXT messages from the popup.
 */
function replaceChromeInTextNodes(root) {
  $(root)
    .find("*")
    .addBack()
    .contents()
    .filter(function () {
      return this.nodeType === Node.TEXT_NODE && this.textContent.includes("Chrome");
    })
    .each(function () {
      this.textContent = this.textContent.replace(/Chrome/g, "Firefox");
    });
}

function swapHeaderLogoToFirefox() {
  const logoUrl = chrome.runtime.getURL("firefox-logo.svg");
  const $candidates = $(
    [
      "a[href='https://developer.chrome.com/'] img",
      "devsite-header a[href='/'] img",
      "header.devsite-header img",
      ".devsite-header-icon-link img",
      "header img",
    ].join(",")
  );

  $candidates.each(function () {
    const $img = $(this);
    if ($img.closest("nav, footer").length) return;
    $img.attr("src", logoUrl);
    return false;
  });
}

function applyCustomReplace(match, replaceWith) {
  if (!match) return;
  const esc = match.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(esc, "g");
  $("body")
    .find("*")
    .addBack()
    .contents()
    .filter(function () {
      return this.nodeType === Node.TEXT_NODE && this.textContent.includes(match);
    })
    .each(function () {
      this.textContent = this.textContent.replace(re, replaceWith);
    });
}

function runTransforms() {
  replaceChromeInTextNodes($("body")[0]);
  swapHeaderLogoToFirefox();
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.type === "REPLACE_TEXT") {
    applyCustomReplace(msg.match, msg.replaceWith ?? "");
    sendResponse({ ok: true });
    return true;
  }
});

$(function () {
  runTransforms();

  const target = document.body;
  if (!target) return;

  const obs = new MutationObserver(() => {
    replaceChromeInTextNodes(document.body);
    swapHeaderLogoToFirefox();
  });
  obs.observe(target, { childList: true, subtree: true });
});
