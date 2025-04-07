// Réveil du bot (Render gratuit)
fetch("https://chatbot-o4gm.onrender.com/ask", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query: "C’est quoi La Station Production ?" })
})
.then(() => console.log("✅ Bot réveillé"))
.catch(err => console.warn("❌ Bot injoignable", err));
