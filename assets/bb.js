/* BluBirdy interactions — scroll reveal, anatomy hotspots, hero parallax.
   Vanilla JS, no framework. Safe to load on every page (guards on presence). */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* ---- scroll reveal ---------------------------------------------------- */
  function initReveal() {
    var nodes = document.querySelectorAll('.bb [data-reveal]:not([data-in])');
    if (!nodes.length) return;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      nodes.forEach(function (el) { el.setAttribute('data-in', ''); });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.setAttribute('data-in', '');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -7% 0px' }
    );
    nodes.forEach(function (el) { io.observe(el); });

    // hero content reveals immediately (it's above the fold)
    document
      .querySelectorAll('.bb .bb-hero [data-reveal]:not([data-in])')
      .forEach(function (el) { el.setAttribute('data-in', ''); });

    // safety net: nothing should stay hidden
    setTimeout(function () {
      if (!document.querySelectorAll('.bb [data-reveal][data-in]').length) {
        document
          .querySelectorAll('.bb [data-reveal]')
          .forEach(function (el) { el.setAttribute('data-in', ''); });
      }
    }, 3500);
  }

  /* ---- anatomy hotspots ------------------------------------------------- */
  function initAnatomy() {
    document.querySelectorAll('.bb-anatomy').forEach(function (root) {
      var spots = root.querySelectorAll('[data-spot]');
      var dots = root.querySelectorAll('[data-spot-nav]');
      var kEl = root.querySelector('[data-spot-k]');
      var tEl = root.querySelector('[data-spot-t]');
      var dEl = root.querySelector('[data-spot-d]');
      if (!spots.length) return;

      function activate(i) {
        spots.forEach(function (s) {
          s.classList.toggle('on', s.getAttribute('data-spot') === String(i));
        });
        dots.forEach(function (d) {
          d.classList.toggle('on', d.getAttribute('data-spot-nav') === String(i));
        });
        var src = root.querySelector('[data-spot="' + i + '"]');
        if (!src) return;
        if (kEl) kEl.textContent = src.getAttribute('data-k') || '';
        if (tEl) tEl.textContent = src.getAttribute('data-t') || '';
        if (dEl) dEl.textContent = src.getAttribute('data-desc') || '';
      }

      spots.forEach(function (s) {
        var i = s.getAttribute('data-spot');
        s.addEventListener('mouseenter', function () { activate(i); });
        s.addEventListener('click', function () { activate(i); });
      });
      dots.forEach(function (d) {
        d.addEventListener('click', function () {
          activate(d.getAttribute('data-spot-nav'));
        });
      });
    });
  }

  /* ---- hero parallax ---------------------------------------------------- */
  function initParallax() {
    if (reduceMotion) return;
    var vis = document.querySelector('.bb-hero [data-parallax]');
    if (!vis) return;
    var on = function () {
      var y = Math.min(window.scrollY, 700);
      vis.style.setProperty('--py', y * 0.12 + 'px');
    };
    window.addEventListener('scroll', on, { passive: true });
    on();
  }

  /* ---- featured grid filter tabs --------------------------------------- */
  function initFilters() {
    document.querySelectorAll('[data-filter-group]').forEach(function (group) {
      var buttons = group.querySelectorAll('[data-filter]');
      var cards = group.querySelectorAll('.pc[data-cat]');
      if (!buttons.length) return;
      buttons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var val = btn.getAttribute('data-filter');
          buttons.forEach(function (b) { b.classList.toggle('on', b === btn); });
          var first = group.querySelector('[data-filter]') === btn;
          cards.forEach(function (card) {
            var show = first || card.getAttribute('data-cat') === val;
            if (show) card.removeAttribute('data-hide');
            else card.setAttribute('data-hide', '');
          });
        });
      });
    });
  }

  /* ---- transparent nav → glassy on scroll (homepage hero only) -------- */
  function initNav() {
    if (!document.body.classList.contains('bb-home')) return;
    var on = function () {
      document.body.classList.toggle('bb-nav-solid', window.scrollY > 40);
    };
    window.addEventListener('scroll', on, { passive: true });
    on();
  }

  /* ---- collection sort dropdown --------------------------------------- */
  function initSort() {
    document.querySelectorAll('[data-bb-sort]').forEach(function (sel) {
      sel.addEventListener('change', function () {
        var url = new URL(window.location.href);
        url.searchParams.set('sort_by', sel.value);
        url.searchParams.delete('page');
        window.location.href = url.toString();
      });
    });
  }

  function init() {
    initReveal();
    initAnatomy();
    initParallax();
    initFilters();
    initNav();
    initSort();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // re-init when sections are re-rendered in the theme editor
  document.addEventListener('shopify:section:load', init);
})();
