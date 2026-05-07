//=========================================
// GOOGLE CONSENT MODE V2
//=========================================

window.dataLayer = window.dataLayer || [];

function gtag() {
  dataLayer.push(arguments);
}

// =========================================
// REGION DETECTION
// =========================================

const userTimezone =
  Intl.DateTimeFormat()
    .resolvedOptions()
    .timeZone || "";

// BASIC EU/EEA/UK DETECTION
const isEUVisitor = [

  "Europe/Amsterdam",
  "Europe/Andorra",
  "Europe/Athens",
  "Europe/Belgrade",
  "Europe/Berlin",
  "Europe/Brussels",
  "Europe/Bucharest",
  "Europe/Budapest",
  "Europe/Copenhagen",
  "Europe/Dublin",
  "Europe/Helsinki",
  "Europe/Lisbon",
  "Europe/Ljubljana",
  "Europe/London",
  "Europe/Luxembourg",
  "Europe/Madrid",
  "Europe/Malta",
  "Europe/Monaco",
  "Europe/Oslo",
  "Europe/Paris",
  "Europe/Prague",
  "Europe/Rome",
  "Europe/Stockholm",
  "Europe/Vienna",
  "Europe/Warsaw",
  "Europe/Zurich"

].includes(userTimezone);

// =========================================
// DEFAULT CONSENT
// =========================================

const defaultConsent = isEUVisitor

  // EU / GDPR
  ? {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      functionality_storage: 'granted',
      security_storage: 'granted'
    }

  // REST OF WORLD
  : {
      analytics_storage: 'granted',
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      functionality_storage: 'granted',
      security_storage: 'granted'
    };

gtag('consent', 'default', {
  ...defaultConsent,
  wait_for_update: 500
});

console.log("Timezone:", userTimezone);
console.log("EU visitor:", isEUVisitor);
console.log("Consent mode:", defaultConsent);