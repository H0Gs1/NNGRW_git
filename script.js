/* Skrywer: MG Beukes
   Basiese dragtigheid-berekening vir die tuisblad se vorm.
*/

(() => {
  const form = document.getElementById("gestation-form");
  const animalEl = document.getElementById("animal");
  const dateEl = document.getElementById("mating-date");
  const resultEl = document.getElementById("result");

  const GESTATION_DAYS = {
    cow: 283,
    sheep: 150,
    horse: 340,
    goat: 150,
  };

  const fmt = new Intl.DateTimeFormat("af-ZA", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });

  const addDays = (date, days) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  };

  // Tuisblad: dragtigheid-berekening (net as die elemente bestaan).
  if (form && animalEl && dateEl && resultEl) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const animal = animalEl.value;
      const matingDateStr = dateEl.value;
      const gestDays = GESTATION_DAYS[animal];

      if (!animal || !matingDateStr || !gestDays) {
        resultEl.textContent = "Kies asseblief ’n dier en ’n dekdatum.";
        return;
      }

      const due = addDays(matingDateStr, gestDays);
      const prep = addDays(due, -14);

      resultEl.textContent =
        "Verwagte geboortedatum: " +
        fmt.format(due) +
        " | Begin voorberei rondom: " +
        fmt.format(prep) +
        ".";
    });
  }

  // Oor Ons: wys/versteek ekstra inhoud met die bestaande "Lees meer" knoppie.
  const oorOnsToggle = document.getElementById("oor-ons-toggle");
  const oorOnsPanel = document.getElementById("oor-ons-panel");
  if (oorOnsToggle && oorOnsPanel) {
    const setOpen = (open) => {
      oorOnsPanel.hidden = !open;
      oorOnsToggle.setAttribute("aria-expanded", open ? "true" : "false");
    };

    setOpen(false);
    oorOnsToggle.addEventListener("click", () => {
      setOpen(oorOnsPanel.hidden);
    });
  }
})();
