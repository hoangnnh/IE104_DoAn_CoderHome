  const input = document.querySelector('.text-input');
  const sendBtn = document.querySelector('.send-btn');
  const messageContainer = document.querySelector('.container-message');

  const apiKey = "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"; 
  const endpoint = "https://openrouter.ai/api/v1/chat/completions"; // ✅ Sửa endpoint

  function appendMessage(role, text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    messageDiv.textContent = text;
    messageContainer.appendChild(messageDiv);
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  appendMessage("user", text);
  input.value = "";
  appendMessage("bot", "⏳ Đang trả lời...");

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-0528:free", // ✅ Model hợp lệ trên OpenRouter
        messages: [
          { role: "system", content: "Bạn là chatbot nói tiếng Việt tự nhiên, thân thiện và hữu ích." },
          { role: "user", content: text }
        ]
      })
    });

    const data = await response.json();
    messageContainer.lastChild.remove();

    if (data?.choices?.length) {
      appendMessage("bot", data.choices[0].message.content);
    } else {
      appendMessage("bot", "❌ Không nhận được phản hồi từ AI.");
    }

  } catch (err) {
    messageContainer.lastChild.remove();
    appendMessage("bot", "⚠️ Lỗi: " + err.message);
  }
}

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });x
