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
// DANKESCHÖN-AUSWAHL
// ----------------------------------------------------------
const rewardCards = document.querySelectorAll(".reward-card");
const amountInput = document.getElementById("support-amount");
const rewardSelect = document.getElementById("reward-select");
const selectedRewardLabel = document.getElementById("selected-reward-label");
const addressField = document.getElementById("address-field");
const rewardForm = document.getElementById("reward-form");
const formNote = document.getElementById("form-note");
function updateAddressVisibility(){
  const physical=["Persönliches Dankegeschenk","Dankeskarte und kleines Hockey-Souvenir"];
  addressField.classList.toggle("hidden", !physical.includes(rewardSelect.value));
}
rewardCards.forEach(card=>card.addEventListener("click",()=>{
  rewardCards.forEach(c=>c.classList.remove("active")); card.classList.add("active");
  amountInput.value=card.dataset.amount; rewardSelect.value=card.dataset.reward;
  selectedRewardLabel.textContent=`CHF ${card.dataset.amount} · ${card.dataset.reward}`; updateAddressVisibility();
}));
rewardSelect.addEventListener("change",()=>{selectedRewardLabel.textContent=rewardSelect.value||"Kein Dankeschön ausgewählt";updateAddressVisibility();});
updateAddressVisibility();
rewardForm.addEventListener("submit",e=>{e.preventDefault();formNote.textContent="Auswahl ist erfasst – die sichere Übermittlung wird noch angebunden.";});
