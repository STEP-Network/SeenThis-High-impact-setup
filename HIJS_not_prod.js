'use strict';

let _debugEnabled;
const debugEnabled = () => {
  if (_debugEnabled === undefined) {
    _debugEnabled = new URLSearchParams(window.location.search).has('debugHighImpact');
  }
  return _debugEnabled;
};

const log = (message, ...params) => {
  // only log if query param debugHighImpact is set
  if (debugEnabled()) {
    console.log('[high-impact.js]', message, params.join(' '));
  }
};

const addDebugAttribute = (element, force = false) => {
  if ((element && debugEnabled()) || force) {
    element.dataset.highImpactJs = true;
  }
};

const state = {
  slots: {},
};

const santiziedAdUnitPath = (adUnitPath) => {
  if (adUnitPath && !adUnitPath.startsWith('/')) {
    return `/${adUnitPath}`;
  }
  return adUnitPath;
};

const defineSlot = (slotConfig) => {
  slotConfig.slot = santiziedAdUnitPath(slotConfig.slot);
  const adUnitPath = slotConfig.slot;
  const key = `${adUnitPath}_${slotConfig.adUnitId}`;
  state.slots[key] = slotConfig;
  log('Slot defined', key);
};

const cmd = {
  push: (command) => {
    if (typeof command === 'function') {
      command();
    }
  },
};

const getSlotConfig = (adUnitPath, elementId) => {
  const key = `${santiziedAdUnitPath(adUnitPath)}_${elementId}`;
  log('Looking for config: ', key);
  if (state.slots[key]) {
    const config = state.slots[key];
    log('Found config: ', key, JSON.stringify(config));
    return config;
  }
};

const setTemplateConfig = (template, config) => {
  window.highImpactJs.templateConfig = window.highImpactJs.templateConfig || {};
  window.highImpactJs.templateConfig[template] = config;
};

const getTemplateConfig = (template) => {
  if (window.highImpactJs.templateConfig && window.highImpactJs.templateConfig[template]) {
    return window.highImpactJs.templateConfig[template];
  }
  return {};
};

const setConfig = (config) => {
  window.highImpactJs.config = config;
};

const getConfig = () => {
  return window.highImpactJs.config;
};

var topscroll = {
  name: 'topscroll',
  onRender: ({ adWrapper, adUnit, adIframe }, templateConfig, globalConfig) => {
    const topBarHeight = templateConfig.topBarHeight || globalConfig.topBarHeight || 0;
    const zIndex = templateConfig.zIndex || globalConfig.zIndex || 1000002;
    const peekAmount = templateConfig.peekAmount;
    const dynamic100ViewHeight = `100dvh`;
    CSS.supports(`height: ${dynamic100ViewHeight}`);
    const height = peekAmount ? peekAmount : `calc(100vh - ${topBarHeight}px)`;

    // if debug set red background
    if (globalConfig.debug) {
      Object.assign(adWrapper.style, {
        backgroundColor: 'red',
      });
      Object.assign(adUnit.style, {
        backgroundColor: 'red',
      });
    }

    Object.assign(adWrapper.style, {
      height: height,
      maxHeight: height,
      clipPath: `polygon(0 0, 100vw 0, 100vw ${height}, 0 ${height})`,
      webkitClipPath: `polygon(0 0, 100vw 0, 100vw ${height}, 0 ${height}`,
      margin: 0,
      padding: 0,
      position: 'relative',
      zIndex: zIndex,
    });

    Object.assign(adIframe.style, {
      position: 'fixed',
      left: 0,
      zIndex: 1,
      width: '100%',
      height: height,
      clip: 'rect(auto, auto, auto, auto)',
    });

    Object.assign(adUnit.style, {
      width: '100vw',
      height: height,
    });

    /*
            Additional elements on top of ad
        */

    const bottomContentArea = document.createElement('div');
    bottomContentArea.style.position = 'absolute';
    bottomContentArea.style.bottom = 0;
    bottomContentArea.style.left = 0;
    bottomContentArea.style.width = '100%';
    bottomContentArea.style.zIndex = 999999999;
    bottomContentArea.style.display = 'flex';
    bottomContentArea.style.alignItems = 'center';
    bottomContentArea.style.justifyContent = 'center';
    bottomContentArea.style.flexDirection = 'column';
    bottomContentArea.style.pointerEvents = 'none';

    const title = document.createElement('span');
    title.style.fontSize = '18px';
    title.style.fontWeight = '400';
    title.style.color = 'white';
    title.style.textShadow = '1px 1px 1px rgba(0,0,0,0.5)';
    title.style.marginBottom = '10px';
    title.textContent = templateConfig.title;

    bottomContentArea.appendChild(title);

    if (templateConfig.arrowUrl && templateConfig.arrowUrl.length > 0) {
      const arrow = document.createElement('img');
      arrow.style.width = '38px';
      arrow.style.height = '38px';
      arrow.style.marginLeft = '10px';
      arrow.style.marginBottom = '10px';
      arrow.src = templateConfig.arrowUrl;
      bottomContentArea.appendChild(arrow);
    }

    adWrapper.appendChild(bottomContentArea);

    const fadeOnScroll = templateConfig.fadeOnScroll;

    // Setup intersection observer and change opacity of bottomContentArea
    // based on percent visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // get intersection ratio in percentage
          if (fadeOnScroll) {
            adWrapper.style.opacity = entry.intersectionRatio;
          }
          if (entry.intersectionRatio === 0) {
            // set class on ad wrapper to high-impact-topscroll-is-hidden
            document.body.classList.add('high-impact-topscroll-is-hidden');
          } else {
            // remove class on ad wrapper to high-impact-topscroll-is-hidden
            document.body.classList.remove('high-impact-topscroll-is-hidden');
          }
        });
      },
      {
        // in steps of 0.01
        threshold: Array.from({ length: 101 }, (_, i) => i / 100),
      }
    );
    observer.observe(adWrapper);

    document.body.classList.add('high-impact-topscroll-rendered');

    return {
      didRender: true,
      destroy: () => {
        document.body.classList.remove('high-impact-topscroll-rendered');
        observer.disconnect();
      },
    };
  },
};

