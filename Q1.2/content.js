/**
 * Q1.2: jQuery is loaded before this script (see manifest).
 * Replaces visible text "Chrome" → "Firefox" and swaps the header logo image.
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

function runTransforms() {
  replaceChromeInTextNodes($("body")[0]);
  swapHeaderLogoToFirefox();
}

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
