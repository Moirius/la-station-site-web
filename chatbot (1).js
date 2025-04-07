
function insertShortcut(text) {
  document.getElementById("userInput").value = text;
  document.getElementById("userInput").focus();
}

async function sendMessage() {
  const input = document.getElementById("userInput");
  const chatbox = document.getElementById("chatbox");
  const loader = document.getElementById("loader");
  const message = input.value.trim();

  if (!message) return;

  loader.style.display = "block";
  input.disabled = true;

  try {
    const res = await fetch("https://chatbot-o4gm.onrender.com/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: message })
    });

    const data = await res.json();
    const answer = data.answer;

    typeWriterEffect(chatbox, answer);
  } catch (err) {
    chatbox.innerHTML += `❌ Erreur : impossible de contacter le serveur.<br>`;
    console.error(err);
  } finally {
    input.value = "";
    input.disabled = false;
    loader.style.display = "none";
  }
}

function typeWriterEffect(element, text) {
  let i = 0;
  element.innerHTML = ""; // On efface tout pour ne pas accumuler les messages
  const paragraph = document.createElement("p");
  element.appendChild(paragraph);

  const interval = setInterval(() => {
    const char = text.charAt(i);
    if (char === "\n") {
      paragraph.innerHTML += "<br>";
    } else {
      paragraph.innerHTML += char;
    }
    i++;
    if (i >= text.length) clearInterval(interval);
  }, 15);
}

// Auto-question au chargement (sans afficher la question)
window.addEventListener("DOMContentLoaded", () => {
  const defaultMessage = "C’est quoi La Station Production ?";
  document.getElementById("userInput").value = defaultMessage;
  sendMessage();
});
