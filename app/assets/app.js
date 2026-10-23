const anonymousMode = document.querySelector("#anonymous-mode");
const readingSizeStatus = document.querySelector("#reading-size-status");
const nicknameField = document.querySelector("#nickname-field");
const nicknameInput = document.querySelector("#nickname");
const profileStatus = document.querySelector("#profile-status");
const safeExitButton = document.querySelector("#safe-exit");
const reminderForm = document.querySelector("#reminder-form");
const reminderDate = document.querySelector("#reminder-date");
const reminderList = document.querySelector("#reminder-list");
const reminderStatus = document.querySelector("#reminder-status");
const assistantMessages = document.querySelector("#assistant-messages");
const navMenu = document.querySelector(".nav-menu");
const communityDialog = document.querySelector("#community-dialog");
const communityDialogCloser = document.querySelector("#close-community-dialog");
const communityDialogTimeout = 12_000;
const compactNavigation = window.matchMedia("(max-width: 900px)");
const reminders = [];
const appNavigationLinks = [...document.querySelectorAll("[data-app-nav]")];
const assistantResponses = {
  urgent: {
    prompt: "Mi serve aiuto subito",
    text: "Se c'è un pericolo immediato in Italia, chiama il 112. Per violenza o stalking puoi contattare il 1522. Per ascolto nei momenti di difficoltà emotiva, Telefono Amico Italia risponde allo 02 2327 2327. Sono servizi esterni a questa demo.",
    links: [
      { label: "Chiama 112", href: "tel:112" },
      { label: "Chiama 1522", href: "tel:1522" },
      { label: "Chiama Telefono Amico", href: "tel:0223272327" },
    ],
  },
  talk: {
    prompt: "Vorrei parlare con qualcuno",
    text: "Questa demo non inoltra messaggi e non prenota colloqui. Per ascolto emotivo puoi contattare Telefono Amico Italia. Per violenza o stalking puoi contattare il 1522; se c'è un pericolo immediato, chiama il 112.",
    links: [
      { label: "Telefono Amico: 02 2327 2327", href: "tel:0223272327" },
      { label: "1522", href: "tel:1522" },
      { label: "112", href: "tel:112" },
    ],
  },
  peers: {
    prompt: "Vorrei parlare con altre persone",
    text: "La chat interna tra utenti non è attiva. Hai condiviso un invito a un gruppo WhatsApp esterno. Prima di unirti, verifica chi lo gestisce: i partecipanti potrebbero vedere il tuo numero e i tuoi messaggi. Evita di condividere dati personali o informazioni delicate.",
    links: [
      { label: "Apri il gruppo WhatsApp", href: "https://chat.whatsapp.com/KJi2Io4ETdDKLx8pp291DD" },
      { label: "Telefono Amico: 02 2327 2327", href: "tel:0223272327" },
      { label: "Regole della community", href: "#comunita" },
    ],
  },
  start: {
    prompt: "Non so da dove iniziare",
    text: "Puoi esplorare gli ambiti informativi e leggere le domande frequenti. Questa pagina non è collegata a sportelli locali e non può prendere in carico una richiesta.",
    links: [
      { label: "Esplora le aree", href: "#ambiti" },
      { label: "Leggi le FAQ", href: "#faq" },
    ],
  },
  privacy: {
    prompt: "Come funziona la riservatezza?",
    text: "Questa versione non usa un modello di IA e non invia i messaggi a un operatore o a un server: i pulsanti mostrano risposte predefinite in questa scheda. Non inserire dati personali. La navigazione privata e la cancellazione della cronologia dipendono dal browser e dal dispositivo.",
    links: [{ label: "Leggi le note privacy", href: "#privacy" }],
  },
};

function appendAssistantMessage(text, className, links = []) {
  const message = document.createElement("div");
  const paragraph = document.createElement("p");
  message.className = `assistant-message ${className}`;
  paragraph.textContent = text;
  message.append(paragraph);

  if (links.length > 0) {
    const linkList = document.createElement("div");
    linkList.className = "assistant-response-links";

    for (const item of links) {
      const link = document.createElement("a");
      link.href = item.href;
      link.textContent = item.label;
      linkList.append(link);
    }

    message.append(linkList);
  }

  assistantMessages.append(message);
  message.scrollIntoView({ block: "nearest", behavior: "smooth" });
}

function configureNavigationMenu() {
  navMenu.open = !compactNavigation.matches;
}

configureNavigationMenu();
compactNavigation.addEventListener("change", configureNavigationMenu);
navMenu.addEventListener("toggle", () => {
  navMenu.querySelector("summary").setAttribute(
    "aria-label",
    navMenu.open ? "Chiudi il menu di navigazione" : "Apri il menu di navigazione",
  );
});
navMenu.querySelectorAll("nav a").forEach((link) => {
  link.addEventListener("click", () => {
    if (compactNavigation.matches) {
      navMenu.open = false;
    }
  });
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && compactNavigation.matches && navMenu.open) {
    navMenu.open = false;
    navMenu.querySelector("summary").focus();
  }
});

function setActiveNavigation(targetId) {
  for (const link of appNavigationLinks) {
    if (link.getAttribute("href") === `#${targetId}`) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  }
}

