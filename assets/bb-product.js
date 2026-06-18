/* BluBirdy product page — variant picker, quantity, gallery.
   Works alongside Dawn's product-form.js (which handles the AJAX add + cart
   notification). This only updates the selected variant id + UI. */
(function () {
  'use strict';

  function money(cents, currency) {
    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: currency || 'USD',
      }).format(cents / 100);
    } catch (e) {
      return '$' + (cents / 100).toFixed(2);
    }
  }

  class BBProduct {
    constructor(root) {
      this.root = root;
      this.currency = root.getAttribute('data-currency') || 'USD';
      this.variants = JSON.parse(
        root.querySelector('[data-bb-variants]').textContent
      );
      this.idInput = root.querySelector('input[name="id"]');
      this.qtyInput = root.querySelector('input[name="quantity"]');
      this.priceNow = root.querySelector('[data-bb-price-now]');
      this.priceWas = root.querySelector('[data-bb-price-was]');
      this.addBtn = root.querySelector('[data-bb-add]');
      this.addLabel = root.querySelector('[data-bb-add-label]');
      this.mainImg = root.querySelector('[data-bb-main-img]');
      this.optionGroups = Array.from(root.querySelectorAll('[data-option-index]'));

      this.bindOptions();
      this.bindQty();
      this.bindThumbs();
      this.update();
    }

    selectedValues() {
      return this.optionGroups.map(function (g) {
        var on = g.querySelector('.speed-chip.on');
        return on ? on.getAttribute('data-value') : null;
      });
    }

    currentVariant() {
      var sel = this.selectedValues();
      return this.variants.find(function (v) {
        return v.options.every(function (val, i) {
          return sel[i] == null || val === sel[i];
        });
      });
    }

    bindOptions() {
      var self = this;
      this.optionGroups.forEach(function (group) {
        group.querySelectorAll('.speed-chip').forEach(function (chip) {
          chip.addEventListener('click', function () {
            group.querySelectorAll('.speed-chip').forEach(function (c) {
              c.classList.toggle('on', c === chip);
            });
            var cur = group.querySelector('[data-opt-current]');
            if (cur) cur.textContent = chip.getAttribute('data-value');
            self.update();
          });
        });
      });
    }

    bindQty() {
      var self = this;
      this.root.querySelectorAll('[data-qty-step]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var step = parseInt(btn.getAttribute('data-qty-step'), 10);
          var val = Math.max(1, (parseInt(self.qtyInput.value, 10) || 1) + step);
          self.qtyInput.value = val;
          var label = self.root.querySelector('[data-qty-value]');
          if (label) label.textContent = val;
          self.update();
        });
      });
    }

    bindThumbs() {
      var self = this;
      this.thumbs = Array.from(this.root.querySelectorAll('[data-bb-thumb]'));
      this.thumbs.forEach(function (thumb) {
        thumb.addEventListener('click', function () {
          self.showThumb(thumb);
        });
      });
    }

    showThumb(thumb) {
      if (!this.mainImg) return;
      this.mainImg.src = thumb.getAttribute('data-src');
      var srcset = thumb.getAttribute('data-srcset');
      if (srcset) this.mainImg.setAttribute('srcset', srcset);
      this.thumbs.forEach(function (t) {
        t.classList.toggle('on', t === thumb);
      });
    }

    update() {
      var variant = this.currentVariant();
      var qty = Math.max(1, parseInt(this.qtyInput && this.qtyInput.value, 10) || 1);

      // chip availability (per value, given other selected options)
      var sel = this.selectedValues();
      var self = this;
      this.optionGroups.forEach(function (group) {
        var idx = parseInt(group.getAttribute('data-option-index'), 10);
        group.querySelectorAll('.speed-chip').forEach(function (chip) {
          var val = chip.getAttribute('data-value');
          var match = self.variants.filter(function (v) {
            return v.options[idx] === val && v.options.every(function (o, i) {
              return i === idx || sel[i] == null || o === sel[i];
            });
          });
          var exists = match.length > 0;
          var available = match.some(function (v) { return v.available; });
          chip.classList.toggle('soldout', exists && !available);
          chip.disabled = !exists;
        });
      });

      if (!variant) {
        this.setAdd(false, 'Unavailable');
        return;
      }
      if (this.idInput) this.idInput.value = variant.id;

      if (this.priceNow) this.priceNow.textContent = variant.price_formatted;
      if (this.priceWas) {
        if (variant.compare_at && variant.compare_at > variant.price) {
          this.priceWas.textContent = variant.compare_formatted;
          this.priceWas.hidden = false;
        } else {
          this.priceWas.hidden = true;
        }
      }

      // swap main image to the variant's media
      if (variant.media_id && this.thumbs) {
        var t = this.thumbs.find(function (th) {
          return th.getAttribute('data-media-id') === String(variant.media_id);
        });
        if (t) this.showThumb(t);
      }

      if (variant.available) {
        this.setAdd(true, 'Add to cart · ' + money(variant.price * qty, this.currency));
      } else {
        this.setAdd(false, 'Sold out');
      }
    }

    setAdd(enabled, label) {
      if (this.addLabel) this.addLabel.textContent = label;
      if (this.addBtn) {
        this.addBtn.disabled = !enabled;
        this.addBtn.setAttribute('aria-disabled', String(!enabled));
      }
    }
  }

  function init() {
    document.querySelectorAll('[data-bb-product]').forEach(function (root) {
      if (!root.bbInit) {
        root.bbInit = true;
        new BBProduct(root);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  document.addEventListener('shopify:section:load', init);
})();
