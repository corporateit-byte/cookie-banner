//=========================================
// SILKTIDE CONFIG + TRANSLATIONS
// ========================================= 

    window.addEventListener("load", function () {

        // =========================================
        // LANGUAGE NORMALIZATION
        // =========================================

        const lang =
            (document.documentElement.lang || "es-MX")
                .replace("-", "_");

        // =========================================
        // FALLBACK TRANSLATIONS
        // =========================================

        const fallbackTranslations = {

            en_US: {

                necessary: "Necessary",
                analytics: "Analytics",
                advertising: "Advertising",

                acceptAll: "Accept all",
                reject: "Reject non-essential",
                preferences: "Preferences",

                acceptAllAria: "Accept all cookies",
                rejectAria: "Reject non-essential cookies",
                preferencesAria: "Cookie preferences",

                preferencesTitle:
                    "Customize your cookie preferences",

                bannerDescription:
                    "We use cookies to enhance your experience, analyze traffic and improve our services.",

                preferencesDescription:
                    "We respect your privacy. You can choose which categories of cookies to allow.",

                necessaryDescription:
                    "These cookies are necessary for the website to function properly and cannot be switched off.",

                analyticsDescription:
                    "These cookies help us understand how visitors interact with the website.",

                advertisingDescription:
                    "These cookies are used for marketing and performance analysis.",

                cookiePolicy:
                    "Cookie Policy"
            }
        };

        // =========================================
        // TRANSLATION HELPER
        // =========================================

        function tr(key, fallback) {

            return fallbackTranslations?.[lang]?.[key]
                || fallback;
        }

        // =========================================
        // WAIT FOR SILKTIDE
        // =========================================

        function initSilktide(attempts = 0) {

            if (!window.silktideCookieBannerManager) {

                if (attempts < 20) {
                    setTimeout(() => initSilktide(attempts + 1), 300);
                } else {
                    console.error("Silktide no cargó");
                }

                return;
            }

            // AUTO LOAD CLARITY IF CONSENT ALREADY EXISTS

            const savedConsent =
                localStorage.getItem(
                    "silktide_cookie_preferences"
                );

            if (
                savedConsent &&
                savedConsent.includes('"analytics":true')
            ) {

                if (!window.__clarity_loaded) {

                    window.__clarity_loaded = true;

                    (function (c, l, a, r, i, t, y) {
                        c[a] = c[a] || function () {
                            (c[a].q = c[a].q || []).push(arguments)
                        };

                        t = l.createElement(r);
                        t.async = 1;
                        t.src = "https://www.clarity.ms/tag/u1zuapkydr";

                        y = l.getElementsByTagName(r)[0];
                        y.parentNode.insertBefore(t, y);

                    })(window, document, "clarity", "script");

                    console.log("Clarity auto-loaded");
                }
            }

            // RESET RELOAD FLAG IF CONSENT EXISTS
            if (
                localStorage.getItem("silktide_cookie_preferences")
            ) {
                sessionStorage.removeItem(
                    "silktide_reload_done"
                );
            }

            // =========================================
            // SILKTIDE CONFIG
            // =========================================

            silktideCookieBannerManager.updateCookieBannerConfig({

                background: {
                    showBackground: false
                },

                cookieIcon: {
                    position: "bottomLeft"
                },

                position: {
                    banner: "bottomCenter"
                },

                cookieTypes: [

                    // =====================================
                    // NECESSARY
                    // =====================================

                    {
                        id: "necessary",

                        name: tr("necessary", "Necesarias"),

                        description: `
            <p>
              ${tr(
                            "necessaryDescription",
                            "Estas cookies son necesarias para el funcionamiento correcto del sitio web y no pueden desactivarse."
                        )}
            </p>
          `,

                        required: true,

                        onAccept: function () {

                            gtag('consent', 'update', {
                                functionality_storage: 'granted',
                                security_storage: 'granted'
                            });

                            console.log('Necessary cookies active');
                        }
                    },

                    // =====================================
                    // ANALYTICS
                    // =====================================

                    {
                        id: "analytics",

                        name: tr("analytics", "Analíticas"),

                        description: `
            <p>
              ${tr(
                            "analyticsDescription",
                            "Estas cookies nos ayudan a comprender cómo interactúan los visitantes con el sitio web."
                        )}
            </p>
          `,

                        required: false,

                        defaultValue: !isEUVisitor,

                        onAccept: function () {

                            gtag('consent', 'update', {
                                analytics_storage: 'granted',
                                ad_storage: 'granted',
                                ad_user_data: 'granted',
                                ad_personalization: 'granted',
                                functionality_storage: 'granted',
                                security_storage: 'granted'
                            });

                            dataLayer.push({
                                event: 'consent_accepted_analytics'
                            });

                            // LOAD MICROSOFT CLARITY
                            if (!window.__clarity_loaded) {

                                window.__clarity_loaded = true;

                                (function (c, l, a, r, i, t, y) {
                                    c[a] = c[a] || function () {
                                        (c[a].q = c[a].q || []).push(arguments)
                                    };

                                    t = l.createElement(r);
                                    t.async = 1;
                                    t.src = "https://www.clarity.ms/tag/u1zuapkydr";

                                    y = l.getElementsByTagName(r)[0];
                                    y.parentNode.insertBefore(t, y);

                                })(window, document, "clarity", "script");
                            }

                            console.log('Analytics consent granted');

                            // FORCE TRACKERS RELOAD
                            if (!sessionStorage.getItem("silktide_reload_done")) {
                                sessionStorage.setItem(
                                    "silktide_reload_done",
                                    "true"
                                );

                                window.location.reload();
                            }
                        },

                        onReject: function () {

                            gtag('consent', 'update', {
                                analytics_storage: 'denied'
                            });

                            console.log('Analytics consent denied');
                        }
                    },

                    // =====================================
                    // ADVERTISING
                    // =====================================

                    {
                        id: "advertising",

                        name: tr("advertising", "Publicidad"),

                        description: `
            <p>
              ${tr(
                            "advertisingDescription",
                            "Estas cookies se utilizan para marketing y análisis de rendimiento."
                        )}
            </p>
          `,

                        required: false,

                        defaultValue: !isEUVisitor,

                        onAccept: function () {

                            gtag('consent', 'update', {
                                analytics_storage: 'granted',
                                ad_storage: 'granted',
                                ad_user_data: 'granted',
                                ad_personalization: 'granted',
                                functionality_storage: 'granted',
                                security_storage: 'granted'
                            });

                            dataLayer.push({
                                event: 'consent_accepted_advertising'
                            });

                            // LOAD AHREFS
                            if (!window.__ahrefs_loaded) {

                                window.__ahrefs_loaded = true;

                                const s = document.createElement("script");

                                s.src = "https://analytics.ahrefs.com/analytics.js";
                                s.async = true;

                                s.setAttribute(
                                    "data-key",
                                    "SruOZcdXKzrOHCj166agYw"
                                );

                                document.head.appendChild(s);
                            }

                            console.log('Advertising consent granted');

                            // FORCE TRACKERS RELOAD
                            // FORCE TRACKERS RELOAD
                            if (!sessionStorage.getItem("silktide_reload_done")) {
                                sessionStorage.setItem(
                                    "silktide_reload_done",
                                    "true"
                                );

                                window.location.reload();
                            }
                        },

                        onReject: function () {

                            gtag('consent', 'update', {
                                ad_storage: 'denied',
                                ad_user_data: 'denied',
                                ad_personalization: 'denied'
                            });

                            console.log('Advertising consent denied');
                        }
                    }
                ],

                // =====================================
                // TEXT
                // =====================================

                text: {

                    banner: {

                        description: `
            <p>
              ${tr(
                            "bannerDescription",
                            "Utilizamos cookies para mejorar tu experiencia, analizar tráfico y optimizar nuestros servicios."
                        )}

              <a href="/cookie-policy" target="_blank">
                ${tr("cookiePolicy", "Política de Cookies")}
              </a>
            </p>
          `,

                        acceptAllButtonText:
                            tr("acceptAll", "Aceptar todas"),

                        acceptAllButtonAccessibleLabel:
                            tr("acceptAllAria", "Aceptar todas las cookies"),

                        rejectNonEssentialButtonText:
                            tr("reject", "Rechazar no esenciales"),

                        rejectNonEssentialButtonAccessibleLabel:
                            tr("rejectAria", "Rechazar cookies no esenciales"),

                        preferencesButtonText:
                            tr("preferences", "Preferencias"),

                        preferencesButtonAccessibleLabel:
                            tr("preferencesAria", "Preferencias de cookies")
                    },

                    preferences: {

                        title:
                            tr(
                                "preferencesTitle",
                                "Personaliza tus preferencias de cookies"
                            ),

                        description: `
            <p>
              ${tr(
                            "preferencesDescription",
                            "Respetamos tu privacidad. Puedes elegir qué categorías de cookies permitir."
                        )}
            </p>
          `
                    }
                }
            });
        }

        initSilktide();

    });