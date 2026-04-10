/* Skrywer: MG Beukes
   Basiese dragtigheid-berekening vir die tuisblad se vorm.
*/

(() => {
  const setStatus = (el, msg, kind = "info") => {
    if (!el) return;
    el.textContent = msg;
    el.style.color = kind === "error" ? "#7a1f1f" : "";
  };

  // Eie e-pos validasie .
  // Doel: basiese praktiese toets vir "iets@iets.domein".
  const isValidEmail = (email) => {
    const s = String(email || "").trim();
    if (!s) return false;
    return /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(s);
  };

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

  // Kontak: basiese validasie + "fake" submit.
  const contactForm = document.getElementById("contact-form");
  const contactName = document.getElementById("contact-name");
  const contactEmail = document.getElementById("contact-email");
  const contactMessage = document.getElementById("contact-message");
  const contactStatus = document.getElementById("contact-status");
  if (contactForm && contactName && contactEmail && contactMessage) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = String(contactName.value || "").trim();
      const email = String(contactEmail.value || "").trim();
      const message = String(contactMessage.value || "").trim();

      if (name.length < 2) {
        setStatus(contactStatus, "Tik asseblief jou naam in (minstens 2 letters).", "error");
        contactName.focus();
        return;
      }
      if (!isValidEmail(email)) {
        setStatus(contactStatus, "Tik asseblief ’n geldige e-pos adres in.", "error");
        contactEmail.focus();
        return;
      }
      if (message.length < 10) {
        setStatus(contactStatus, "Jou boodskap is te kort. Skryf asseblief minstens 10 karakters.", "error");
        contactMessage.focus();
        return;
      }

      setStatus(
        contactStatus,
        "Boodskap ontvang. Dankie " + name + " (ons sal terugkom by " + email + ")."
      );
      contactForm.reset();
    });
  }

  // Winkel: basiese validasie + bestelling opsomming.
  const orderForm = document.getElementById("order-form");
  const orderName = document.getElementById("order-name");
  const orderEmail = document.getElementById("order-email");
  const orderPhone = document.getElementById("order-phone");
  const orderProduct = document.getElementById("order-product");
  const orderQty = document.getElementById("order-qty");
  const orderMethod = document.getElementById("order-method");
  const orderAddress = document.getElementById("order-address");
  const orderStatus = document.getElementById("order-status");

  const normalizePhone = (s) => String(s || "").replace(/[^\d+]/g, "");

  const syncAddressRequired = () => {
    if (!orderMethod || !orderAddress) return;
    const isDelivery = orderMethod.value === "Aflewering";
    orderAddress.required = isDelivery;
    orderAddress.disabled = !isDelivery;
    if (!isDelivery) orderAddress.value = "";
  };

  if (orderMethod && orderAddress) {
    syncAddressRequired();
    orderMethod.addEventListener("change", syncAddressRequired);
  }

  if (orderForm && orderName && orderEmail && orderPhone && orderProduct && orderQty && orderMethod) {
    orderForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = String(orderName.value || "").trim();
      const email = String(orderEmail.value || "").trim();
      const phone = normalizePhone(orderPhone.value);
      const product = String(orderProduct.value || "").trim();
      const qty = Number(orderQty.value);
      const method = String(orderMethod.value || "").trim();
      const address = String(orderAddress ? orderAddress.value : "").trim();

      if (name.length < 2) {
        setStatus(orderStatus, "Tik asseblief jou naam in (minstens 2 letters).", "error");
        orderName.focus();
        return;
      }
      if (!isValidEmail(email)) {
        setStatus(orderStatus, "Tik asseblief ’n geldige e-pos adres in.", "error");
        orderEmail.focus();
        return;
      }
      if (!phone || phone.replace(/\D/g, "").length < 10) {
        setStatus(orderStatus, "Tik asseblief ’n geldige selfoonnommer in (bv. 0821234567).", "error");
        orderPhone.focus();
        return;
      }
      if (!product) {
        setStatus(orderStatus, "Kies asseblief ’n produk.", "error");
        orderProduct.focus();
        return;
      }
      if (!Number.isFinite(qty) || qty < 1 || qty > 999) {
        setStatus(orderStatus, "Hoeveelheid moet tussen 1 en 999 wees.", "error");
        orderQty.focus();
        return;
      }
      if (!method) {
        setStatus(orderStatus, "Kies asseblief Afhaal of Aflewering.", "error");
        orderMethod.focus();
        return;
      }
      if (method === "Aflewering" && address.length < 8) {
        setStatus(orderStatus, "Tik asseblief ’n afleweringsadres in (minstens 8 karakters).", "error");
        if (orderAddress) orderAddress.focus();
        return;
      }

      const place = method === "Aflewering" ? "Aflewering: " + address : "Afhaal";
      setStatus(
        orderStatus,
        "Bestelling ontvang: " + qty + " x " + product + " | " + place + " | Kontak: " + name + " (" + email + ")."
      );
      orderForm.reset();
      syncAddressRequired();
    });
  }
})();