function updateProfile() {
  const isAnonymous = anonymousMode.checked;
  nicknameField.hidden = isAnonymous;

  if (isAnonymous) {
    nicknameInput.value = "";
    profileStatus.textContent = "Stai usando la pagina in modalità anonima.";
    return;
  }

  const nickname = nicknameInput.value.trim();
  profileStatus.textContent = nickname
    ? `Nickname attivo in questa scheda: ${nickname}.`
    : "Modalità nickname attiva. Scegli un nome facoltativo.";
}

document.querySelectorAll('input[name="reading-size"]').forEach((option) => {
  option.addEventListener("change", () => {
    if (!option.checked) {
      return;
    }

    if (option.value === "standard") {
      document.documentElement.removeAttribute("data-text-size");
    } else {
      document.documentElement.dataset.textSize = option.value;
    }
    const label = option.labels[0].textContent.trim();
    readingSizeStatus.textContent = `Dimensione del testo: ${label.toLowerCase()}.`;
  });
});

function renderReminders() {
  reminderList.replaceChildren();

  for (const reminder of reminders) {
    const item = document.createElement("li");
    const description = document.createElement("span");
    const removeButton = document.createElement("button");

    description.textContent = `${reminder.label} — ${new Intl.DateTimeFormat("it-IT").format(reminder.date)}`;
    removeButton.type = "button";
    removeButton.textContent = "Rimuovi";
    removeButton.setAttribute("aria-label", `Rimuovi promemoria: ${reminder.label}`);
    removeButton.addEventListener("click", () => {
      reminders.splice(reminders.indexOf(reminder), 1);
      renderReminders();
      reminderStatus.textContent = "Promemoria rimosso da questa scheda.";
    });

    item.append(description, removeButton);
    reminderList.append(item);
  }
}

anonymousMode.addEventListener("change", updateProfile);
nicknameInput.addEventListener("input", updateProfile);
for (const link of appNavigationLinks) {
  link.addEventListener("click", () => setActiveNavigation(link.hash.slice(1)));
}

document.querySelectorAll("[data-assistant-topic]").forEach((button) => {
  button.addEventListener("click", () => {
    const response = assistantResponses[button.dataset.assistantTopic];
    if (!response) {
      return;
    }

    appendAssistantMessage(response.prompt, "assistant-question");
    appendAssistantMessage(response.text, "assistant-reply", response.links);
  });
});

if ("IntersectionObserver" in window) {
  const appSections = appNavigationLinks
    .map((link) => document.querySelector(link.hash))
    .filter(Boolean);
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visibleSections = entries
        .filter((entry) => entry.isIntersecting)
        .sort((left, right) => right.intersectionRatio - left.intersectionRatio);
      if (visibleSections.length > 0) {
        setActiveNavigation(visibleSections[0].target.id);
      }
    },
    { rootMargin: "-18% 0px -62% 0px", threshold: [0, 0.25, 0.5] },
  );

  for (const section of appSections) {
    sectionObserver.observe(section);
  }
}

function openCommunityDialog() {
  if (communityDialog.open) {
    return;
  }

  communityDialog.showModal();
  scheduleCommunityDialogClose();
}

let communityDialogCloseTimer;
let communityDialogAutoOpenTimer;
function scheduleCommunityDialogClose() {
  window.clearTimeout(communityDialogCloseTimer);
  communityDialogCloseTimer = window.setTimeout(() => {
    communityDialog.close();
  }, communityDialogTimeout);
}

safeExitButton.addEventListener("click", () => {
  window.location.replace("about:blank");
});
safeExitButton.hidden = false;

document.querySelectorAll("[data-open-community-dialog]").forEach((control) => {
  control.addEventListener("click", (event) => {
    window.clearTimeout(communityDialogAutoOpenTimer);
    openCommunityDialog();
    if (control instanceof HTMLAnchorElement) {
      event.preventDefault();
    }
  });
});
communityDialog.addEventListener("pointerdown", scheduleCommunityDialogClose);
communityDialog.addEventListener("keydown", scheduleCommunityDialogClose);
communityDialog.addEventListener("close", () => {
  window.clearTimeout(communityDialogCloseTimer);
});
communityDialogCloser.addEventListener("click", () => {
  communityDialog.close();
});
communityDialog.addEventListener("click", (event) => {
  if (event.target === communityDialog) {
    communityDialog.close();
  }
});
communityDialogAutoOpenTimer = window.setTimeout(openCommunityDialog, 800);

function updateReminderDateMinimum() {
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  reminderDate.min = today.toISOString().slice(0, 10);
}

updateReminderDateMinimum();

reminderForm.addEventListener("submit", (event) => {
  event.preventDefault();
  updateReminderDateMinimum();

  if (!reminderForm.reportValidity()) {
    return;
  }

  const label = reminderForm.elements.label.value.trim();
  const date = reminderForm.elements.date.value;

  if (!label) {
    reminderStatus.textContent = "Inserisci un promemoria breve, senza dati personali.";
    return;
  }

  if (date < reminderDate.min) {
    reminderStatus.textContent = "Scegli oggi o una data futura.";
    return;
  }

  reminders.push({ label, date: new Date(`${date}T12:00:00`) });
  reminderForm.reset();
  renderReminders();
  reminderStatus.textContent = "Aggiunto solo a questa scheda. Non verrà inviata una notifica.";
});
reminderForm.removeAttribute("inert");

updateProfile();
