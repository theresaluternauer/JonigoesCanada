// ----------------------------------------------------------
// HIER SPÄTER NUR DIESE ZAHLEN ÄNDERN
// ----------------------------------------------------------
const ziel = 5000;
const gesammelt = 2350;

// Schweizer Zahlenformat
function chf(value) {
  return "CHF " + new Intl.NumberFormat("de-CH").format(value);
}

const prozent = Math.min(100, Math.round((gesammelt / ziel) * 100));

document.getElementById("amount-raised").textContent = chf(gesammelt);
document.getElementById("amount-goal").textContent = chf(ziel);
document.getElementById("progress-percent").textContent = prozent + "%";

window.addEventListener("load", () => {
  requestAnimationFrame(() => {
    document.getElementById("progress-fill").style.width = prozent + "%";
  });
});

// ----------------------------------------------------------
// DANKESCHÖN + GOOGLE SHEETS
// ----------------------------------------------------------
const FORM_ENDPOINT = "https://script.google.com/macros/s/AKfycbzTsNjAb7TTSK7SxAeqT44BfcaWVZDBbc-eA-F5aHfeLnHY6bnLGwCbP9LQZauzraSBqQ/exec";

const rewardForm = document.getElementById("reward-form");
const rewardSelect = document.getElementById("reward-select");
const addressField = document.getElementById("address-field");
const formNote = document.getElementById("form-note");
const yesNoButtons = document.querySelectorAll(".yes-no-button");
const noMessage = document.getElementById("thanks-no-message");

function isPhysicalReward(value) {
  return [
    "Persönliches Dankegeschenk",
    "Dankeskarte und kleines Hockey-Souvenir"
  ].includes(value);
}

yesNoButtons.forEach(button => {
  button.addEventListener("click", () => {
    yesNoButtons.forEach(b => b.classList.remove("active"));
    button.classList.add("active");

    const answer = button.dataset.answer;

    if (answer === "yes") {
      rewardForm.classList.remove("hidden");
      noMessage.classList.add("hidden");
      rewardForm.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } else {
      rewardForm.classList.add("hidden");
      noMessage.classList.remove("hidden");
      rewardForm.reset();
      addressField.classList.add("hidden");
    }
  });
});

rewardSelect.addEventListener("change", () => {
  addressField.classList.toggle("hidden", !isPhysicalReward(rewardSelect.value));
});

rewardForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const submitButton = rewardForm.querySelector('button[type="submit"]');
  const data = new FormData(rewardForm);

  data.set("publish_name", data.get("publish_name") ? "true" : "false");

  submitButton.disabled = true;
  submitButton.textContent = "Wird gesendet …";
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
    submitButton.textContent = "Gesendet ✓";

    setTimeout(() => {
      rewardForm.reset();
      rewardForm.classList.add("hidden");
      yesNoButtons.forEach(b => b.classList.remove("active"));
      addressField.classList.add("hidden");
      submitButton.disabled = false;
      submitButton.textContent = "Angaben senden";
    }, 2500);

  } catch (error) {
    formNote.textContent = "Die Übermittlung hat nicht geklappt. Bitte später nochmals versuchen.";
    formNote.className = "submit-status error";
    submitButton.disabled = false;
    submitButton.textContent = "Angaben senden";
  }
});
