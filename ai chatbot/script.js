// =================== GEMINI FREE API KEY ===================
const API_KEY = "AIzaSyDafSgvuDc_Fmk6ITJzHAPQcy2nrSKhAzc";

const chatInput = document.querySelector(".chat-input");
const sendButton = document.querySelector("#send-chat");
const chatBody = document.querySelector(".chatbot-body");


// ================= SHOW MESSAGE IN CHAT =================
function addMessage(content, sender) {
  const div = document.createElement("div");
  div.className = `message ${sender}`;
  div.innerText = content;
  chatBody.appendChild(div);
  chatBody.scrollTop = chatBody.scrollHeight;
}


// ================= CALL GEMINI =================
async function sendMessageToGemini(userMessage) {
  

  const res = await fetch(
    
    "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" + API_KEY,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: userMessage }
            ]
          }
        ]
      })
    }
  );
  console.log("STATUS=",res.status);
console.log("RAW RESPONSE=",await res.clone().text());


  const data = await res.json();
  console.log("Gemini Response →", data);

  // Handle errors
  if (!data.candidates) {
    return "⚠️ Sorry, something went wrong! Check API key or quota.";
  }

  return data.candidates[0].content.parts[0].text;
}




// ================= HANDLE SEND =================
async function handleSend() {
  const text = chatInput.value.trim();
  if (!text) return;

  addMessage(text, "user");
  chatInput.value = "";

  addMessage("Thinking...", "bot");

  const botReply = await sendMessageToGemini(text);

  // Replace last "Thinking..." message
  chatBody.lastChild.innerText = botReply;
}


// ================= EVENT LISTENERS =================
sendButton.addEventListener("click", handleSend);

chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleSend();
  }
});
