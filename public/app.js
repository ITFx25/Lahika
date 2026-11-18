const chatBox = document.getElementById('chat-box');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const welcomeScreen = document.getElementById('welcome-screen');
const newChatBtn = document.getElementById('new-chat-btn');

let sessionId = 'session-' + Date.now();
let chatHistory = [];

function appendMessage(role, text) {
  if (welcomeScreen) welcomeScreen.style.display = 'none';

  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message', role === 'user' ? 'user-msg' : 'bot-msg');
  msgDiv.textContent = text;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msgDiv;
}

async function sendMessage(text) {
  appendMessage('user', text);
  chatHistory.push({ role: 'user', content: text });

  userInput.value = '';
  sendBtn.disabled = true;

  const loadingBubble = appendMessage('bot', 'Lahika is thinking...');

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: chatHistory, sessionId }),
    });

    const data = await response.json();
    loadingBubble.textContent = data.reply || 'Sorry, something went wrong.';
    chatHistory.push({ role: 'assistant', content: data.reply });
  } catch (error) {
    loadingBubble.textContent = 'Network error. Please try again.';
  } finally {
    sendBtn.disabled = false;
  }
}

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = userInput.value.trim();
  if (text) sendMessage(text);
});

function sendQuickPrompt(text) {
  sendMessage(text);
}

newChatBtn.addEventListener('click', () => {
  sessionId = 'session-' + Date.now();
  chatHistory = [];
  chatBox.innerHTML = '';
  if (welcomeScreen) {
    welcomeScreen.style.display = 'block';
    chatBox.appendChild(welcomeScreen);
  }
});
