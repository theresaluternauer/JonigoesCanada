
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
   DANKESCHÖN: JA / NEIN
   ========================================= */

function showThankYouForm(show) {
  const form = document.getElementById("reward-form");
  const noMessage = document.getElementById("thanks-no-message");
  const buttons = document.querySelectorAll(".yes-no-button");

  buttons.forEach(button => {
    const active =
      (show && button.dataset.answer === "yes") ||
      (!show && button.dataset.answer === "no");

    button.classList.toggle("active", active);
  });

  if (form) {
    form.style.display = show ? "block" : "none";

    if (!show) {
      form.reset();
    }
  }

  if (noMessage) {
    noMessage.style.display = show ? "none" : "block";
  }
}


/* =========================================
   FORMULAR ABSENDEN
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("reward-form");
  const formNote = document.getElementById("form-note");

  // Falls kein Formular vorhanden ist:
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const button = form.querySelector('button[type="submit"]');

    if (!button) return;

    const data = new FormData(form);

    // Keine Geschenkauswahl mehr.
    // Im Google Sheet bleibt die bisherige Spalte erhalten.
    data.set("reward", "Dankeschön gewünscht");

    // Checkbox korrekt als true / false übertragen
    data.set(
      "publish_name",
      data.has("publish_name") ? "true" : "false"
    );

    button.disabled = true;
    button.textContent = "Wird gesendet …";

    if (formNote) {
      formNote.textContent = "Einen Moment …";
      formNote.className = "submit-status";
    }

    try {
      await fetch(FORM_ENDPOINT, {
        method: "POST",
        body: data,
        mode: "no-cors"
      });

      // Hinweis:
      // Wegen no-cors kann der Browser nicht überprüfen,
      // ob Google Sheet den Eintrag tatsächlich gespeichert hat.

      if (formNote) {
        formNote.textContent =
          "Anfrage gesendet! Vielen Dank für deine Unterstützung. 🏒";
        formNote.className = "submit-status success";
      }

      button.textContent = "Gesendet ✓";

      setTimeout(() => {
        form.reset();
        form.style.display = "none";

        document.querySelectorAll(".yes-no-button").forEach(b => {
          b.classList.remove("active");
        });

        button.disabled = false;
        button.textContent = "Angaben senden";
      }, 2500);

    } catch (error) {
      console.error("Fehler beim Senden:", error);

      if (formNote) {
        formNote.textContent =
          "Die Übermittlung hat nicht geklappt. Bitte nochmals versuchen.";
        formNote.className = "submit-status error";
      }

      button.disabled = false;
      button.textContent = "Angaben senden";
    }
  });
});
