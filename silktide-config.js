// =========================================
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
  // EU COUNTRIES
  // =========================================

  const EU_COUNTRIES = [
    "AT", "BE", "BG", "HR", "CY", "CZ", "DE", "DK", "EE",
    "ES", "FI", "FR", "GR", "HU", "IE", "IT", "LT", "LU",
    "LV", "MT", "NL", "PL", "PT", "RO", "SE", "SI", "SK",
    "IS", "LI", "NO", "CH", "GB"
  ];

  // =========================================
  // COUNTRY DETECTION
  // =========================================
  // REQUIRES CLOUDFLARE COUNTRY HEADER
  // =========================================

  const visitorCountry =
    window.CF_COUNTRY ||
    document.documentElement.getAttribute("data-country") ||
    "MX";

  const isEUVisitor =
    EU_COUNTRIES.includes(visitorCountry);

  //console.log("Visitor country:", visitorCountry);
  //console.log("EU visitor:", isEUVisitor);

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
  // LOAD CLARITY
  // =========================================

  function loadClarity() {

    if (window.__clarity_loaded) {
      return;
    }

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

    //console.log("Clarity loaded");
  }

  // =========================================
  // DISABLE CLARITY
  // =========================================

  function disableClarity() {

    window.__clarity_loaded = false;

    window.clarity = function () { };

    // REMOVE COOKIES
    document.cookie =
      "_clck=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    document.cookie =
      "_clsk=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // REMOVE STORAGE
    localStorage.removeItem("_clck");
    sessionStorage.removeItem("_clsk");

    //console.log("Clarity disabled");
  }

  // =========================================
  // LOAD AHREFS
  // =========================================

  function loadAhrefs() {

    if (window.__ahrefs_loaded) {
      return;
    }

    window.__ahrefs_loaded = true;

    const s = document.createElement("script");

    s.src =
      "https://analytics.ahrefs.com/analytics.js";

    s.async = true;

    s.setAttribute(
      "data-key",
      "SruOZcdXKzrOHCj166agYw"
    );

    document.head.appendChild(s);

    //console.log("Ahrefs loaded");
  }

  // =========================================
  // DISABLE AHREFS
  // =========================================

  function disableAhrefs() {

    window.__ahrefs_loaded = false;

    //console.log("Ahrefs disabled");
  }

  // =========================================
  // EXISTING CONSENT
  // =========================================

  const existingConsent =
    localStorage.getItem(
      "silktide_cookie_preferences"
    );

  // =========================================
  // AUTO ENABLE NON-EU
  // ONLY ON FIRST VISIT
  // =========================================

  if (!isEUVisitor && !existingConsent) {

    const defaultConsent = {

      necessary: true,

      analytics: true,

      advertising: true
    };

    localStorage.setItem(

      "silktide_cookie_preferences",

      JSON.stringify(defaultConsent)
    );

    gtag('consent', 'update', {

      analytics_storage: 'granted',

      ad_storage: 'granted',

      ad_user_data: 'granted',

      ad_personalization: 'granted',

      functionality_storage: 'granted',

      security_storage: 'granted'
    });

    loadClarity();
    loadAhrefs();

    //console.log("Non-EU first visit: all cookies enabled");
  }

  // =========================================
  // WAIT FOR SILKTIDE
  // =========================================

  function initSilktide(attempts = 0) {

    if (!window.silktideCookieBannerManager) {

      if (attempts < 20) {

        setTimeout(
          () => initSilktide(attempts + 1),
          300
        );

      } else {

        console.error("Silktide no cargó");
      }

      return;
    }

    // =========================================
    // LOAD SAVED CONSENT
    // =========================================

    try {

      const consentRaw =
        localStorage.getItem(
          "silktide_cookie_preferences"
        );

      if (consentRaw) {

        const consent =
          JSON.parse(consentRaw);

        //console.log("Saved consent:",consent);

        // ANALYTICS
        if (consent.analytics === true) {

          loadClarity();

        } else {

          disableClarity();
        }

        // ADVERTISING
        if (consent.advertising === true) {

          loadAhrefs();

        } else {

          disableAhrefs();
        }
      }

    } catch (e) {

      console.error(
        "Error reading consent",
        e
      );
    }

    // =========================================
    // SILKTIDE CONFIG
    // =========================================

    silktideCookieBannerManager
      .updateCookieBannerConfig({

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

            name:
              tr(
                "necessary",
                "Necesarias"
              ),

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

                functionality_storage:
                  'granted',

                security_storage:
                  'granted'
              });

              //console.log('Necessary cookies active');
            }
          },

          // =====================================
          // ANALYTICS
          // =====================================

          {
            id: "analytics",

            name:
              tr(
                "analytics",
                "Analíticas"
              ),

            description: `
            <p>
              ${tr(
              "analyticsDescription",
              "Estas cookies nos ayudan a comprender cómo interactúan los visitantes con el sitio web."
            )}
            </p>
          `,

            required: false,

            defaultValue:
              !isEUVisitor,

            onAccept: function () {

              gtag('consent', 'update', {

                analytics_storage:
                  'granted',

                functionality_storage:
                  'granted',

                security_storage:
                  'granted'
              });

              dataLayer.push({
                event:
                  'consent_accepted_analytics'
              });

              loadClarity();

              // SAVE CONSENT
              const consent =
                JSON.parse(
                  localStorage.getItem(
                    "silktide_cookie_preferences"
                  ) || "{}"
                );

              consent.analytics = true;

              localStorage.setItem(

                "silktide_cookie_preferences",

                JSON.stringify(consent)
              );

              //console.log('Analytics consent granted');
            },

            onReject: function () {

              gtag('consent', 'update', {

                analytics_storage:
                  'denied'
              });

              disableClarity();

              // SAVE CONSENT
              const consent =
                JSON.parse(
                  localStorage.getItem(
                    "silktide_cookie_preferences"
                  ) || "{}"
                );

              consent.analytics = false;

              localStorage.setItem(

                "silktide_cookie_preferences",

                JSON.stringify(consent)
              );

              //console.log('Analytics consent denied');
            }
          },

          // =====================================
          // ADVERTISING
          // =====================================

          {
            id: "advertising",

            name:
              tr(
                "advertising",
                "Publicidad"
              ),

            description: `
            <p>
              ${tr(
              "advertisingDescription",
              "Estas cookies se utilizan para marketing y análisis de rendimiento."
            )}
            </p>
          `,

            required: false,

            defaultValue:
              !isEUVisitor,

            onAccept: function () {

              gtag('consent', 'update', {

                ad_storage:
                  'granted',

                ad_user_data:
                  'granted',

                ad_personalization:
                  'granted'
              });

              dataLayer.push({
                event:
                  'consent_accepted_advertising'
              });

              loadAhrefs();

              // SAVE CONSENT
              const consent =
                JSON.parse(
                  localStorage.getItem(
                    "silktide_cookie_preferences"
                  ) || "{}"
                );

              consent.advertising = true;

              localStorage.setItem(

                "silktide_cookie_preferences",

                JSON.stringify(consent)
              );

              //console.log('Advertising consent granted');
            },

            onReject: function () {

              gtag('consent', 'update', {

                ad_storage:
                  'denied',

                ad_user_data:
                  'denied',

                ad_personalization:
                  'denied'
              });

              disableAhrefs();

              // SAVE CONSENT
              const consent =
                JSON.parse(
                  localStorage.getItem(
                    "silktide_cookie_preferences"
                  ) || "{}"
                );

              consent.advertising = false;

              localStorage.setItem(

                "silktide_cookie_preferences",

                JSON.stringify(consent)
              );

              //console.log('Advertising consent denied');
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
                ${tr(
              "cookiePolicy",
              "Política de Cookies"
            )}
              </a>
            </p>
          `,

            acceptAllButtonText:
              tr(
                "acceptAll",
                "Aceptar todas"
              ),

            acceptAllButtonAccessibleLabel:
              tr(
                "acceptAllAria",
                "Aceptar todas las cookies"
              ),

            rejectNonEssentialButtonText:
              tr(
                "reject",
                "Rechazar no esenciales"
              ),

            rejectNonEssentialButtonAccessibleLabel:
              tr(
                "rejectAria",
                "Rechazar cookies no esenciales"
              ),

            preferencesButtonText:
              tr(
                "preferences",
                "Preferencias"
              ),

            preferencesButtonAccessibleLabel:
              tr(
                "preferencesAria",
                "Preferencias de cookies"
              )
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
