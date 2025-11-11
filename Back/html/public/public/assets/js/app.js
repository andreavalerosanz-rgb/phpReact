(function () {
  const radios = document.querySelectorAll('input[name="tripType"]');
  const blocks = document.querySelectorAll("[data-block]");
  function toggleBlocks() {
    const el = document.querySelector('input[name="tripType"]:checked');
    const val = el ? el.value : null;
    blocks.forEach((b) => (b.hidden = b.getAttribute("data-block") !== val));
  }
  radios.forEach((r) => r.addEventListener("change", toggleBlocks));
  toggleBlocks();
})();