var midscroll = {
  name: 'midscroll',
  onRender: ({ adWrapper, adUnit, adIframe }, templateConfig, globalConfig) => {
    /* this will get called once per ad unit */
    const topBarHeight = globalConfig.topBarHeight || 0;
    const zIndex = templateConfig.zIndex || globalConfig.zIndex || 1000002;
    const boundingClientRect = adWrapper.getBoundingClientRect();
    const wrapperLeftMargin = window.getComputedStyle(adWrapper).marginLeft;
    const leftMargin = boundingClientRect.left - parseInt(wrapperLeftMargin, 10);
    const peekAmount = templateConfig.peekAmount;

    const height = peekAmount ? peekAmount : `calc(100vh - ${topBarHeight}px)`;

    // if debug set red background
    if (globalConfig.debug) {
      Object.assign(adWrapper.style, {
        backgroundColor: 'red',
      });
      Object.assign(adUnit.style, {
        backgroundColor: 'red',
      });
    }

    Object.assign(adWrapper.style, {
      visibility: 'visible',
      clipPath: `polygon(0 0, 100vw 0, 100vw ${height}, 0 ${height})`,
      height: height,
      overflow: 'visible',
      padding: '0',
      position: 'relative',
      margin: `0 0 0 -${leftMargin}px`,
      left: '0',
      top: 0,
      zIndex: zIndex,
    });

    Object.assign(adUnit.style, {
      height: `calc(100vh - ${topBarHeight}px)`,
      left: 0,
      overflow: 'hidden',
      position: 'fixed',
      top: `${topBarHeight}px`,
      width: '100vw',
    });

    Object.assign(adIframe.style, {
      width: '100vw',
      height: `calc(100vh - ${topBarHeight}px)`,
    });

    return {
      didRender: true, 
      destroy: () => {}
    };
  },
};

const getTemplate = (name) => {
  switch (name) {
    case 'midscroll':
      return midscroll;
    case 'topscroll':
      return topscroll;
  }
};

const applyResponsiveAdStylingToAdWrapper = (containerElement, config = {}) => {
  try {
    const iframe = containerElement.querySelector('iframe');
    const iframeContent = iframe.contentDocument || iframe.contentWindow.document;

    if (iframeContent.head) {
      applyResponsiveAdStyling(iframeContent.head);
    }
    if (config.testTagToBeInserted) {
      const testTag = document.createElement('div');
      testTag.innerHTML = config.testTagToBeInserted;
      iframeContent.body.appendChild(testTag.firstChild);
    }
  } catch (e) {
    log('Error applying responsive ad styling - possibly because of safe frame', e);
  }
};

