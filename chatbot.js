function insertShortcut(text) {
  document.getElementById("userInput").value = text;
  document.getElementById("userInput").focus();
}

async function sendMessage() {
  const input = document.getElementById("userInput");
  const chatbox = document.getElementById("chatbox");
  const loader = document.getElementById("loader");
  const logoLoader = document.getElementById("loader-logo");
  const message = input.value.trim();

  if (!message) return;

  // 🌀 Affiche les loaders et désactive l'input
  loader.style.display = "block";
  input.disabled = true;
  logoLoader.classList.remove("idle");
  logoLoader.classList.add("active");

  try {
    const res = await fetch("https://chatbot-o4gm.onrender.com/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: message })
    });

    const data = await res.json();
    console.log("➡️ Réponse reçue :", data);

    // 🔎 S'assurer que la réponse est bien une string
    const raw = data.answer?.content || "❌ Réponse vide";


    const parsedHTML = marked.parse(raw);

    chatbox.innerHTML = "";
    typeWriterHTML(chatbox, parsedHTML);

  } catch (err) {
    chatbox.innerHTML = `<br><br>❌ Erreur : impossible de contacter le serveur.`;
    console.error("Erreur de connexion ou de parsing :", err);
  } finally {
    input.value = "";
    input.disabled = false;
    loader.style.display = "none";
    logoLoader.classList.remove("active");
    logoLoader.classList.add("idle");
  }
}

// ✨ Animation typewriter compatible HTML balisé
function typeWriterHTML(container, html) {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  const wrapper = document.createElement("div");
  container.appendChild(wrapper);

  const nodes = Array.from(tempDiv.childNodes);
  let i = 0;

  function typeNode(node, parent, done) {
    if (node.nodeType === Node.TEXT_NODE) {
      const span = document.createElement("span");
      parent.appendChild(span);
      let j = 0;
      const text = node.textContent;

      const interval = setInterval(() => {
        span.textContent += text[j];
        j++;
        if (j >= text.length) {
          clearInterval(interval);
          done();
        }
      }, 15);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const clone = node.cloneNode(false);
      parent.appendChild(clone);
      const children = Array.from(node.childNodes);
      let k = 0;

      function nextChild() {
        if (k < children.length) {
          typeNode(children[k], clone, () => {
            k++;
            nextChild();
          });
        } else {
          done();
        }
      }

      nextChild();
    } else {
      done();
    }
  }

  function typeAll() {
    if (i < nodes.length) {
      typeNode(nodes[i], wrapper, () => {
        i++;
        typeAll();
      });
    }
  }

  typeAll();
}

// ↩️ Envoi du message avec "Entrée"
document.getElementById("userInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});

// 💬 Question automatique à l'ouverture
async function askOnLoad() {
  const chatbox = document.getElementById("chatbox");
  const loader = document.getElementById("loader");
  const logoLoader = document.getElementById("loader-logo");

  loader.style.display = "block";
  logoLoader.classList.remove("idle");
  logoLoader.classList.add("active");

  // 🔥 Vérifie s’il y a une réponse déjà prête dans le sessionStorage
  const cached = sessionStorage.getItem("initialResponse");
  if (cached) {
    const parsedHTML = marked.parse(cached);
    chatbox.innerHTML = "";
    typeWriterHTML(chatbox, parsedHTML);
    sessionStorage.removeItem("initialResponse");
    loader.style.display = "none";
    logoLoader.classList.remove("active");
    logoLoader.classList.add("idle");
    return;
  }

  // Sinon, lancer normalement
  try {
    const res = await fetch("https://chatbot-o4gm.onrender.com/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: "C'est quoi La Station Production ?" })
    });

    const data = await res.json();
    const raw = data.answer?.content || "❌ Réponse vide";
    const parsedHTML = marked.parse(raw);

    chatbox.innerHTML = "";
    typeWriterHTML(chatbox, parsedHTML);
  } catch (err) {
    chatbox.innerHTML = `<br><br>❌ Erreur : impossible de charger la réponse initiale.`;
  } finally {
    loader.style.display = "none";
    logoLoader.classList.remove("active");
    logoLoader.classList.add("idle");
  }
}


// 🚀 Lancer la question automatique au chargement
window.addEventListener("DOMContentLoaded", askOnLoad);

