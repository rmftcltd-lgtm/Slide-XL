(function () {
  var UNLOCKED_KEY = "slidexl_offer_unlocked";
  var EMAIL_KEY = "slidexl_offer_email";
  var DISMISSED_KEY = "slidexl_popup_dismissed";
  var LAUNCHER_DISMISSED_KEY = "slidexl_launcher_dismissed";
  var ENDS_KEY = "slidexl_offer_ends_at";
  var DURATION_MS = 390000;
  var root = null;

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

  function storageRemove(key) {
    try {
      sessionStorage.removeItem(key);
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
    syncLauncher();
  }

  function showStep(name) {
    if (!root) return;
    root.querySelectorAll("[data-deal-step]").forEach(function (step) {
      var active = step.getAttribute("data-deal-step") === name;
      step.hidden = !active;
      step.classList.toggle("is-active", active);
    });
  }

  function openPopup(step) {
    if (!root) return;
    root.hidden = false;
    root.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("deal-popup-open");
    storageRemove(DISMISSED_KEY);
    showStep(step || (isUnlocked() ? "reveal" : "pick"));
    syncLauncher();
    var first = root.querySelector(
      "[data-deal-step].is-active [data-deal-pick], [data-deal-step].is-active .deal-popup__input, [data-deal-step].is-active .deal-popup__claim"
    );
    if (first) window.setTimeout(function () { first.focus(); }, 50);
  }

  function closePopup(markDismissed) {
    if (!root) return;
    root.hidden = true;
    root.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("deal-popup-open");
    if (markDismissed) storageSet(DISMISSED_KEY, "1");
    syncLauncher();
  }

  function syncLauncher() {
    var launcher = document.querySelector("[data-deal-launcher]");
    if (!launcher) return;
    if (storageGet(LAUNCHER_DISMISSED_KEY) === "1" || isUnlocked()) {
      launcher.hidden = true;
      return;
    }
    // Show after popup is dismissed or closed — always available until unlocked
    var popupOpen = root && !root.hidden;
    launcher.hidden = !!popupOpen;
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
        return null;
      })
      .then(function () {
        return email;
      });
  }

  function bindPopup() {
    root.querySelectorAll("[data-deal-close]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        closePopup(true);
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
          showStep("email");
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
            showStep("reveal");
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
      if (event.key === "Escape" && root && !root.hidden) {
        closePopup(true);
      }
    });
  }

  function bindLauncher() {
    var launcher = document.querySelector("[data-deal-launcher]");
    if (!launcher) return;

    launcher.addEventListener("click", function (event) {
      if (event.target && event.target.closest("[data-deal-launcher-dismiss]")) {
        event.preventDefault();
        event.stopPropagation();
        storageSet(LAUNCHER_DISMISSED_KEY, "1");
        launcher.hidden = true;
        return;
      }
      openPopup(isUnlocked() ? "reveal" : "pick");
    });
  }

  function init() {
    root = document.querySelector("[data-deal-popup]");
    if (!root) {
      bindLauncher();
      syncLauncher();
      return;
    }

    bindPopup();
    bindLauncher();

    if (isUnlocked()) {
      document.documentElement.classList.add("offer-unlocked");
      syncLauncher();
      return;
    }

    var delay = Number(root.getAttribute("data-delay-ms"));
    if (!Number.isFinite(delay) || delay < 0) delay = 1500;

    if (storageGet(DISMISSED_KEY) !== "1") {
      window.setTimeout(function () {
        if (isUnlocked() || storageGet(DISMISSED_KEY) === "1") {
          syncLauncher();
          return;
        }
        openPopup("pick");
      }, delay);
    } else {
      syncLauncher();
    }

    window.addEventListener("slidexl:open-deal-popup", function () {
      openPopup(isUnlocked() ? "reveal" : "pick");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
