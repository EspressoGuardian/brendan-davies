const COMMAND_CONFIG = {
  studio: {
    windows: {
      "life-os": ["life", "os", "hubsays"],
      workflows: ["workflow", "browser", "browseros"],
      operator: ["operator", "builder", "brendan"],
      daybook: ["day", "daybook", "rhythm"],
    },
    routes: {
      live: "live-systems.html",
      desk: "live-systems.html",
      "master-os": "agents/index.html",
      brendan: "brendan-davies/index.html",
      availability: "availability.html",
    },
    status:
      "desk=live | workflows=review-first | queue=watch | home=quiet | room=vinyl + espresso",
    extras: {
      "play radio": "Vinyl on. Espresso close. Focus up.",
      "sudo hire brendan": { route: "brendan-davies/contact.html", note: "Opening the contact lane." },
    },
  },
  brendan: {
    windows: {
      proof: ["impact", "proof", "numbers"],
      stack: ["stack", "models", "tools"],
      notes: ["notes", "recruiter", "call"],
      fit: ["fit", "roles", "contact"],
    },
    routes: {
      systems: "systems.html",
      contact: "contact.html",
      studio: "https://hubsays.com/",
      proof: "proof.html",
      availability: "availability.html",
    },
    status:
      "focus=systems + AI workflow design | posture=local-first | recruiter mode=ready | availability=open",
    extras: {
      "sudo hire brendan": { route: "contact.html", note: "Permission accepted. Opening contact." },
    },
  },
};

function initMenus() {
  const toggles = document.querySelectorAll("[data-menu-toggle]");

  toggles.forEach((toggle) => {
    const targetId = toggle.getAttribute("data-menu-toggle");
    const panel = document.getElementById(targetId);
    if (!panel) return;

    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", expanded ? "false" : "true");
      panel.classList.toggle("is-open", !expanded);
    });
  });
}

function initClock() {
  const tick = () => {
    const now = new Date();
    document.querySelectorAll("[data-clock-time]").forEach((node) => {
      node.textContent = now.toLocaleTimeString("en-NL", {
        hour: "2-digit",
        minute: "2-digit",
      });
    });
    document.querySelectorAll("[data-clock-date]").forEach((node) => {
      node.textContent = now.toLocaleDateString("en-NL", {
        weekday: "short",
        day: "2-digit",
        month: "short",
      });
    });
  };

  tick();
  window.setInterval(tick, 1000);
}

