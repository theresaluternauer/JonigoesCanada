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
