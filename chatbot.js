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

    typeWriterEffect(chatbox, marked.parse(answer));


  } catch (err) {
    chatbox.innerHTML += `\n\n❌ Erreur : impossible de contacter le serveur.`;
    console.error(err);
  } finally {
    input.value = "";
    input.disabled = false;
    loader.style.display = "none";
  }
}

function typeWriterEffect(element, html) {
  let tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  let text = tempDiv.textContent || tempDiv.innerText || "";

  let i = 0;
  element.innerHTML = "";
  const interval = setInterval(() => {
    const char = text.charAt(i);
    if (char === "\n") {
      element.innerHTML += "<br>";
    } else {
      element.innerHTML += char;
    }
    i++;
    if (i >= text.length) clearInterval(interval);
  }, 15);
}

