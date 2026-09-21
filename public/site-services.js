(() => {
  `use strict`;

  const config = window.wagesSiteConfig;
  const adScript = document.getElementById(`wages-adsense-script`);
  const slotSelector = `[data-wages-ad-slot]`;
  const privacySelector = `[data-wages-privacy-settings]`;
  let adScriptFailed = adScript?.dataset.wagesAdState === `failed`;
  let privacyAvailable = false;

  function hideSlots() {
    document.querySelectorAll(slotSelector).forEach((slot) => { slot.hidden = true; });
  }

  let productionOrigin = false;

  try {
    productionOrigin = window.location.protocol === `https:`
      && window.location.origin === new URL(config?.siteUrl).origin;
  } catch {
    productionOrigin = false;
  }

  if (!adScript || !config?.productionBuild || !config.pageMonetizable
    || !/^ca-pub-\d{16}$/.test(config.publisherId)) {
    hideSlots();
    return;
  }

  function updatePrivacyButtons() {
    document.querySelectorAll(privacySelector).forEach((button) => {
      button.hidden = !privacyAvailable;
    });
  }

  // Google's published CMP messages are deployed by the shared head tag.
  // Keep privacy choices available even when manual ad placements are disabled.
  window.googlefc = window.googlefc || {};
  window.googlefc.callbackQueue = window.googlefc.callbackQueue || [];
  window.googlefc.callbackQueue.push({
    CONSENT_API_READY: () => {
      if (typeof window.__tcfapi !== `function`) return;

      // Google's revocation sample uses version 0 for the latest supported TCF:
      // https://developers.google.com/funding-choices/fc-api-docs
      window.__tcfapi(`addEventListener`, 0, (data, success) => {
        privacyAvailable = Boolean(success && data?.gdprApplies
          && typeof window.googlefc.showRevocationMessage === `function`);
        updatePrivacyButtons();
      });
    },
  });

  document.addEventListener(`click`, (event) => {
    const button = event.target instanceof Element
      ? event.target.closest(privacySelector)
      : null;

    if (!button || !privacyAvailable) return;

    event.preventDefault();
    window.googlefc.callbackQueue.push({
      CONSENT_API_READY: () => {
        if (typeof window.googlefc.showRevocationMessage === `function`) {
          window.googlefc.showRevocationMessage();
        }
      },
    });
  });

  function fillSlot(wrapper) {
    if (!wrapper.isConnected || wrapper.dataset.wagesAdState === `initialized`
      || wrapper.dataset.wagesAdState === `failed` || wrapper.getBoundingClientRect().width <= 0) return;

    wrapper.dataset.wagesAdState = `initialized`;
    const unit = document.createElement(`ins`);
    unit.id = `${wrapper.id || `wages-ad`}-unit`;
    unit.className = `adsbygoogle wages-ad-unit`;
    unit.style.display = `block`;
    unit.dataset.adSlot = config.adSlot;
    unit.dataset.adFormat = `auto`;
    unit.dataset.adClient = config.publisherId;
    unit.dataset.fullWidthResponsive = `true`;
    wrapper.appendChild(unit);

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      wrapper.hidden = true;
      wrapper.dataset.wagesAdState = `failed`;
    }
  }

  const resizeObserver = typeof ResizeObserver === `function`
    ? new ResizeObserver((entries) => entries.forEach(({ target }) => fillSlot(target)))
    : null;

  function synchronize() {
    updatePrivacyButtons();

    if (adScriptFailed || !productionOrigin || !config.adsEnabled || !config.consentReady
      || config.adMode !== `manual` || !/^[1-9]\d{0,19}$/.test(config.adSlot)) {
      hideSlots();
      return;
    }

    document.querySelectorAll(slotSelector).forEach((wrapper) => {
      if (wrapper.dataset.wagesAdState) return;

      wrapper.dataset.wagesAdState = `waiting`;
      wrapper.hidden = false;
      resizeObserver?.observe(wrapper);
      window.requestAnimationFrame(() => fillSlot(wrapper));
    });
  }

  // React mounts the calculator after this deferred script. Observe new slots
  // without polling, and initialize each unit only once.
  const observer = new MutationObserver((records) => {
    records.forEach((record) => {
      if (record.type !== `attributes` || record.target.dataset.adStatus !== `unfilled`) return;

      const wrapper = record.target.closest(slotSelector);

      if (wrapper) {
        wrapper.hidden = true;
        wrapper.dataset.wagesAdState = `failed`;
        resizeObserver?.unobserve(wrapper);
      }
    });
    synchronize();
  });
  observer.observe(document.body, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: [`data-ad-status`],
  });

  adScript.addEventListener(`error`, () => {
    adScriptFailed = true;
    hideSlots();
    resizeObserver?.disconnect();
  });

  // Standard AdSense requests queue safely before the async head tag loads.
  // The export installs that tag once; this runtime never appends another copy.
  synchronize();
})();
