const html = document.querySelector("html");
const content = document.getElementById("content");
const toggle = document.getElementById("toggle");
const terminalButton = document.getElementById("terminalButton");
const terminal = document.getElementById("terminal");
const command = document.getElementById("command");
const textarea = document.getElementById("textarea");
const liner = document.getElementById("liner");
const typer = document.getElementById("typer");
const cursor = document.getElementById("cursor");

const enter = "Enter";
const arrowLeft = "ArrowLeft";
const arrowUp = "ArrowUp";
const arrowRight = "ArrowRight";
const arrowDown = "ArrowDown";

let commandIndex = 0;
let commandHistory = [];

function removeNewline(txt) {
  return txt.replace(/\n/g, "");
}

function updateTyper(text) {
  typer.innerHTML = removeNewline(text);
}

function moveCursorLeft() {
  const count = textarea.value.length;
  if (parseInt(cursor.style.left) >= 0 - (count - 1) * 10) {
    cursor.style.left = parseInt(cursor.style.left) - 10 + "px";
  }
}

function moveCursorRight() {
  if (parseInt(cursor.style.left) + 10 <= 0) {
    cursor.style.left = parseInt(cursor.style.left) + 10 + "px";
  }
}

function navigateHistory(direction) {
  if (direction === -1 && commandIndex > 0) {
    commandIndex--;
  } else if (direction === 1 && commandIndex < commandHistory.length) {
    commandIndex++;
  }

  textarea.value = commandHistory[commandIndex] || "";
  typer.innerHTML = textarea.value;
}

function enterCmd() {
  // Update command history
  commandHistory.push(typer.innerHTML);
  commandIndex = commandHistory.length;
  // Execute command
  commander(typer.innerHTML.toLowerCase().trim());
  // Reset input for next command
  typer.innerHTML = "";
  textarea.value = "";
}

function openLink(link) {
  setTimeout(function () {
    window.open(link, "_blank");
  }, 500);
}

function output(lines, style, time) {
  lines.forEach((text, index) => {
    // Replace consecutive spaces with non breaking spaces
    const string = text.replace(/ {2,}/g, "&nbsp;&nbsp;");

    setTimeout(function () {
      // Add element to terminal output
      const element = document.createElement("p");
      element.innerHTML = string;
      element.className = `terminal-text ${style}`;
      terminal.appendChild(element);
      // Keep at bottom of screen
      window.scrollTo(0, document.body.offsetHeight);
    }, index * time);
  });
}

function getThemeSetting() {
  const localStorageTheme = localStorage.getItem("theme");
  const systemSettingDark = window.matchMedia("(prefers-color-scheme: light)");

  if (localStorageTheme !== null) return localStorageTheme;
  if (systemSettingDark.matches) return "light";
  return "dark";
}

let currentTheme = getThemeSetting();

function updateTheme() {
  const newTheme = currentTheme === "light" ? "dark" : "light";

  html.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  toggle.checked = newTheme === "dark";
  currentTheme = newTheme;
}

let toggleCount = 0;

function toggleTerminal() {
  if (terminal.style.display === "none") {
    terminal.style.display = "block";
    command.style.display = "block";
    content.style.display = "none";

    cursor.style.left = "0px";
    output(banner, "", 80);
    textarea.focus();
  } else {
    terminal.style.display = "none";
    command.style.display = "none";
    content.style.display = "block";
  }
}

const commandMap = {
  help: help,
  man: help,
  ls: help,
  about: about,
  blog: blog,
  social: social,
  projects: projects,
  contact: contact,
  clear: () => {
    terminal.innerHTML = "";
    output(banner, "text-secondary", 80);
  },
  banner: () => output(banner, "text-secondary", 80),
  history: () => {
    output(["<br>", ...commandHistory, "<br>"], "text-secondary ml-20", 80);
  },
  blog2: () => {
    output(["Opening Blog..."], "text-secondary", 0);
    openLink(blogLink);
  },
  linkedin: () => {
    output(["Opening LinkedIn..."], "text-secondary", 0);
    openLink(linkedinLink);
  },
  github: () => {
    output(["Opening GitHub..."], "text-secondary", 0);
    openLink(githubLink);
  },
  theme: () => {
    updateTheme();
    output(["<br>", `Changed to ${currentTheme} theme`, "<br>"], "", 80);
  },
  exit: () => {
    toggleTerminal();
    terminal.innerHTML = "";
    commandHistory = [];
  },
};

function commander(cmd) {
  const command = commandMap[cmd];

  if (cmd !== "clear" && cmd !== "exit") {
    // Print current command
    output(
      ['<span class="font-semibold">chriswren:~$</span> ' + cmd],
      "animate-none",
      0,
    );
  }

  if (!command) {
    output(["<br>", notFound, "<br>"], "ml-20", 100);
    return;
  }
  // Print out for command
  if (typeof command === "function") {
    command();
  } else {
    output(command, "animate-type text-secondary ml-20", 80);
  }
}

function keyAction(key) {
  switch (key) {
    case enter:
      enterCmd();
      break;
    case arrowLeft:
      moveCursorLeft();
      break;
    case arrowRight:
      moveCursorRight();
      break;
    case arrowUp:
      navigateHistory(-1);
      break;
    case arrowDown:
      navigateHistory(1);
      break;
    default:
  }
}

window.onload = () => {
  html.setAttribute("data-theme", currentTheme);
  toggle.checked = currentTheme === "dark";
};

window.addEventListener("keyup", (event) => {
  keyAction(event.key);
});

if (command) {
  command.addEventListener("click", () => {
    textarea.focus();
  });
}

if (textarea) {
  textarea.value = "";
  typer.innerHTML = textarea.value;
  textarea.addEventListener("input", () => {
    updateTyper(textarea.value);
  });
}

if (toggle) {
  toggle.addEventListener("change", () => {
    updateTheme();
  });
}

if (terminalButton) {
  terminalButton.addEventListener("click", () => {
    toggleTerminal();
  });
}
