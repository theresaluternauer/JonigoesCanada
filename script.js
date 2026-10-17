
/* =========================================
   SPENDENFORTSCHRITT
   ========================================= */

const ziel = 5000;
const gesammelt = 1500;

// Beträge im Schweizer Format darstellen
function chf(value) {
  return "CHF " + new Intl.NumberFormat("de-CH").format(value);
}

document.addEventListener("DOMContentLoaded", () => {
  const prozent = ziel > 0
    ? Math.min(100, Math.max(0, Math.round((gesammelt / ziel) * 100)))
    : 0;

  const raised = document.getElementById("amount-raised");
  const goal = document.getElementById("amount-goal");
  const percent = document.getElementById("progress-percent");
  const fill = document.getElementById("progress-fill");

  if (raised) raised.textContent = chf(gesammelt);
  if (goal) goal.textContent = chf(ziel);
  if (percent) percent.textContent = prozent + "%";

  if (fill) {
    fill.style.width = prozent + "%";
  }
});


/* =========================================
   GOOGLE SHEET
   ========================================= */

const FORM_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbzTsNjAb7TTSK7SxAeqT44BfcaWVZDBbc-eA-F5aHfeLnHY6bnLGwCbP9LQZauzraSBqQ/exec";


/* =========================================
   SPENDENFORMULAR
   ========================================= */
function updateDonationForm() {
  const method = document.querySelector('input[name="payment_method"]:checked')?.value;
  document.getElementById("twint-info").hidden = method !== "TWINT";
  document.getElementById("bank-info").hidden = method !== "Banküberweisung";
  const gift = document.querySelector('input[name="wants_gift"]:checked')?.value === "yes";
  document.getElementById("gift-fields").hidden = !gift;
  const address = document.getElementById("support-address");
  address.required = gift;
  if (!gift) address.value = "";
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("reward-form");
  if (!form) return;
  const note = document.getElementById("form-note");
  const confirmation = document.getElementById("bank-confirmation");
  const button = form.querySelector('button[type="submit"]');

  form.querySelectorAll('input[name="payment_method"], input[name="wants_gift"]').forEach(input => {
    input.addEventListener("change", updateDonationForm);
  });
  updateDonationForm();

  document.getElementById("copy-iban")?.addEventListener("click", async (event) => {
    try {
      await navigator.clipboard.writeText(document.getElementById("iban-value").textContent.trim());
      event.currentTarget.textContent = "Kopiert ✓";
    } catch (error) {
      event.currentTarget.textContent = "Bitte IBAN manuell kopieren";
    }
  });

  form.addEventListener("submit", async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const method = data.get("payment_method");
    data.set("reward", data.get("wants_gift") === "yes" ? "Dankeschön gewünscht" : "Kein Dankeschön");
    data.set("publish_name", data.get("publish_choice") === "yes" ? "true" : "false");
    data.set("payment_status", "Offen");

    
button.disabled = true;
button.textContent = "Wird übermittelt …";
note.textContent = "Einen Moment …";
confirmation.hidden = true;

try {
  await fetch(FORM_ENDPOINT, {
    method: "POST",
    body: data,
    mode: "no-cors"
  });

  if (method === "TWINT") {
    note.textContent =
      "Angaben übermittelt, vielen Dank! Du hörst von uns, sobald die TWINT-Anfrage erfolgt ist.";
  } else if (method === "Banküberweisung") {
    note.textContent =
      "Angaben übermittelt, die Zahlungsangaben werden dir auch via E-Mail gesendet.";
    confirmation.hidden = false;
  }

  note.className = "submit-status success";
  button.textContent = "Übermittelt";

  // Angaben bleiben sichtbar.

} catch (error) {
  console.error(error);
  note.textContent =
    "Die Übermittlung konnte nicht bestätigt werden. Bitte versuche es erneut.";
  note.className = "submit-status error";
  button.disabled = false;
  button.textContent = "Unterstützen";
}

  });
});
