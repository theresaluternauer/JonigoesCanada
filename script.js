// Fortschritt
const ziel = 5000;
const gesammelt = 2350;

function chf(value) {
  return "CHF " + new Intl.NumberFormat("de-CH").format(value);
}

document.addEventListener("DOMContentLoaded", () => {
  const prozent = Math.min(100, Math.round((gesammelt / ziel) * 100));
  const raised = document.getElementById("amount-raised");
  const goal = document.getElementById("amount-goal");
  const percent = document.getElementById("progress-percent");
  const fill = document.getElementById("progress-fill");
  if (raised) raised.textContent = chf(gesammelt);
  if (goal) goal.textContent = chf(ziel);
  if (percent) percent.textContent = prozent + "%";
  if (fill) requestAnimationFrame(() => fill.style.width = prozent + "%");
});

// Google-Sheet Web-App
const FORM_ENDPOINT = "https://script.google.com/macros/s/AKfycbzTsNjAb7TTSK7SxAeqT44BfcaWVZDBbc-eA-F5aHfeLnHY6bnLGwCbP9LQZauzraSBqQ/exec";

function showThankYouForm(show) {
  const form = document.getElementById("reward-form");
  const noMessage = document.getElementById("thanks-no-message");
  const buttons = document.querySelectorAll(".yes-no-button");

  buttons.forEach(b => b.classList.toggle(
    "active",
    (show && b.dataset.answer === "yes") || (!show && b.dataset.answer === "no")
  ));

  if (show) {
    form.style.display = "block";
    noMessage.style.display = "none";
  } else {
    form.style.display = "none";
    noMessage.style.display = "block";
    form.reset();
    const address = document.getElementById("address-field");
    if (address) address.classList.add("hidden");
  }
}

function isPhysicalReward(value) {
  return value === "Persönliches Dankegeschenk" ||
         value === "Dankeskarte und kleines Hockey-Souvenir";
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("reward-form");
  const rewardSelect = document.getElementById("reward-select");
  const addressField = document.getElementById("address-field");
  const formNote = document.getElementById("form-note");

  rewardSelect.addEventListener("change", () => {
    addressField.classList.toggle("hidden", !isPhysicalReward(rewardSelect.value));
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const button = form.querySelector('button[type="submit"]');
    const data = new FormData(form);
    data.set("publish_name", data.get("publish_name") ? "true" : "false");

    button.disabled = true;
    button.textContent = "Wird gesendet …";
    formNote.textContent = "Einen Moment …";
    formNote.className = "submit-status";

    try {
      await fetch(FORM_ENDPOINT, {
        method: "POST",
        body: data,
        mode: "no-cors"
      });

      formNote.textContent = "Danke! Deine Angaben wurden übermittelt. 🏒";
      formNote.className = "submit-status success";
      button.textContent = "Gesendet ✓";

      setTimeout(() => {
        form.reset();
        form.style.display = "none";
        addressField.classList.add("hidden");
        document.querySelectorAll(".yes-no-button").forEach(b => b.classList.remove("active"));
        button.disabled = false;
        button.textContent = "Angaben senden";
      }, 2500);
    } catch (error) {
      console.error(error);
      formNote.textContent = "Die Übermittlung hat nicht geklappt. Bitte nochmals versuchen.";
      formNote.className = "submit-status error";
      button.disabled = false;
      button.textContent = "Angaben senden";
    }
  });
});
