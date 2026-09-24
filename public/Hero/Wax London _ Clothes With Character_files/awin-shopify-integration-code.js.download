(function (w) {
	var UPDATED_AT = '2025-02-18';

	var LIMIT_TO_SEND_CALLS = 5 * 60 * 1000; /* 5 minutes in ms */

	// atb: 23014, 22620
	var S2S_EXCEPTIONS = [
		23014, 22620, 2453, 7586, 7760, 12979, 14850, 15117, 15370, 17038, 17141, 18386, 19574, 19589, 19648, 20086,
		20922, 21051, 21066, 21097, 21130, 21208, 21279, 21321, 21487, 21518, 21526, 21580, 21626, 21671, 21908, 22013,
		22060, 22112, 22127, 22130, 22211, 22246, 22286, 22334, 22397, 22401, 22470, 22594, 22596, 22635, 22675, 22690,
		22697, 22705, 22728, 22742, 22770, 22790, 22801, 22829, 22844, 22860, 22904, 22947, 22967, 23053, 23139, 23176,
		23185, 23246, 23266, 23275, 23400, 23411, 23468, 23485, 23586, 23587, 23707, 23726, 23760, 23771, 23775, 23777,
		23789, 23809, 23855, 24076, 24077, 24080, 24107, 24162, 24211, 24229, 24286, 24355, 24445, 24475
	];

	var trackingConsent;

	function loadShopifyCustomerPrivacy() {
		return new Promise(function (resolve) {
			if (w.Shopify && w.Shopify.customerPrivacy) {
				return resolve(w.Shopify.customerPrivacy);
			}

			if (!w.Shopify || typeof w.Shopify.loadFeatures !== 'function') {
				return resolve(null);
			}

			w.Shopify.loadFeatures([{ name: 'consent-tracking-api', version: '0.1' }], function (error) {
				if (error) {
					return resolve(null);
				}
				resolve(w.Shopify.customerPrivacy || null);
			});
		});
	}

	function getTrackingConsent(w) {
		if (!w.Shopify) {
			return undefined;
		}

		const { customerPrivacy } = w.Shopify;

		// Fall back to cookie if customerPrivacy API is not available
		if (!customerPrivacy) {
			return getTrackingConsentCookie();
		}

		const { currentVisitorConsent, shouldShowBanner } = customerPrivacy;

		// Check if required methods exist
		if (typeof currentVisitorConsent !== 'function' || typeof shouldShowBanner !== 'function') {
			return undefined;
		}

		// Return undefined if banner should not be shown
		if (!shouldShowBanner()) {
			return undefined;
		}

		const consent = currentVisitorConsent();

		// Return true only if both marketing and analytics consent are given
		return consent ? consent.marketing === 'yes' && consent.analytics === 'yes' : undefined;
	}

	function getTrackingConsentCookie() {
		try {
			const TRACKING_CONSENT_COOKIE = '_tracking_consent=';
			const cookies = document.cookie.split('; ');

			// Find tracking consent cookie
			const trackingConsentCookie = cookies.find((cookie) => cookie.startsWith(TRACKING_CONSENT_COOKIE));
			if (!trackingConsentCookie) {
				return undefined;
			}

			// Parse cookie value
			const trackingConsentValue = trackingConsentCookie.substring(TRACKING_CONSENT_COOKIE.length);
			const consentObject = JSON.parse(decodeURIComponent(trackingConsentValue));

			// Return undefined if banner should not be displayed
			if (consentObject.display_banner === false) {
				return undefined;
			}

			const { CMP } = consentObject.con;

			// Return false if no consent values are set
			if (CMP.a === '' && CMP.m === '') {
				return false;
			}

			// Return true only if both marketing and analytics consent are granted
			return CMP.a === '1' && CMP.m === '1';
		} catch (e) {
			return undefined;
		}
	}

	function setCookieDomain() {
		if (document.location.href.indexOf('.myshopify.com') !== -1) {
			var mtCookieDomainScript = document.createElement('script');
			mtCookieDomainScript.innerText = 'var AWIN = AWIN || {};\n';
			mtCookieDomainScript.innerText += 'AWIN.Tracking =  AWIN.Tracking || {};\n';
			mtCookieDomainScript.innerText += 'var domain = location.hostname;\n';
			mtCookieDomainScript.innerText += 'AWIN.Tracking.cookieDomain = domain;\n';
			document.body.appendChild(mtCookieDomainScript);
		}
	}

	const confirmationPageReloadRegularExp = new RegExp('/\\d+/orders/[a-f0-9]+');

	function getAppVersion(url) {
		var rx = new RegExp('[?&]v=([^&]+).*$');
		if (url) {
			return url.match(rx)[1];
		}
		return null;
	}

	function sanitizeAdvertiserId(advertiserId) {
		var value = String(advertiserId);
		if (!/^\d+$/.test(value)) {
			return '';
		}
		return value;
	}

	function getAdvertiserId(url) {
		var rx = new RegExp('[?&](advertiserid|mid|aid)=([^&]+).*$');
		var returnVal = url.match(rx);
		if (returnVal === null) {
			return '';
		}
		return sanitizeAdvertiserId(returnVal[2]);
	}

	function readCookiesAsString(awRegEx) {
		var aCookies = document.cookie.split(';');
		var cookies = [];
		for (var i = 0; i < aCookies.length; i++) {
			var aParts = aCookies[i].split('=');
			if (awRegEx.test(aParts[0])) {
				cookies.push(aParts[1]);
			}
		}
		return cookies.join(',');
	}

	function getAwc(consent) {
		var rx = new RegExp('[?&]awc=([^&]+).*$');
		var returnVal = document.location.href.match(rx);

		if (returnVal !== null) {
			if (returnVal[1] && returnVal[1].match(/[0-9]+_[0-9]+_[a-zA-Z0-9]+/)) {
				return returnVal[1];
			}
		}
		// cookies
		var awcFromCookie = consent !== false ? readCookiesAsString(/_aw_m_\d+/) : '';
		var awcFromSnCookie = readCookiesAsString(/_aw_sn_\d+/);

		if (awcFromCookie.length > 0 && awcFromSnCookie.length > 0) {
			return awcFromCookie + ',' + awcFromSnCookie;
		} else if (awcFromCookie.length > 0) {
			return awcFromCookie;
		} else if (awcFromSnCookie.length > 0) {
			return awcFromSnCookie;
		}

		return '';
	}

	function getSource(consent) {
		var rx = new RegExp('[?&]source=([^&]+).*$');
		var returnVal = document.location.href.match(rx);

		if (returnVal !== null) {
			var validatedValue = returnVal[1].replace(/[^a-zA-Z0-9-_]/g, '');
			return validatedValue;
		}

		var sourceFromCookie = consent !== false ? readCookiesAsString(/_aw_channel$/) : '';

		if (sourceFromCookie.length > 0) {
			return sourceFromCookie;
		}

		return '';
	}

	function setSourceCookie(source, expiresOverrideDate) {
		var cookieName = '_aw_channel';
		var expires = new Date();
		if (expiresOverrideDate) {
			expires.setTime(expiresOverrideDate.getTime() + 365 * 24 * 60 * 60 * 1000);
		} else {
			expires.setTime(expires.getTime() + 365 * 24 * 60 * 60 * 1000);
		}

		var cookieValue = source.indexOf('|') !== -1 ? source : source + '|' + Math.round(expires.getTime() / 1000);
		var domain = location.hostname;

		document.cookie =
			cookieName + '=' + cookieValue + ';expires=' + expires.toGMTString() + ';path=/;domain=' + domain;
	}

	function getScriptUrl() {
		var scriptUrl;

		var scripts = document.getElementsByTagName('script');
		for (var n = 0; n < scripts.length; n++) {
			var script = scripts[n];
			if (script.src && script.src.indexOf('/awin-shopify-integration-code.js') !== -1) {
				scriptUrl = script.src;
			}
		}
		return scriptUrl;
	}

	function getOrderLabel() {
		try {
			return document.getElementsByClassName('os-order-number')[0].innerText.trim();
		} catch (e) {}
	}

	function getOrderRef() {
		var ref;
		try {
			var order_label = getOrderLabel();
			if (order_label) {
				var parts = order_label.split(' ');
				if (parts.length > 2) {
					// TODO: decide if this case even makes sense / is applicable => check db for orders /wo '#'
					if (/\s[\d]{4,}/.test(order_label)) {
						var order_number = extractNumber(order_label);
						if (order_number) {
							ref = order_number;
						}
					} else {
						ref = findOrderNumberPart(parts);
					}
				} else {
					ref = findOrderNumberPart(parts);
				}
			}
			if (!ref) {
				ref = window.Shopify.checkout.order_id;
			}
			if (!ref) {
				throw Error('order_ref_error');
			}
		} catch (err) {
			ref = window.Shopify.checkout.order_id;
		}
		return ref;
	}

	function findOrderNumberPart(partsArray) {
		for (var i = 0; i < partsArray.length; i++) {
			if (/[\d]{4,}/.test(partsArray[i])) {
				// works with OUR confirmation id/name as well
				// If (/[\dA-Z]{4,10}/.test(partsArray[i])) {
				return partsArray[i];
			}
		}
	}

	function extractNumber(orderString) {
		var numberMatches = orderString.match(/[\d]{4,}/);
		if (numberMatches.length > 0) {
			return numberMatches[numberMatches.length - 1];
		}
	}

	function setCartNoteAttributes(pAwc, pSource) {
		var noteAttributes = {
			__awin_channel: pSource
		};

		if (pAwc) {
			noteAttributes.__awc = pAwc;
		}

		if ('fetch' in window) {
			fetch('/cart/update.js', {
				method: 'POST',
				body: JSON.stringify({
					note: '',
					attributes: noteAttributes
				}),
				headers: {
					'Content-type': 'application/json'
				}
			});
		}
	}

	function handleCheckout(advertiserId, consent) {
		var source = '';
		var fullSource = getSource();
		var scriptUrl = getScriptUrl();
		var appVersion = getAppVersion(scriptUrl);
		if (fullSource.indexOf('|') !== -1) {
			// use source only if from new cookie
			source = fullSource.split('|')[0];
		}

		var orderRef = encodeURIComponent(getOrderRef());
		var checkout = window.Shopify.checkout;
		var preparedItems = getPreparedItemDetails(checkout.line_items);
		var netPrice = getTotalOrderAmount(preparedItems);

		if (orderRef !== 'undefined') {
			var pixelSrc = getPixelUrl(advertiserId, checkout, netPrice, orderRef, source, appVersion, consent);
			var pixel = document.createElement('img');
			pixel.setAttribute('width', '0');
			pixel.setAttribute('height', '0');
			pixel.setAttribute('border', '0');
			pixel.setAttribute('style', 'display: none;');

			pixel.src = pixelSrc;
			document.body.appendChild(pixel);

			var saleObjectString = getSaleObjectString(checkout, netPrice, orderRef, source, appVersion);

			var masterTagCheckoutScript = document.createElement('script');
			masterTagCheckoutScript.innerHTML = saleObjectString;
			document.body.appendChild(masterTagCheckoutScript);
		}

		var basketItemLines = getBasketItemString(advertiserId, checkout, preparedItems);

		var form = document.createElement('form');
		form.style = 'display:none';
		form.name = 'aw_basket_form';

		var textarea = document.createElement('textarea');
		textarea.id = 'aw_basket';
		textarea.wrap = 'physical';

		textarea.innerHTML = basketItemLines.join('\n');

		form.appendChild(textarea);
		document.body.appendChild(form);
	}

	function getSaleObjectString(checkout, netPrice, orderRef, source, appVersion) {
		var scriptAsString = 'var AWIN = AWIN || {};\n';
		scriptAsString += 'AWIN.Tracking =  AWIN.Tracking || {};\n';
		scriptAsString += 'AWIN.Tracking.Sale = {};\n';
		scriptAsString += "AWIN.Tracking.Sale.amount = '" + netPrice + "';\n";
		scriptAsString += "AWIN.Tracking.Sale.channel = '" + source + "';\n";
		scriptAsString += "AWIN.Tracking.Sale.currency = '" + checkout.presentment_currency + "';\n";
		scriptAsString += "AWIN.Tracking.Sale.orderRef = '" + checkout.order_id + "';\n";
		scriptAsString += "AWIN.Tracking.Sale.parts = 'DEFAULT:" + netPrice + "';\n";

		if (checkout.discount) {
			scriptAsString += "AWIN.Tracking.Sale.voucher = '" + checkout.discount.code + "';\n";
		}
		scriptAsString += 'AWIN.Tracking.Sale.test = 0;\n';
		scriptAsString += 'AWIN.Tracking.Sale.custom = ["' + appVersion + '" , "' + orderRef + '" , "mt"];\n';
		scriptAsString += 'AWIN.Tracking.SkipBasketSubmit = true;\n';

		return scriptAsString;
	}

	function getPixelUrl(advertiserId, checkout, netPrice, orderRef, source, appVersion, consent) {
		var pixelSrc = 'https://www.awin1.com/sread.img?tt=sp&tv=2';
		pixelSrc += '&merchant=' + advertiserId;
		pixelSrc += '&amount=' + netPrice;
		pixelSrc += '&ch=' + source;
		pixelSrc += '&cr=' + checkout.presentment_currency;
		pixelSrc += '&ref=' + checkout.order_id;
		pixelSrc += '&parts=DEFAULT:' + netPrice;
		pixelSrc += '&vc=';
		if (checkout.discount) {
			pixelSrc += checkout.discount.code;
		}
		pixelSrc += '&p1=' + encodeURIComponent(appVersion);
		pixelSrc += '&p3=img';
		if (consent !== undefined) {
			pixelSrc += '&cons=' + consent;
		}

		return pixelSrc;
	}

	function getBasketItemString(advertiserId, checkout, preparedItems) {
		var basketlines = [];
		for (var i = 0; i < preparedItems.length; i++) {
			var line = 'AW:P|';
			line += advertiserId + '|';
			line += checkout.order_id + '|';
			line += preparedItems[i].productId + '|';
			line += getProductName(preparedItems[i].title) + '|';
			line += roundToFixedCommercially(preparedItems[i].itemNetPrice).toFixed(2) + '|';
			line += preparedItems[i].quantity + '|';
			line += preparedItems[i].sku + '|';
			line += 'DEFAULT|';

			basketlines.push(line);
		}
		return basketlines;
	}

	function getProductName(name) {
		if (name.indexOf('|') > 0) {
			for (var encodeTime = 0; encodeTime < 2; encodeTime++) {
				name = encodeURIComponent(name);
			}
		}
		return name;
	}

	function roundToFixedCommercially(number) {
		return Math.round(number * 100) / 100;
	}

	function getTotalOrderAmount(preparedItems) {
		var total = 0;
		for (var itemIndex = 0; itemIndex < preparedItems.length; itemIndex++) {
			var preparedLineItem = preparedItems[itemIndex];
			var singleItemPrice = preparedLineItem.itemNetPrice.toFixed(2);
			total += preparedLineItem.quantity * parseFloat(singleItemPrice);
		}

		return roundToFixedCommercially(total).toFixed(2);
	}

	function getPreparedItemDetails(lineItems) {
		var preparedItems = [];
		for (var i = 0; i < lineItems.length; i++) {
			var itemNetPrice = Number(lineItems[i].price);
			var lineNetPrice = Number(lineItems[i].line_price) || Number(itemNetPrice) * lineItems[i].quantity;

			if (lineItems[i].discount_allocations.length > 0) {
				var lineDiscount = 0;
				for (var index = 0; index < lineItems[i].discount_allocations.length; index++) {
					lineDiscount += Number(lineItems[i].discount_allocations[index].amount);
				}
				lineNetPrice -= lineDiscount;
				itemNetPrice -= lineDiscount / lineItems[i].quantity;
			}

			preparedItems.push({
				productId: lineItems[i].product_id,
				title: lineItems[i].title,
				itemNetPrice: roundToFixedCommercially(itemNetPrice),
				lineNetPrice: roundToFixedCommercially(lineNetPrice),
				quantity: lineItems[i].quantity,
				sku: lineItems[i].sku
			});
		}
		return preparedItems;
	}

	function addMasterTag(advertiserId) {
		var safeAdvertiserId = sanitizeAdvertiserId(advertiserId);
		if (!safeAdvertiserId) {
			return;
		}

		var masterTagScript = document.createElement('script');
		masterTagScript.type = 'text/javascript';
		masterTagScript.setAttribute('defer', 'defer');
		// call via the app proxy for better availability
		masterTagScript.src = '/apps/awin/' + safeAdvertiserId + '.js';
		document.body.appendChild(masterTagScript);
	}

	function sendDebugBeacon(advertiserId) {
		try {
			var dbgUrl = 'https://www.wepowerconnections.com/dbg';
			var shopify;
			if (window.Shopify) {
				try {
					var shopifyJson = JSON.stringify(window.Shopify);
					shopify = JSON.parse(shopifyJson);
				} catch (e) {
					shopify = window.Shopify;
				}

				shopify.referer = document.location.href;
				shopify.refLabelOnPage = getOrderLabel();
				shopify.refFromPage = getOrderRef();
				shopify.advertiserId = advertiserId;

				var shopifyObject = JSON.stringify(filterCheckout(shopify));

				fetch(dbgUrl, {
					method: 'POST',
					keepalive: true,
					headers: { 'Content-Type': 'application/json' },
					body: shopifyObject
				});
			}
		} catch (error) {}
	}

	function filterCheckout(shopify) {
		if (shopify.Checkout) {
			if (shopify.Checkout.geolocatedAddress) {
				delete shopify.Checkout.geolocatedAddress;
			}
		}
		if (shopify.checkout) {
			var checkout = shopify.checkout;
			if (checkout.billing_address) {
				delete checkout.billing_address;
			}
			if (checkout.credit_card) {
				delete checkout.credit_card;
			}
			if (checkout.shipping_address) {
				delete checkout.shipping_address;
			}
			if (checkout.email) {
				delete checkout.email;
			}

			if (checkout.line_items && typeof checkout.line_items === 'object' && checkout.line_items.length) {
				for (var index = 0; index < checkout.line_items.length; index++) {
					var element = checkout.line_items[index];
					if (element.destination_location) {
						delete element.destination_location;
					}
				}
			}
		}
		return shopify;
	}

	function run(appendMasterTag, consentOverride) {
		var consent = consentOverride !== undefined ? consentOverride : trackingConsent;
		var scriptUrl = getScriptUrl();
		if (typeof scriptUrl !== 'undefined') {
			var advertiserId = getAdvertiserId(scriptUrl);
			var awc = getAwc(consent);
			var fullSourceValue = getSource(consent);

			if (advertiserId) {
				if (S2S_EXCEPTIONS.indexOf(parseInt(advertiserId)) === -1) {
					if (awc) {
						var source = fullSourceValue.split('|')[0];
						if (window.location.pathname !== '/cart') {
							setCartNoteAttributes(awc, source);
						}
					}
				}

				if (fullSourceValue !== '') {
					// no source cookie without explicit consent
					if (consent !== false) {
						if (fullSourceValue.indexOf('|') !== -1) {
							// refresh from cookie
							var sourceParts = fullSourceValue.split('|');
							var sourceDate = new Date(parseInt(sourceParts[1]) * 1000);
							setSourceCookie(fullSourceValue, sourceDate);
						} else {
							// set newly from qs
							setSourceCookie(fullSourceValue);
						}
					}
				}

				setCookieDomain();

				if (window.Shopify && window.Shopify.checkout) {
					// TODO: remove this, we do not need it anymore
					sendDebugBeacon(advertiserId);

					var createdOrderDate = new Date(window.Shopify.checkout.created_at);
					if (isNaN(createdOrderDate) || new Date() - createdOrderDate < LIMIT_TO_SEND_CALLS) {
						const firstTimeAccessed = !confirmationPageReloadRegularExp.test(window.location.href);
						if (firstTimeAccessed) {
							handleCheckout(advertiserId, consent);
						}
					}
				}

				if (typeof consent !== 'undefined') {
					w.AWIN.Tracking.AdvertiserConsent = consent;
				}

				if (appendMasterTag !== false) {
					addMasterTag(advertiserId);
				}
			}
		}
	}

	function getAwinTrackingConsent() {
		return w.Awin.Tracking.Consent ?? undefined;
	}

	function setTrackingConsent(value) {
		trackingConsent = value;
	}

	w.AWIN = w.AWIN || {};
	w.AWIN.Tracking = w.AWIN.Tracking || {};
	w.AWIN.Shopify = {
		run: run,
		handleCheckout: handleCheckout,
		getPreparedItemDetails: getPreparedItemDetails,
		getTotalOrderAmount: getTotalOrderAmount,
		getSaleObjectString: getSaleObjectString,
		getPixelUrl: getPixelUrl,
		getBasketItemString: getBasketItemString,
		getTrackingConsent: getTrackingConsent,
		getTrackingConsentCookie: getTrackingConsentCookie,
		getAwinTrackingConsent: getAwinTrackingConsent,
		setTrackingConsent: setTrackingConsent,
		loadShopifyCustomerPrivacy: loadShopifyCustomerPrivacy,
		version: getAppVersion(getScriptUrl())
	};

	document.addEventListener('visitorConsentCollected', function (event) {
		if (
			w &&
			w.AWIN &&
			w.AWIN.Tracking &&
			w.AWIN.Tracking.Consent &&
			typeof w.AWIN.Tracking.Consent.setAdvertiserConsentStatus === 'function'
		) {
			trackingConsent = event.detail.marketingAllowed === true && event.detail.analyticsAllowed === true;
			w.AWIN.Tracking.Consent.setAdvertiserConsentStatus(trackingConsent);
		}
		w.AWIN.Shopify.run(false, trackingConsent);
	});

	loadShopifyCustomerPrivacy().then(function () {
		trackingConsent = getTrackingConsent(w);
		run(true, trackingConsent);
	});
})(window);
