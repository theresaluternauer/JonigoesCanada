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

const rewardCards = document.querySelectorAll(".reward-card");
const rewardForm = document.getElementById("reward-form");
const amountInput = document.getElementById("support-amount");
const rewardSelect = document.getElementById("reward-select");
const selectedRewardLabel = document.getElementById("selected-reward-label");
const addressField = document.getElementById("address-field");
const rewardDetails = document.getElementById("reward-details");
const formNote = document.getElementById("form-note");
const rewardModeRadios = document.querySelectorAll('input[name="reward_mode"]');

function isPhysicalReward(value) {
  return ["Persönliches Dankegeschenk","Dankeskarte und kleines Hockey-Souvenir"].includes(value);
}

function refreshRewardUI() {
  const mode = document.querySelector('input[name="reward_mode"]:checked')?.value || "none";
  if (mode === "reward") {
    rewardDetails.classList.remove("hidden");
  } else {
    rewardDetails.classList.add("hidden");
    rewardSelect.value = "";
    addressField.classList.add("hidden");
    selectedRewardLabel.textContent = "Kein Dankeschön";
  }
  if (mode === "reward" && rewardSelect.value) {
    selectedRewardLabel.textContent = rewardSelect.options[rewardSelect.selectedIndex].text;
    addressField.classList.toggle("hidden", !isPhysicalReward(rewardSelect.value));
  }
}

rewardModeRadios.forEach(radio => radio.addEventListener("change", refreshRewardUI));
rewardSelect.addEventListener("change", refreshRewardUI);

rewardCards.forEach(card => {
  card.addEventListener("click", () => {
    rewardCards.forEach(c => c.classList.remove("active"));
    card.classList.add("active");
    document.querySelector('input[name="reward_mode"][value="reward"]').checked = true;
    amountInput.value = card.dataset.amount;
    rewardSelect.value = card.dataset.reward;
    refreshRewardUI();
    document.querySelector(".reward-checkout")?.scrollIntoView({behavior:"smooth",block:"center"});
  });
});

refreshRewardUI();

rewardForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const submitButton = rewardForm.querySelector('button[type="submit"]');
  const data = new FormData(rewardForm);
  const mode = data.get("reward_mode");

  if (!data.get("name")?.trim()) {
    formNote.textContent = "Bitte noch einen Namen eintragen.";
    formNote.className = "submit-status error";
    return;
  }

  if (!data.get("amount") || Number(data.get("amount")) <= 0) {
    formNote.textContent = "Bitte den Unterstützungsbetrag eintragen.";
    formNote.className = "submit-status error";
    return;
  }

  if (mode !== "reward") {
    data.set("reward", "");
    data.set("address", "");
  }
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
      rewardCards.forEach(c => c.classList.remove("active"));
      submitButton.disabled = false;
      submitButton.textContent = "Angaben senden";
      refreshRewardUI();
    }, 2500);

  } catch (error) {
    formNote.textContent = "Die Übermittlung hat nicht geklappt. Bitte später nochmals versuchen.";
    formNote.className = "submit-status error";
    submitButton.disabled = false;
    submitButton.textContent = "Angaben senden";
  }
});
