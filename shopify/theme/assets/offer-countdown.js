(function () {
  var STORAGE_KEY = "slidexl_offer_ends_at";
  var UNLOCKED_KEY = "slidexl_offer_unlocked";
  var DEFAULT_MS = 390000; // 6.5 minutes
  var tickTimer = null;
  var lastSpokenMinute = null;

  function pad(n) {
    return String(n).padStart(2, "0");
  }

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

  function readDuration(nodes) {
    var first = nodes[0];
    if (!first) return DEFAULT_MS;
    var raw = Number(first.getAttribute("data-duration-ms"));
    return Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_MS;
  }

  function getEndsAt(durationMs) {
    var stored = storageGet(STORAGE_KEY);
    var ends = stored ? Number(stored) : NaN;
    if (!Number.isFinite(ends)) {
      ends = Date.now() + durationMs;
      storageSet(STORAGE_KEY, String(ends));
    }
    return ends;
  }

  function render(nodes, remainingMs) {
    var totalSec = Math.max(0, Math.ceil(remainingMs / 1000));
    var mins = Math.floor(totalSec / 60);
    var secs = totalSec % 60;
    var urgent = totalSec > 0 && totalSec <= 60;
    var expired = totalSec === 0;

    nodes.forEach(function (node) {
      node.hidden = false;
      node.classList.toggle("is-urgent", urgent || expired);
      node.classList.toggle("is-expired", expired);

      var minsEl = node.querySelector("[data-offer-mins]");
      var secsEl = node.querySelector("[data-offer-secs]");
      var hintEl = node.querySelector(".offer-countdown__hint");
      var srEl = node.querySelector("[data-offer-sr]");

      if (minsEl) minsEl.textContent = pad(mins);
      if (secsEl) secsEl.textContent = pad(secs);

      if (hintEl) {
        hintEl.textContent = expired
          ? "Time's up — checkout now to keep the special bundle price."
          : "Checkout before the timer ends to lock in this deal.";
      }

      if (srEl && mins !== lastSpokenMinute) {
        srEl.textContent = expired
          ? "Special bundle price timer ended. Checkout now to keep the deal."
          : "Special bundle price reserved for " +
            mins +
            " minutes and " +
            secs +
            " seconds.";
      }
    });

    lastSpokenMinute = mins;
  }

  function hideAll(nodes) {
    nodes.forEach(function (node) {
      node.hidden = true;
    });
  }

  function start() {
    var nodes = Array.prototype.slice.call(
      document.querySelectorAll("[data-offer-countdown]")
    );
    if (!nodes.length) return;

    if (!isUnlocked()) {
      hideAll(nodes);
      document.documentElement.classList.remove("offer-unlocked");
      return;
    }

    document.documentElement.classList.add("offer-unlocked");
    var durationMs = readDuration(nodes);
    var endsAt = getEndsAt(durationMs);

    function tick() {
      render(nodes, endsAt - Date.now());
    }

    tick();
    if (tickTimer) window.clearInterval(tickTimer);
    tickTimer = window.setInterval(tick, 250);
  }

  window.addEventListener("slidexl:offer-unlocked", start);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
