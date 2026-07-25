(function () {
  var UNLOCKED_KEY = "slidexl_offer_unlocked";
  var EMAIL_KEY = "slidexl_offer_email";
  var DISMISSED_KEY = "slidexl_popup_dismissed";
  var ENDS_KEY = "slidexl_offer_ends_at";
  var DURATION_MS = 390000;

  function storageGet(key) {
    try {
      return sessionStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  function storageSet(key, value) {
    try {
      sessionStorage.setItem(key, value);
    } catch (e) {}
  }

  function isUnlocked() {
    return storageGet(UNLOCKED_KEY) === "1";
  }

  function unlockOffer(email) {
    storageSet(UNLOCKED_KEY, "1");
    if (email) storageSet(EMAIL_KEY, email);
    if (!storageGet(ENDS_KEY)) {
      storageSet(ENDS_KEY, String(Date.now() + DURATION_MS));
    }
    document.documentElement.classList.add("offer-unlocked");
    window.dispatchEvent(new CustomEvent("slidexl:offer-unlocked"));
  }

  function showStep(root, name) {
    root.querySelectorAll("[data-deal-step]").forEach(function (step) {
      var active = step.getAttribute("data-deal-step") === name;
      step.hidden = !active;
      step.classList.toggle("is-active", active);
    });
  }

  function openPopup(root) {
    root.hidden = false;
    root.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("deal-popup-open");
    var first = root.querySelector("[data-deal-pick], .deal-popup__input, .deal-popup__claim");
    if (first) window.setTimeout(function () { first.focus(); }, 50);
  }

  function closePopup(root, markDismissed) {
    root.hidden = true;
    root.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("deal-popup-open");
    if (markDismissed) storageSet(DISMISSED_KEY, "1");
  }

  function submitEmail(form) {
    var errorEl = form.querySelector("[data-deal-error]");
    if (errorEl) {
      errorEl.hidden = true;
      errorEl.textContent = "";
    }

    var emailInput = form.querySelector('input[type="email"]');
    var email = emailInput ? String(emailInput.value || "").trim() : "";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      if (errorEl) {
        errorEl.hidden = false;
        errorEl.textContent = "Enter a valid email address to unlock your deal.";
      }
      return Promise.reject(new Error("invalid-email"));
    }

    var body = new FormData(form);
    return fetch(form.action || "/contact", {
      method: "POST",
      body: body,
      headers: { Accept: "application/json" },
    })
      .catch(function () {
        /* Still unlock locally if Shopify rejects/network fails */
        return null;
      })
      .then(function () {
        return email;
      });
  }

  function init() {
    var root = document.querySelector("[data-deal-popup]");
    if (!root) return;

    if (isUnlocked()) {
      document.documentElement.classList.add("offer-unlocked");
      return;
    }

    if (storageGet(DISMISSED_KEY) === "1") return;

    var delay = Number(root.getAttribute("data-delay-ms"));
    if (!Number.isFinite(delay) || delay < 0) delay = 1500;

    window.setTimeout(function () {
      if (isUnlocked() || storageGet(DISMISSED_KEY) === "1") return;
      openPopup(root);
      showStep(root, "pick");
    }, delay);

    root.querySelectorAll("[data-deal-close]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        closePopup(root, true);
      });
    });

    root.querySelectorAll("[data-deal-pick]").forEach(function (box) {
      box.addEventListener("click", function () {
        root.querySelectorAll("[data-deal-pick]").forEach(function (b) {
          b.disabled = true;
          b.classList.remove("is-selected");
        });
        box.classList.add("is-selected");
        box.classList.add("is-flipping");
        window.setTimeout(function () {
          showStep(root, "email");
          var input = root.querySelector(".deal-popup__input");
          if (input) input.focus();
        }, 420);
      });
    });

    var form = root.querySelector(".deal-popup__form");
    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = "Unlocking…";
        }
        submitEmail(form)
          .then(function (email) {
            unlockOffer(email);
            showStep(root, "reveal");
            var claim = root.querySelector(".deal-popup__claim");
            if (claim) claim.focus();
          })
          .catch(function () {
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.textContent = "Continue";
            }
          });
      });
    }

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !root.hidden) {
        closePopup(root, true);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