const applyResponsiveAdStyling = (head) => {
  try {
    // Custom styling element for inside of the ad container
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
      html, body, adfm-ad, #sf_align, .adform-adbox, .adform-adbox img {width: 100% !important; height: 100% !important; object-fit: cover;} iframe[data-contents*='adform']{width: 100vw !important;height: 100vh !important;}
      [target='_blank'] img[src*='adnxs']{object-fit: cover !important;width: 100% !important;height: 100% !important;position: fixed;}
      .banner {height: 0px !important;} .GoogleActiveViewClass, .GoogleActiveViewElement {transform: translate(calc(-50% + 50vw), 0); width: 100vw !important; height: 100vh !important; display: block;} .GoogleActiveViewClass img, .GoogleActiveViewElement img {width: 100vw !important; height: 100vh !important; object-fit: cover !important;} .GoogleActiveViewClass iframe {width: 100vw !important; height: 100vh !important;}.dcmads {width: 100%!important; height: 100% !important;}
      iframe[src*='net/sadbundle/']{width: 100vw !important;height: 100vh !important;}
    `;
    head.appendChild(style);
  } catch (e) {
    log('Error applying responsive ad styling - possibly because of safe frame', e);
  }
};

const listenToHighImpactPostMessages = (handler) => {
  window.addEventListener('message', (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.sender === 'high-impact-js' && data.action === 'AD_RENDERED') {
        let name;
        try {
          name = event.source.name;
        } catch (_) {}
        handler({
          source: event.source,
          iframeName: name,
          ...data,
        });
      }
    } catch (e) {}
  });
};

function __variableDynamicImportRuntime0__(path) {
  switch (path) {
    case './plugins/gam.js': return Promise.resolve().then(function () { return gam; });
    case './plugins/xandr.js': return Promise.resolve().then(function () { return xandr; });
    default: return new Promise(function(resolve, reject) {
      (typeof queueMicrotask === 'function' ? queueMicrotask : setTimeout)(
        reject.bind(null, new Error("Unknown variable dynamic import: " + path))
      );
    })
   }
 }

const shouldIgnore = (html) => {
  if (window.highImpactJs.config.ignoreSlotOn) {
    return window.highImpactJs.config.ignoreSlotOn(html);
  }
  return false;
};

const onAdResponsiveSignal = (options) => {
  log('Got Ad signal');
  for (const plugin of Object.values(window.highImpactJs.plugins)) {
    let slot;
    if (plugin.getSlotFromSource && options && options.source) {
      slot = plugin.getSlotFromSource(options.source);
      log('Got slot from source', JSON.stringify(slot));
    }
    if (!slot && plugin.getSlotFromIframeName) {
      slot = plugin.getSlotFromIframeName(options);
      log('Got slot from iframe name', JSON.stringify(slot));
    }
    if (!slot && options && plugin.getSlotFromMessage) {
      slot = plugin.getSlotFromMessage(options);
      log('Got slot from message', JSON.stringify(slot));
    }
    if (slot) {
      onAdSlotRendered$2({
        ...slot,
        ignoreWaitForAdSignal: true,
      });
    }
  }
};

const onAdSlotRendered$2 = (options) => {
  const {
    adWrapper,
    adUnit,
    adIframe,
    size,
    html,
    adUnitPath,
    elementId,
    plugin,
    ignoreWaitForAdSignal = false,
  } = options;
  const config = getSlotConfig(adUnitPath, elementId);

  if (!config) {
    log(`No config found for ${adUnitPath} ${elementId}`);
    return;
  }

  if (config.rendered) {
    log(`Already rendered ${adUnitPath} ${elementId} - running cleanup`);
    config.rendered.destroy();
  }

  if (!ignoreWaitForAdSignal && config.waitForAdSignal) {
    return;
  }

  if (shouldIgnore(html)) {
    return;
  }
  // Get template based on config
  const globalConfig = getConfig();
  const templateConfig = getTemplateConfig(config.template);
  const template = getTemplate(config.template);
  // Call template.onRender(options);
  const rendered = template.onRender(options, templateConfig, globalConfig);
  if (rendered) {
    config.rendered = rendered;
    addDebugAttribute(adWrapper, true);
    addDebugAttribute(adUnit);
    addDebugAttribute(adIframe);
    applyResponsiveAdStylingToAdWrapper(adWrapper, config);
  }
};

const importPlugins = async (plugins = []) => {
  // Loop through plugins array (array of strings)
  // import plugin from plugins folder
  const imported = {};
  for (const plugin of plugins) {
    try {
      imported[plugin] = await __variableDynamicImportRuntime0__(`./plugins/${plugin}.js`);
      // Do something with the imported module, e.g., execute a function or access variables.
      log(`${plugin} imported successfully!`);
    } catch (error) {
      console.error(`Failed to import ${plugin}:`, error);
    }
  }
  return imported;
};

const setupPlugins = async (plugins = []) => {
  // Loop through plugins array (array of strings)
  // import plugin from plugins folder
  const imported = await importPlugins(plugins);
  for (const plugin of Object.values(imported)) {
    if (plugin.init) {
      plugin.init();
    }
    if (plugin.getRenderedSlots) {
      const renderedSlot = await plugin.getRenderedSlots();
      renderedSlot.forEach((slot) => {
        if (slot.getResponseInformation) {
          const responseInformation = slot.getResponseInformation();
          if (responseInformation.lineItemId) {
            onAdSlotRendered$2(slot);
          }
        }
      });
    }
    if (plugin.onAdSlotRendered) {
      plugin.onAdSlotRendered(onAdSlotRendered$2);
    }
  }
  return imported;
};

var init$1 = () => {
  return new Promise(async (resolve, reject) => {
    // Set defaults
    window.highImpactJs = window.highImpactJs || { cmd: [] };

    if (window.highImpactJs.initialized) {
      reject('Already initialized');
      return;
    }

    log('high-impact.js init');
    window.highImpactJs.initialized = true;

    window.highImpactJs.templateConfig = window.highImpactJs.templateConfig || {};
    window.highImpactJs.config = window.highImpactJs.config || {};

    // Assign functions
    window.highImpactJs.defineSlot = defineSlot;
    //window.highImpactJs.closeSlot = closeSlot;
    window.highImpactJs.setTemplateConfig = setTemplateConfig;
    window.highImpactJs.setConfig = setConfig;

    // check if window.highImpactJs exist and window.highImpactJs.cmd is an array with length > 0
    if (window.highImpactJs && Array.isArray(window.highImpactJs.cmd) && window.highImpactJs.cmd.length > 0) {
      // loop through the commands
      window.highImpactJs.cmd.forEach((command) => {
        // check if the command is a function
        if (typeof command === 'function') {
          // call the function
          command();
          // remove the function from the array
          window.highImpactJs.cmd.shift();
        }
      });
    }

    window.highImpactJs.cmd = cmd;

    if (!window.highImpactJs.config.plugins) {
      window.highImpactJs.config.plugins = ['gam'];
    }

    if (window.highImpactJs.config.plugins) {
      window.highImpactJs.plugins = await setupPlugins(window.highImpactJs.config.plugins);
    }

    // TODO - Check if any config contains waitForAdSignal
    listenToHighImpactPostMessages(onAdResponsiveSignal);

    resolve();
  });
};

init$1();

const parseSlot = (slot) => {
  const slotElementId = slot.getSlotElementId();
  const adWrapper = document.getElementById(slotElementId);
  if (adWrapper) {
    const [adUnit, adIframe] = adWrapper.querySelectorAll(
      'div[id^="google_ads_iframe_"], iframe[id^="google_ads_iframe_"]'
    );

    const size = slot.size;
    const html = slot.getHtml();
    const adUnitPath = slot.getAdUnitPath();
    const elementId = slot.getSlotElementId();

    return {
      adWrapper,
      adUnit,
      adIframe,
      size,
      html,
      adUnitPath,
      elementId,
      plugin: 'gam',
    };
  }
};

const getSlotFromSource = (source) => {
  const googleIframes = document.querySelectorAll('iframe[id^="google_ads_iframe_"]');
  if (!googleIframes) {
    return;
  }
  const iframeThatMatchesSource = Array.from(googleIframes).find((iframe) => iframe.contentWindow === source);
  if (!iframeThatMatchesSource) {
    return;
  }
  const slotId = iframeThatMatchesSource.id.replace('google_ads_iframe_', '');
  const slotIdMap = googletag.pubads().getSlotIdMap();
  const slot = slotIdMap[slotId];
  if (!slot) {
    return;
  }
  return parseSlot(slot);
};

const getSlotFromIframeName = ({ iframeName }) => {
  if (!iframeName) {
    return;
  }

  const adIframe = document.getElementById(iframeName);
  const adUnit = adIframe.parentElement;
  const adWrapper = adUnit.parentElement;
  adWrapper.id;

  const slotId = iframeName.replace('google_ads_iframe_', '');
  const slotIdMap = googletag.pubads().getSlotIdMap();
  const slot = slotIdMap[slotId];
  if (!slot) {
    return;
  }
  return parseSlot(slot);
};

const getSlotFromMessage$1 = (message) => {
  // Strategy 1. f message.qemId exist, find the adwrapper div with data-google-query-id attribute equal to message.qemId

  if (message.qemId) {
    const adWrapper = document.querySelector(`[data-google-query-id="${message.qemId}"]`);
    if (adWrapper) {
      const adIframe = adWrapper.querySelector('iframe[id^="google_ads_iframe_"]');

      const slotId = adIframe.id.replace('google_ads_iframe_', '');
      const slotIdMap = googletag.pubads().getSlotIdMap();
      const slot = slotIdMap[slotId];
      if (slot) {
        return parseSlot(slot);
      }
    }
  }

  // Strategy 2. If message.qemId does not exist, find the adwrapper div with the iframe src containing safeframe.googlesyndication.com
  const safeFrameOrigins = Array.from(message.origins).filter((origin) =>
    origin.includes('.safeframe.googlesyndication.com')
  );
  if (safeFrameOrigins && safeFrameOrigins.length > 0) {
    const safeFrameOrigin = safeFrameOrigins[0];
    const adIframe = document.querySelector(`iframe[src^="${safeFrameOrigin}"]`);
    const adUnit = adIframe.parentElement;
    adUnit.parentElement;

    const slotId = adIframe.id.replace('google_ads_iframe_', '');
    const slotIdMap = googletag.pubads().getSlotIdMap();
    const slot = slotIdMap[slotId];
    if (!slot) {
      return;
    }
    return parseSlot(slot);
  }
};

const onAdSlotRendered$1 = (handler) => {
  googletag.cmd.push(() => {
    googletag.pubads().addEventListener('slotRenderEnded', (event) => {
      if (event.isEmpty) {
        return;
      }
      const { slot } = event;
      handler(parseSlot(slot));
    });
  });
};

const getRenderedSlots$1 = async () => {
  return new Promise((resolve) => {
    googletag.cmd.push(() => {
      const slots = googletag.pubads().getSlots();
      const parsedSlots = slots.filter((slot) => slot && slot.adIframe && slot.adUnit).map((slot) => parseSlot(slot));
      resolve(parsedSlots.filter((slot) => slot.adIframe && slot.adUnit));
    });
  });
};

const init = () => {
  window.googletag = window.googletag || { cmd: [] };
};

var gam = /*#__PURE__*/Object.freeze({
  __proto__: null,
  getRenderedSlots: getRenderedSlots$1,
  getSlotFromIframeName: getSlotFromIframeName,
  getSlotFromMessage: getSlotFromMessage$1,
  getSlotFromSource: getSlotFromSource,
  init: init,
  onAdSlotRendered: onAdSlotRendered$1
});

const getSlotFromMessage = (message) => {
  // TODO - implement this
  /*
      if (!slot) {
        return;
      }
      return parseSlot(slot);
      */
};

const onAdSlotRendered = (handler) => {
  // TODO - implement this
  // handler(parseSlot(slot));
};

const getRenderedSlots = async () => {
  return new Promise((resolve) => {
    // TODO - implement this
  });
};

var xandr = /*#__PURE__*/Object.freeze({
  __proto__: null,
  getRenderedSlots: getRenderedSlots,
  getSlotFromMessage: getSlotFromMessage,
  onAdSlotRendered: onAdSlotRendered
});