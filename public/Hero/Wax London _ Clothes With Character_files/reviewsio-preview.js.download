(function () {
  if (!window.__REVIEWS_EDITOR__) return;

  /**
   * Default delay before we decide a widget is "empty" and should be forced into demo/sample mode.
   *
   * Why this exists:
   * - Reviews.io widgets render asynchronously (external script load + internal fetch + DOM paint).
   * - In Theme Editor, sections can be injected after initial page load.
   * - We wait a short window to avoid falsely switching to demo while the real widget is still loading.
   */
  var DEFAULT_WIDGET_RENDER_CHECK_DELAY_MS = 200;

  var demo = window.__REVIEWS_DEMO_CONFIG__ || {
    store: 'ecommerce-demo-store',
    sku: 'bunch_of_flowers_sku;blue_flowers_sku;white_flowers_sku;pastel_flowers_sku;summer_selection_sku',
    widgetIds: {
      nuggets: 'W10cpKyjl72VtHv6',
      ugc: '7sG9C5qNeKpvhykZ',
      ratingBar: 'pxNMXi7FTlODgr8Q',
      floating: 'GBvqmKV1Zy9H4Mpd',
      survey: 'uLJcD7bFpGMf1Z0C'
    },
    surveyCampaignId: '392'
  };

  function setIfMissing(el, attr, value) {
    if (!el || !value) return;
    var current = el.getAttribute(attr);
    if (current === null || current === undefined || current === '') {
      el.setAttribute(attr, value);
    }
  }

  function applyToAll(selector, fn) {
    try {
      var nodes = document.querySelectorAll(selector);
      if (!nodes || !nodes.length) return;
      nodes.forEach(fn);
    } catch (err) {
      if (typeof console !== 'undefined' && typeof console.error === 'function') {
        console.error('REVIEWS.io preview error in applyToAll:', err);
      }
    }
  }

  function addPreviewBadge(el, label) {
    if (!el) return;
    if (el.__reviewsioPreviewBadged) return;
    el.__reviewsioPreviewBadged = true;

    var badge = document.createElement('div');
    badge.textContent = label || 'Sample preview';
    badge.style.fontSize = '12px';
    badge.style.lineHeight = '1.2';
    badge.style.fontFamily = 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif';
    badge.style.display = 'inline-block';
    badge.style.padding = '4px 8px';
    badge.style.margin = '0 0 8px 0';
    badge.style.border = '1px dashed currentColor';
    badge.style.opacity = '0.85';

    el.__reviewsioPreviewBadgeEl = badge;

    if (el.parentNode) {
      el.parentNode.insertBefore(badge, el);
    }
  }

  function removePreviewBadge(el) {
    if (!el) return;
    var badge = el.__reviewsioPreviewBadgeEl;
    if (badge && badge.parentNode) {
      badge.parentNode.removeChild(badge);
    }
    el.__reviewsioPreviewBadgeEl = null;
    el.__reviewsioPreviewBadged = false;
  }

  function ensureWidgetRenders(opts) {
    var el = opts && opts.el;
    if (!el || el.__reviewsioEnsureScheduled) return;
    el.__reviewsioEnsureScheduled = true;

    var delayMs = typeof opts.delayMs === 'number' ? opts.delayMs : DEFAULT_WIDGET_RENDER_CHECK_DELAY_MS;
    window.setTimeout(function () {
      try {
        // If widget rendered anything, don't interfere unless it rendered an empty/error state
        // that we explicitly want to replace with demo content in Theme Editor.
        if (el.childElementCount > 0) {
          var isRenderedEmptyFn = opts.isRenderedEmpty;
          if (typeof isRenderedEmptyFn === 'function') {
            try {
              if (!isRenderedEmptyFn(el)) {
                return;
              }
            } catch (_) {
              return;
            }
          } else {
            return;
          }
        }

        var hasDataFn = opts.hasData;
        var hasDataPromise = null;
        if (typeof hasDataFn === 'function') {
          try {
            hasDataPromise = Promise.resolve(hasDataFn());
          } catch (_) {
            hasDataPromise = Promise.resolve(true);
          }
        } else {
          hasDataPromise = Promise.resolve(true);
        }

        hasDataPromise
          .then(function (hasData) {
            // If real data exists, never force demo/sample.
            if (hasData) {
              removePreviewBadge(el);
              return;
            }

            // No data for this widget's configuration: show demo sample.
            if (opts.demoWidgetId) {
              el.setAttribute('data-widget-id', opts.demoWidgetId);
            }
            if (demo.store) {
              el.setAttribute('data-store-name', demo.store);
            }

            addPreviewBadge(el, opts.badgeLabel || 'Sample preview');

            if (opts.scriptSrc) {
              var script = document.createElement('script');
              script.setAttribute('src', opts.scriptSrc + '?preview=' + Date.now());
              script.setAttribute('data-reviewsio-preview', 'true');
              document.body.appendChild(script);
            }

            if (opts.initFn && typeof window[opts.initFn] === 'function') {
              try {
                window[opts.initFn]();
              } catch (_) {
                // no-op
              }
            }
          })
          .catch(function () {
            // Be conservative on errors: do not force demo over potentially real data.
            removePreviewBadge(el);
          });
      } catch (_) {
        // no-op
      }
    }, delayMs);
  }

  function getPageType() {
    try {
      var pt = window.ShopifyAnalytics && window.ShopifyAnalytics.meta && window.ShopifyAnalytics.meta.page && window.ShopifyAnalytics.meta.page.pageType;
      if (pt) return pt;
      // Fallback: theme editor preview URLs still include the canonical path.
      var path = (window.location && window.location.pathname) ? window.location.pathname : '';
      if (path.indexOf('/products/') === 0 || path.indexOf('/products/') > -1) return 'product';
      if (path.indexOf('/collections/') === 0 || path.indexOf('/collections/') > -1) return 'collection';
      return null;
    } catch (_) {
      return null;
    }
  }

  function findAnyProductSkuRaw() {
    var el = document.querySelector('.ruk_rating_snippet[data-sku]') ||
      document.querySelector('.reviews-io-nuggets-widget[data-sku]') ||
      document.querySelector('.reviews-io-ugc-widget[data-sku]') ||
      document.querySelector('.reviews-io-rating-bar-widget[data-sku]');
    if (!el) return '';
    return el.getAttribute('data-sku') || '';
  }

  function computeProductPreviewConfig() {
    // Only relevant in Theme Editor.
    if (!window.__REVIEWS_EDITOR__) return;

    // If we've already computed the config, still apply badges for any newly
    // inserted widgets (Theme Editor can inject sections after page load).
    if (window.__REVIEWSIO_PRODUCT_PREVIEW_CONFIG__) {
      try {
        var cfgExisting = window.__REVIEWSIO_PRODUCT_PREVIEW_CONFIG__;
        var nodesExisting = document.querySelectorAll('.reviews-io-polaris-widget');
        if (nodesExisting && nodesExisting.length) {
          nodesExisting.forEach(function (el) {
            if (cfgExisting && cfgExisting.isSample) {
              addPreviewBadge(el, 'Sample preview');
            } else {
              removePreviewBadge(el);
            }
          });
        }
      } catch (_) {
        // no-op
      }

      if (typeof window.__reviewsioInitPolarisWidgets === 'function') {
        try { window.__reviewsioInitPolarisWidgets(); } catch (_) { /* no-op */ }
      }
      return;
    }

    if (window.__REVIEWSIO_PRODUCT_PREVIEW_CONFIG_PROMISE__) return;

    var store = (typeof window.reviewsIoStore !== 'undefined' && window.reviewsIoStore) ? window.reviewsIoStore : null;
    var skuRaw = findAnyProductSkuRaw();
    var lang = (typeof window.reviewsIoLang !== 'undefined' && window.reviewsIoLang) ? window.reviewsIoLang : 'en';

    window.__REVIEWSIO_PRODUCT_PREVIEW_CONFIG_PROMISE__ = (function () {
      // If we can't evaluate, prefer demo so the widget shows something in editor.
      if (!store || !skuRaw) {
        return Promise.resolve({
          store: demo.store,
          sku: demo.sku,
          isSample: true
        });
      }

      return hasAnyProductRatings(store, skuRaw, lang)
        .then(function (hasRatings) {
          if (hasRatings) {
            return { store: store, sku: skuRaw, isSample: false };
          }
          return { store: demo.store, sku: demo.sku, isSample: true };
        })
        .catch(function () {
          return { store: demo.store, sku: demo.sku, isSample: true };
        });
    })();

    window.__REVIEWSIO_PRODUCT_PREVIEW_CONFIG_PROMISE__
      .then(function (cfg) {
        window.__REVIEWSIO_PRODUCT_PREVIEW_CONFIG__ = cfg;

        try {
          var nodes = document.querySelectorAll('.reviews-io-polaris-widget');
          if (nodes && nodes.length) {
            nodes.forEach(function (el) {
              if (cfg && cfg.isSample) {
                addPreviewBadge(el, 'Sample preview');
              } else {
                removePreviewBadge(el);
              }
            });
          }
        } catch (_) {
          // no-op
        }

        if (typeof window.__reviewsioInitPolarisWidgets === 'function') {
          try { window.__reviewsioInitPolarisWidgets(); } catch (_) { /* no-op */ }
        }
      })
      .catch(function () {
        // Fallback: set demo config on error so widgets can still render
        window.__REVIEWSIO_PRODUCT_PREVIEW_CONFIG__ = {
          store: demo.store,
          sku: demo.sku,
          isSample: true
        };
        if (typeof window.__reviewsioInitPolarisWidgets === 'function') {
          try { window.__reviewsioInitPolarisWidgets(); } catch (_) { /* no-op */ }
        }
      });
  }

  function safeFetchJson(url) {
    try {
      return fetch(url, { credentials: 'omit' }).then(function (r) {
        return r.json();
      });
    } catch (_) {
      return Promise.reject(_);
    }
  }

  function isSafeStoreParam(store) {
    // This runs in the browser (not SSRF), but we still avoid sending obviously malformed values
    // to third-party endpoints to reduce accidental data leakage and improve robustness.
    if (!store) return false;
    var s = String(store).trim();
    if (!s || s.length > 120) return false;
    if (/\s/.test(s)) return false;
    if (/[\\/?:#&=]/.test(s)) return false;
    if (/^https?:/i.test(s)) return false;
    return true;
  }

  function isSafeSkuParam(skuRaw) {
    if (!skuRaw) return false;
    var s = String(skuRaw);
    // SKU strings can include multiple IDs/handles separated by ';' and may contain spaces.
    // We only reject obviously suspicious or excessively large values.
    if (s.length > 2000) return false;
    if (/[\u0000-\u001F\u007F]/.test(s)) return false;
    if (/https?:\/\//i.test(s)) return false;
    return true;
  }

  function parseRatingBatchHasAnyRatings(payload) {
    if (!payload) return false;
    if (Array.isArray(payload)) {
      return payload.some(function (item) {
        return (item && typeof item.num_ratings === 'number' && item.num_ratings > 0);
      });
    }
    if (payload.data && Array.isArray(payload.data)) {
      return payload.data.some(function (item) {
        return (item && typeof item.num_ratings === 'number' && item.num_ratings > 0);
      });
    }
    return false;
  }

  function extractSkuCandidates(raw) {
    if (!raw) return [];
    return String(raw)
      .split(';')
      .map(function (s) { return (s || '').trim(); })
      .filter(function (s) { return !!s; });
  }

  function hasAnyProductRatings(store, skuRaw, lang) {
    if (!store || !skuRaw) return Promise.resolve(false);
    if (!isSafeStoreParam(store) || !isSafeSkuParam(skuRaw)) return Promise.resolve(false);
    var url = 'https://api.reviews.io/product/rating-batch?store=' + encodeURIComponent(store) +
      '&sku=' + encodeURIComponent(skuRaw) +
      '&useCustomLookup=false&customLookupSkuFallback=false&useProductGroup=false&mpnLookup=false&lang=' + encodeURIComponent(lang || 'en');
    return safeFetchJson(url).then(function (payload) {
      return parseRatingBatchHasAnyRatings(payload);
    });
  }

  function hasAnyNuggets(store, skuRaw) {
    if (!store) return Promise.resolve(false);
    if (!isSafeStoreParam(store)) return Promise.resolve(false);
    if (skuRaw && !isSafeSkuParam(skuRaw)) return Promise.resolve(false);
    var skus = extractSkuCandidates(skuRaw);
    var qs = skus.map(function (s) {
      return 'sku[]=' + encodeURIComponent(s);
    }).join('&');
    var url = 'https://api.reviews.io/review-nuggets/data?store=' + encodeURIComponent(store) +
      '&types=product_review&' + qs + '&min_rating=1&per_page=1&source=shopify-theme-editor';
    return safeFetchJson(url).then(function (payload) {
      var data = payload && (payload.data || payload);
      return Array.isArray(data) && data.length > 0;
    });
  }

  function hasAnyMerchantReviews(store) {
    if (!store) return Promise.resolve(false);
    if (!isSafeStoreParam(store)) return Promise.resolve(false);
    var url = 'https://api.reviews.io/merchant/reviews?store=' + encodeURIComponent(store) + '&per_page=1&page=1';
    return safeFetchJson(url).then(function (payload) {
      // Try common shapes; if unknown, assume data exists so we don't override real widgets.
      if (!payload) return false;

      // Error-ish payloads
      if (payload.success === false) return false;
      if (payload.error) return false;
      if (payload.errors) return false;
      if (typeof payload.message === 'string' && payload.message) {
        var msg = payload.message.toLowerCase();
        if (msg.indexOf('not found') > -1) return false;
        if (msg.indexOf('unknown') > -1) return false;
        if (msg.indexOf('invalid') > -1) return false;
      }

      if (payload.stats && (typeof payload.stats.total_reviews === 'number' || typeof payload.stats.total_reviews === 'string')) {
        var tr = parseInt(payload.stats.total_reviews, 10);
        if (!isNaN(tr)) return tr > 0;
      }
      if (payload.pagination && typeof payload.pagination.total === 'number') {
        return payload.pagination.total > 0;
      }
      if (typeof payload.total === 'number') {
        return payload.total > 0;
      }
      if (typeof payload.total_pages === 'number') {
        return payload.total_pages > 0;
      }
      if (Array.isArray(payload.reviews)) {
        return payload.reviews.length > 0;
      }
      if (Array.isArray(payload.data)) {
        return payload.data.length > 0;
      }

      return true;
    });
  }

  function emitPreviewRerender() {
    try {
      document.dispatchEvent(new Event('reviewsio:theme-editor-preview'));
    } catch (_) {
      // no-op
    }
  }

  function waitForGlobal(globalName, opts) {
    var maxAttempts = (opts && typeof opts.maxAttempts === 'number') ? opts.maxAttempts : 40;
    var delayMs = (opts && typeof opts.delayMs === 'number') ? opts.delayMs : 100;
    var attempt = (opts && typeof opts.attempt === 'number') ? opts.attempt : 0;
    var onReady = opts && opts.onReady;

    try {
      if (globalName && typeof window[globalName] === 'function') {
        if (typeof onReady === 'function') onReady();
        return;
      }
    } catch (_) {
      // no-op
    }

    if (attempt >= maxAttempts) return;
    window.setTimeout(function () {
      waitForGlobal(globalName, {
        maxAttempts: maxAttempts,
        delayMs: delayMs,
        attempt: attempt + 1,
        onReady: onReady
      });
    }, delayMs);
  }

  function ensureExternalScript(src, scriptKey) {
    try {
      if (!src) return;
      var key = scriptKey || ('reviewsio:' + src);
      if (window.__reviewsioPreviewScripts && window.__reviewsioPreviewScripts[key]) return;
      if (!window.__reviewsioPreviewScripts) window.__reviewsioPreviewScripts = {};

      // If it already exists in the DOM, treat it as loaded/managed.
      var existing = document.querySelector('script[src^="' + src.replace(/"/g, '') + '"]');
      if (existing) {
        window.__reviewsioPreviewScripts[key] = true;
        return;
      }

      var s = document.createElement('script');
      s.src = src + (src.indexOf('?') === -1 ? '?' : '&') + 'preview=' + Date.now();
      s.defer = true;
      s.setAttribute('data-reviewsio-preview', 'true');
      document.head.appendChild(s);
      window.__reviewsioPreviewScripts[key] = true;
    } catch (_) {
      // no-op
    }
  }

  function reinitTextBanner(el) {
    ensureExternalScript('https://widget.reviews.io/rich-snippet-reviews-widgets/dist.js', 'text-banner');
    waitForGlobal('richSnippetReviewsWidgets', {
      maxAttempts: 40,
      delayMs: 100,
      onReady: function () {
        var storeToUse = window.__REVIEWSIO_TEXT_BANNER_STORE_OVERRIDE__ || window.reviewsIoStore || demo.store;
        try {
          el.innerHTML = '';
          window.richSnippetReviewsWidgets('text-banner-widget', {
            store: storeToUse,
            starsClr: '#f47e27',
            textClr: '#000',
            logoClr: 'black',
            widgetName: 'text-banner',
            css: '.TextBanner .ReviewsLogo { display: none !important; }'
          });
        } catch (_) {
          // no-op
        }
      }
    });
  }

  function reinitCarouselWidget(el) {
    ensureExternalScript('https://widget.reviews.io/carousel-inline-iframeless/dist.js', 'card-carousel');
    waitForGlobal('carouselInlineWidget', {
      maxAttempts: 60,
      delayMs: 100,
      onReady: function () {
        var storeToUse = window.__REVIEWSIO_CAROUSEL_STORE_OVERRIDE__ || window.reviewsIoStore || demo.store;
        var langToUse = (typeof window.reviewsIoLang !== 'undefined' && window.reviewsIoLang) ? window.reviewsIoLang : 'en';
        try {
          el.innerHTML = '';
          new window.carouselInlineWidget(el.id, {
            store: storeToUse,
            sku: '',
            lang: langToUse,
            carousel_type: 'default',
            styles_carousel: 'CarouselWidget--sideHeader--withcards',
            options: {
              general: {
                review_type: 'store_review',
                min_reviews: '1',
                max_reviews: '20',
                enable_auto_scroll: 10000
              },
              header: {
                enable_overall_stars: true
              }
            }
          });
        } catch (_) {
          // no-op
        }
      }
    });
  }

  function runPreviewPass() {
    // Widgets that require widget_id.
    applyToAll('.reviews-io-nuggets-widget', function (el) {
      var widgetId = (el.getAttribute('data-widget-id') || '').trim();
      if (!widgetId) {
        setIfMissing(el, 'data-widget-id', demo.widgetIds && demo.widgetIds.nuggets);
        if (demo.store) el.setAttribute('data-store-name', demo.store);
        addPreviewBadge(el, 'Sample preview');
      }

      // Only fall back to demo when there's no content for the current store/SKUs.
      var store = (typeof window.reviewsIoStore !== 'undefined' && window.reviewsIoStore) ? window.reviewsIoStore : null;
      var skuRaw = el.getAttribute('data-sku') || '';

      ensureWidgetRenders({
        el: el,
        demoWidgetId: demo.widgetIds && demo.widgetIds.nuggets,
        scriptSrc: 'https://widget.reviews.io/modern-widgets/nuggets.js',
        badgeLabel: 'Sample preview',
        initFn: '__reviewsioInitNuggetsWidgets',
        hasData: function () {
          // If merchant configured a widget id but has nuggets content, never show demo.
          if (!store) return false;
          // If we can't infer SKUs, be conservative and don't force demo.
          if (!skuRaw) return true;
          return hasAnyNuggets(store, skuRaw);
        }
      });
    });

    applyToAll('.reviews-io-ugc-widget', function (el) {
      var widgetId = (el.getAttribute('data-widget-id') || '').trim();
      if (!widgetId) {
        setIfMissing(el, 'data-widget-id', demo.widgetIds && demo.widgetIds.ugc);
        if (demo.store) el.setAttribute('data-store-name', demo.store);
        addPreviewBadge(el, 'Sample preview');

        if (typeof window.__reviewsioInitUGCWidgets === 'function') {
          try { window.__reviewsioInitUGCWidgets(); } catch (_) { /* no-op */ }
        }
      }

      ensureWidgetRenders({
        el: el,
        demoWidgetId: demo.widgetIds && demo.widgetIds.ugc,
        scriptSrc: 'https://widget.reviews.io/modern-widgets/ugc.js',
        badgeLabel: 'Sample preview',
        initFn: '__reviewsioInitUGCWidgets',
        isRenderedEmpty: function (root) {
          // UGC widget can render a "not enough photos" empty state which looks like a broken widget
          // in Theme Editor. If we see that message, replace it with demo preview content.
          try {
            var txt = (root && root.textContent) ? String(root.textContent).toLowerCase() : '';
            if (!txt) return false;
            if (txt.indexOf('ugc widget requires') > -1 && txt.indexOf('photos') > -1) return true;
            if (txt.indexOf('enable more photos') > -1) return true;
            if (txt.indexOf('enable more ugc') > -1 && txt.indexOf('cards') > -1) return true;
            return false;
          } catch (_) {
            return false;
          }
        },
        hasData: function () {
          // If a merchant configured a widget id, do not force demo/sample mode.
          // The widget's own init/reload logic should handle Theme Editor DOM swaps.
          return !!widgetId;
        }
      });
    });

    applyToAll('.reviews-io-rating-bar-widget', function (el) {
      var widgetId = (el.getAttribute('data-widget-id') || '').trim();
      if (!widgetId) {
        setIfMissing(el, 'data-widget-id', demo.widgetIds && demo.widgetIds.ratingBar);
        if (demo.store) el.setAttribute('data-store-name', demo.store);
        addPreviewBadge(el, 'Sample preview');
      }

      var store = (typeof window.reviewsIoStore !== 'undefined' && window.reviewsIoStore) ? window.reviewsIoStore : null;

      ensureWidgetRenders({
        el: el,
        demoWidgetId: demo.widgetIds && demo.widgetIds.ratingBar,
        scriptSrc: 'https://widget.reviews.io/modern-widgets/rating-bar.js',
        badgeLabel: 'Sample preview',
        initFn: '__reviewsioInitRatingBarWidgets',
        hasData: function () {
          var pageType = getPageType();

          // Rating Bar can represent product review signal as well as company review signal.
          // To avoid incorrectly forcing demo content (which looks "wrong" when the merchant has reviews),
          // we only force demo when we can confidently determine there is no relevant data.

          // On product pages, use product ratings if we can infer SKUs.
          if (pageType === 'product') {
            var skuRaw = el.getAttribute('data-sku') || findAnyProductSkuRaw();
            var lang = (typeof window.reviewsIoLang !== 'undefined' && window.reviewsIoLang) ? window.reviewsIoLang : 'en';
            if (skuRaw) {
              return hasAnyProductRatings(store, skuRaw, lang);
            }

            // If we can't infer SKUs, be conservative: assume data may exist.
            return true;
          }

          // Non-product pages: we don't have a reliable "any product reviews" endpoint here.
          // Be conservative and do not force demo based on a potentially mismatched company review check.
          return true;
        }
      });
    });

    applyToAll('.reviews-io-floating-widget', function (el) {
      if (el.__reviewsioFloatingPreviewScheduled) return;
      el.__reviewsioFloatingPreviewScheduled = true;

      var widgetId = (el.getAttribute('data-widget-id') || '').trim();

      // If no widget id is configured, always use demo in editor (otherwise floating.js errors).
      if (!widgetId) {
        setIfMissing(el, 'data-widget-id', demo.widgetIds && demo.widgetIds.floating);
        if (demo.store) el.setAttribute('data-store-name', demo.store);
        addPreviewBadge(el, 'Sample preview');

        if (typeof window.__reviewsioInitFloatingWidgets === 'function') {
          try { window.__reviewsioInitFloatingWidgets(); } catch (_) { /* no-op */ }
        }
        return;
      }

      // On some templates (notably product pages) we can have real merchant reviews but the
      // floating widget still may not render in the Theme Editor iframe due to DOM swaps.
      // Use "did it actually render" as the signal instead of API checks.
      ensureWidgetRenders({
        el: el,
        demoWidgetId: demo.widgetIds && demo.widgetIds.floating,
        scriptSrc: 'https://widget.reviews.io/modern-widgets/floating.js',
        badgeLabel: 'Sample preview',
        initFn: '__reviewsioInitFloatingWidgets',
        hasData: function () {
          // If a merchant configured a widget id, do not force demo/sample mode.
          // The floating block script handles editor reloads; demo preview is only for missing widget ids.
          return true;
        }
      });
    });

    // Survey widget markup support (if present).
    applyToAll('#reviews-io-survey-widget, .reviews-io-survey-widget', function (el) {
      setIfMissing(el, 'widget-id', demo.widgetIds && demo.widgetIds.survey);
      setIfMissing(el, 'store-name', demo.store);
      setIfMissing(el, 'campaign-id', demo.surveyCampaignId);
      addPreviewBadge(el, 'Sample preview');
    });

    // Text Banner widget: if merchant has no reviews, fall back to demo store.
    applyToAll('#text-banner-widget', function (el) {
      var store = (typeof window.reviewsIoStore !== 'undefined' && window.reviewsIoStore) ? window.reviewsIoStore : null;

      if (!store) {
        window.__REVIEWSIO_TEXT_BANNER_STORE_OVERRIDE__ = demo.store;
        addPreviewBadge(el, 'Sample preview');
        emitPreviewRerender();
        return;
      }

      hasAnyMerchantReviews(store)
        .then(function (hasReviews) {
          if (hasReviews) {
            window.__REVIEWSIO_TEXT_BANNER_STORE_OVERRIDE__ = null;
            removePreviewBadge(el);
            emitPreviewRerender();
          } else {
            window.__REVIEWSIO_TEXT_BANNER_STORE_OVERRIDE__ = demo.store;
            addPreviewBadge(el, 'Sample preview');
            emitPreviewRerender();
          }
        })
        .catch(function () {
          window.__REVIEWSIO_TEXT_BANNER_STORE_OVERRIDE__ = demo.store;
          addPreviewBadge(el, 'Sample preview');
          emitPreviewRerender();
        });
    });

    // Card Carousel widget: if merchant has no reviews, fall back to demo store.
    applyToAll('[id^="reviewsio-carousel-widget"]', function (el) {
      var store = (typeof window.reviewsIoStore !== 'undefined' && window.reviewsIoStore) ? window.reviewsIoStore : null;

      if (!store) {
        window.__REVIEWSIO_CAROUSEL_STORE_OVERRIDE__ = demo.store;
        addPreviewBadge(el, 'Sample preview');
        emitPreviewRerender();
        return;
      }

      hasAnyMerchantReviews(store)
        .then(function (hasReviews) {
          if (hasReviews) {
            window.__REVIEWSIO_CAROUSEL_STORE_OVERRIDE__ = null;
            removePreviewBadge(el);
            emitPreviewRerender();
          } else {
            window.__REVIEWSIO_CAROUSEL_STORE_OVERRIDE__ = demo.store;
            addPreviewBadge(el, 'Sample preview');
            emitPreviewRerender();
          }
        })
        .catch(function () {
          window.__REVIEWSIO_CAROUSEL_STORE_OVERRIDE__ = demo.store;
          addPreviewBadge(el, 'Sample preview');
          emitPreviewRerender();
        });
    });

    // Rating snippet: use real store + product SKUs if there are ratings; otherwise fall back to demo store + demo SKUs.
    // This avoids the "demo-store + merchant-SKU" mismatch that makes the snippet appear broken.
    applyToAll('.ruk_rating_snippet', function (el) {
      var currentSku = el.getAttribute('data-sku') || '';
      if (!currentSku) {
        el.setAttribute('data-sku', demo.sku);
        currentSku = demo.sku;
      }

      var store = (typeof window.reviewsIoStore !== 'undefined' && window.reviewsIoStore) ? window.reviewsIoStore : null;
      if (!store) {
        // If core snippet isn't active, just ensure we can render something in editor.
        window.__REVIEWSIO_RATING_SNIPPET_STORE_OVERRIDE__ = demo.store;
        el.setAttribute('data-sku', demo.sku);
        addPreviewBadge(el, 'Sample preview');
        return;
      }

      var lang = (typeof window.reviewsIoLang !== 'undefined' && window.reviewsIoLang) ? window.reviewsIoLang : 'en';
      var url = 'https://api.reviews.io/product/rating-batch?store=' + encodeURIComponent(store) +
        '&sku=' + encodeURIComponent(currentSku) +
        '&useCustomLookup=false&customLookupSkuFallback=false&useProductGroup=false&mpnLookup=false&lang=' + encodeURIComponent(lang);

      safeFetchJson(url)
        .then(function (payload) {
          var hasAnyRatings = parseRatingBatchHasAnyRatings(payload);
          if (hasAnyRatings) {
            // Keep real store & SKUs.
            window.__REVIEWSIO_RATING_SNIPPET_STORE_OVERRIDE__ = null;
            removePreviewBadge(el);
            return;
          }

          // No ratings for this product in merchant store: show demo sample content.
          window.__REVIEWSIO_RATING_SNIPPET_STORE_OVERRIDE__ = demo.store;
          el.setAttribute('data-sku', demo.sku);
          addPreviewBadge(el, 'Sample preview');

          // If ratingSnippet already ran, attempt a re-init.
          if (typeof window.ratingSnippet === 'function') {
            try {
              window.ratingSnippet('ruk_rating_snippet', {
                store: demo.store,
                lang: lang
              });
            } catch (_) {
              // no-op
            }
          }
        })
        .catch(function () {
          // If the check fails, still ensure demo preview can render.
          window.__REVIEWSIO_RATING_SNIPPET_STORE_OVERRIDE__ = demo.store;
          el.setAttribute('data-sku', demo.sku);
          addPreviewBadge(el, 'Sample preview');
        });
    });

    // Evaluate product-level ratings once for widgets that need it (e.g. Polaris, Rating Bar on product pages).
    computeProductPreviewConfig();
  }

  var __reviewsioPreviewPassScheduled = false;
  function schedulePreviewPass() {
    if (__reviewsioPreviewPassScheduled) return;
    __reviewsioPreviewPassScheduled = true;
    window.setTimeout(function () {
      __reviewsioPreviewPassScheduled = false;
      runPreviewPass();
    }, 50);
  }

  // Run once for initial page load.
  runPreviewPass();

  // Theme Editor can inject blocks/sections after the initial load; re-run preview logic.
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', schedulePreviewPass);
  }
  document.addEventListener('shopify:section:load', schedulePreviewPass);
  document.addEventListener('shopify:block:select', schedulePreviewPass);
})();
