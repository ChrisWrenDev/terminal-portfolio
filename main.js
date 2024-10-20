const terminal = document.getElementById("terminal");
// let before = document.getElementById("before");
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

function navigateHistory(direction){
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
      element.className = style;
      terminal.appendChild(element);
      // Keep at bottom of screen
      window.scrollTo(0, document.body.offsetHeight);
    }, index * time);
  })
}

const commandMap = {
  "help": help,
  "about": about,
  "blog": blog,
  "social": social,
  "projects": projects,
  "contact": contact,
  "clear": () => { terminal.innerHTML = ""; output(banner, "text-secondary", 80);},
  "banner": () => output(banner, "text-secondary", 80),
  "history": () => { output(["<br>", ...commandHistory, "<br>"], "text-secondary ml-20", 80); },
  "linkedin": () => { output(["Opening LinkedIn..."], "text-secondary", 0); openLink(linkedin); },
  "github": () => { output(["Opening GitHub..."], "text-secondary", 0); openLink(github); }
};

function commander(cmd) {
  const command = commandMap[cmd];
  
  if(cmd !== "clear"){
    // Print current command
    output(['<span class="font-semibold">chriswren:~$</span> ' + cmd], "animate-none", 0);
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

function keyAction(key){
  switch(key){
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

textarea.value = "";
typer.innerHTML = textarea.value;

window.onload = () => {
  cursor.style.left = "0px";
  output(banner, "", 80);
  textarea.focus();
}

window.addEventListener("keyup", (event) => {
  keyAction(event.key)
});

command.addEventListener("click", () => {
  textarea.focus();
})

textarea.addEventListener("input", () => {
  updateTyper(textarea.value);
});