function initLiveDeck() {
  const deck = document.querySelector("[data-live-deck]");
  if (!deck) return;

  const source = deck.getAttribute("data-live-deck-src");
  if (!source) return;

  const escapeHtml = (value) =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");

  const renderDate = (value) => {
    const date = value ? new Date(value) : new Date();
    return Number.isNaN(date.getTime())
      ? "recently"
      : date.toLocaleDateString("en-NL", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
  };

  const setText = (selector, value) => {
    if (!value && value !== 0) return;
    document.querySelectorAll(selector).forEach((node) => {
      node.textContent = String(value);
    });
  };

  fetch(source)
    .then((response) => (response.ok ? response.json() : null))
    .then((payload) => {
      if (!payload) return;

      setText("[data-deck-headline]", payload.headline);
      setText("[data-deck-summary]", payload.summary);
      setText("[data-deck-state]", payload.state);
      setText("[data-deck-bottleneck]", payload.bottleneck);
      setText(
        "[data-deck-trust]",
        typeof payload.trust_score_pct === "number"
          ? `${payload.trust_score_pct.toFixed(1)}%`
          : null,
      );
      setText("[data-deck-attention]", payload.attention_count);
      setText(
        "[data-deck-swarm]",
        payload.swarm_value
          ? String(payload.swarm_value).replace(
              /(^|-)([a-z])/g,
              (_, sep, letter) => `${sep}${letter.toUpperCase()}`,
            )
          : null,
      );
      setText("[data-deck-owner-lanes]", payload.owner_lane_count);
      setText("[data-deck-next-action]", payload.next_action);
      setText("[data-deck-publish]", payload.publish_posture);
      setText("[data-deck-risk]", payload.risk);
      setText("[data-deck-generated-at]", renderDate(payload.generated_at));

      const streamNode = document.querySelector("[data-deck-stream]");
      if (streamNode && Array.isArray(payload.stream) && payload.stream.length) {
        streamNode.innerHTML = payload.stream
          .map((line) => `<p>${escapeHtml(line)}</p>`)
          .join("");
      }

      const watchNode = document.querySelector("[data-deck-watch-items]");
      if (watchNode && Array.isArray(payload.watch_items) && payload.watch_items.length) {
        watchNode.innerHTML = payload.watch_items
          .map((item) => `<li>${escapeHtml(item)}</li>`)
          .join("");
      }

      const authorityNode = document.querySelector("[data-deck-authority-cards]");
      if (authorityNode && Array.isArray(payload.authority_cards) && payload.authority_cards.length) {
        authorityNode.innerHTML = payload.authority_cards
          .map(
            (card) => `
              <div class="stat">
                <p class="kicker">${escapeHtml(card.label || "")}</p>
                <strong>${escapeHtml(card.value || "")}</strong>
                <span>${escapeHtml(card.detail || "")}</span>
              </div>
            `,
          )
          .join("");
      }
    })
    .catch(() => {
      // Keep the static fallback if the snapshot is unavailable.
    });
}

function initWindows() {
  const zone = document.querySelector("[data-window-zone]");
  if (!zone) return;

  const windows = [...zone.querySelectorAll("[data-window-id]")];
  const launchers = [...document.querySelectorAll("[data-open-window]")];
  let highestZ = 20;

  const byId = new Map(windows.map((node) => [node.getAttribute("data-window-id"), node]));

  const setLauncherState = (id) => {
    launchers.forEach((node) => {
      node.classList.toggle("is-active", node.getAttribute("data-open-window") === id);
    });
    document.querySelectorAll("[data-dock-window]").forEach((node) => {
      node.classList.toggle("is-active", node.getAttribute("data-dock-window") === id);
    });
  };

  const bringToFront = (node) => {
    highestZ += 1;
    node.style.zIndex = String(highestZ);
  };

  const activateWindow = (id) => {
    const node = byId.get(id);
    if (!node) return false;
    node.classList.remove("is-hidden");
    bringToFront(node);
    setLauncherState(id);
    if (window.innerWidth <= 1180) {
      node.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    return true;
  };

  launchers.forEach((node) => {
    node.addEventListener("click", (event) => {
      const href = node.getAttribute("href");
      const windowId = node.getAttribute("data-open-window");
      if (windowId) {
        event.preventDefault();
        activateWindow(windowId);
      } else if (href && href.startsWith("#")) {
        event.preventDefault();
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  document.querySelectorAll("[data-window-handle]").forEach((handle) => {
    const node = handle.closest("[data-window-id]");
    if (!node) return;

    handle.addEventListener("pointerdown", (event) => {
      if (window.innerWidth <= 1180) return;

      const parentRect = zone.getBoundingClientRect();
      const rect = node.getBoundingClientRect();
      const startLeft = rect.left - parentRect.left;
      const startTop = rect.top - parentRect.top;
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;

      node.style.left = `${startLeft}px`;
      node.style.top = `${startTop}px`;
      bringToFront(node);

      const onMove = (moveEvent) => {
        const maxLeft = Math.max(parentRect.width - rect.width, 0);
        const maxTop = Math.max(parentRect.height - rect.height, 0);
        const left = Math.min(
          Math.max(moveEvent.clientX - parentRect.left - offsetX, 0),
          maxLeft,
        );
        const top = Math.min(
          Math.max(moveEvent.clientY - parentRect.top - offsetY, 0),
          maxTop,
        );
        node.style.left = `${left}px`;
        node.style.top = `${top}px`;
      };

      const onUp = () => {
        document.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerup", onUp);
      };

      document.addEventListener("pointermove", onMove);
      document.addEventListener("pointerup", onUp);
    });
  });

  windows.forEach((node) => {
    node.addEventListener("mousedown", () => bringToFront(node));
  });

  window.activateWindow = activateWindow;
}

function initTerminal() {
  const terminal = document.querySelector("[data-terminal]");
  if (!terminal) return;

  const page = document.body.getAttribute("data-page") || "";
  const config = COMMAND_CONFIG[page] || { windows: {}, routes: {}, extras: {}, status: "system=ready" };
  const output = terminal.querySelector("[data-terminal-output]");
  const input = terminal.querySelector("[data-terminal-input]");
  const toggles = document.querySelectorAll("[data-terminal-toggle]");

  const openTerminal = () => {
    terminal.classList.add("is-open");
    input?.focus();
  };

  const closeTerminal = () => {
    terminal.classList.remove("is-open");
  };

  toggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      if (terminal.classList.contains("is-open")) {
        closeTerminal();
      } else {
        openTerminal();
      }
    });
  });

  const logLine = (text, emphasis = false) => {
    if (!output) return;
    const line = document.createElement("div");
    line.className = "terminal-line";
    line.innerHTML = emphasis ? `<strong>${text}</strong>` : text;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  };

  const windowNames = () => Object.keys(config.windows).sort();

  const resolveWindowId = (token) => {
    const clean = token.trim().toLowerCase();
    if (config.windows[clean]) return clean;
    for (const [id, aliases] of Object.entries(config.windows)) {
      if (aliases.includes(clean)) return id;
    }
    return null;
  };

  const runCommand = (raw) => {
    const command = raw.trim().toLowerCase();
    if (!command) return;

    logLine(`> ${raw}`);

    if (command === "help") {
      logLine("help | ls | status | open <window> | show <window> | goto <page> | clear", true);
      return;
    }

    if (command === "ls") {
      logLine(`windows: ${windowNames().join(", ")}`, true);
      return;
    }

    if (command === "clear") {
      if (output) output.innerHTML = "";
      return;
    }

    if (command === "status") {
      logLine(config.status, true);
      return;
    }

    if (config.extras[command]) {
      const extra = config.extras[command];
      if (typeof extra === "string") {
        logLine(extra, true);
        return;
      }
      if (extra.note) logLine(extra.note, true);
      if (extra.open && typeof window.activateWindow === "function") {
        window.activateWindow(extra.open);
      }
      if (extra.route) {
        window.location.href = extra.route;
      }
      return;
    }

    if (command.startsWith("open ") || command.startsWith("show ")) {
      const token = command.replace(/^(open|show)\s+/, "");
      const target = resolveWindowId(token);
      if (target && typeof window.activateWindow === "function") {
        window.activateWindow(target);
        logLine(`opened ${target}`, true);
      } else {
        logLine(`unknown window: ${token}`, true);
      }
      return;
    }

    if (command.startsWith("goto ")) {
      const token = command.replace(/^goto\s+/, "");
      const route = config.routes[token];
      if (route) {
        logLine(`opening ${token}`, true);
        window.location.href = route;
      } else {
        logLine(`unknown route: ${token}`, true);
      }
      return;
    }

    logLine("command not recognised. try help", true);
  };

  input?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    runCommand(input.value);
    input.value = "";
  });

  document.querySelectorAll("[data-command-chip]").forEach((chip) => {
    chip.addEventListener("click", () => {
      openTerminal();
      runCommand(chip.getAttribute("data-command-chip") || "");
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initMenus();
  initClock();
  initLiveDeck();
  initWindows();
  initTerminal();
});
