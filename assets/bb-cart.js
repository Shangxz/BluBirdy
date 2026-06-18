/* BluBirdy cart page — quantity steppers + remove via the cart AJAX API. */
(function () {
  'use strict';

  function setBusy(root, busy) {
    if (root) root.classList.toggle('bb-cart-busy', busy);
  }

  function change(line, quantity, root) {
    setBusy(root, true);
    fetch(window.Shopify && window.Shopify.routes
      ? window.Shopify.routes.root + 'cart/change.js'
      : '/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ line: line, quantity: quantity }),
    })
      .then(function (r) { return r.json(); })
      .then(function () { window.location.reload(); })
      .catch(function () { setBusy(root, false); window.location.reload(); });
  }

  function init() {
    var root = document.querySelector('[data-bb-cart]');
    if (!root) return;

    root.querySelectorAll('[data-bb-cart-step]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var line = parseInt(btn.getAttribute('data-line'), 10);
        var qty = parseInt(btn.getAttribute('data-qty'), 10);
        var step = parseInt(btn.getAttribute('data-bb-cart-step'), 10);
        var next = Math.max(0, qty + step);
        change(line, next, root);
      });
    });

    root.querySelectorAll('[data-bb-cart-remove]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        change(parseInt(btn.getAttribute('data-line'), 10), 0, root);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  document.addEventListener('shopify:section:load', init);
})();
