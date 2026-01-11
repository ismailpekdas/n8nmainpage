export function initChatWidget() {
    const container = document.getElementById('chat-widget-container');
    if (!container) return;

    // HTML Structure
    const widgetHTML = `
        <div id="chat-widget">
            <div id="chat-window">
                <div class="chat-header">
                    <h3>n8n Asistan</h3>
                    <button class="close-chat-btn">&times;</button>
                </div>
                <div class="chat-messages" id="chat-messages">
                    <div class="message bot">
                        Merhaba! 👋<br>
                        n8n otomasyon hizmetlerimiz hakkında size nasıl yardımcı olabilirim?
                    </div>
                </div>
                <div class="chat-input-area">
                    <input type="text" id="chat-input" placeholder="Mesajınızı yazın...">
                    <button id="send-btn">Gönder</button>
                </div>
            </div>
            <button id="chat-toggle-btn">
                <svg viewBox="0 0 24 24">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                </svg>
            </button>
        </div>
    `;

    container.innerHTML = widgetHTML;

    // Logic
    const toggleBtn = document.getElementById('chat-toggle-btn');
    const closeBtn = document.querySelector('.close-chat-btn');
    const chatWindow = document.getElementById('chat-window');
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const messagesContainer = document.getElementById('chat-messages');

    let isOpen = false;

    function toggleChat() {
        isOpen = !isOpen;
        if (isOpen) {
            chatWindow.classList.add('open');
            input.focus();
        } else {
            chatWindow.classList.remove('open');
        }
    }

    toggleBtn.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);

    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', sender);
        msgDiv.innerHTML = text; // innerHTML to allow line breaks
        messagesContainer.appendChild(msgDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    async function handleSend() {
        const text = input.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        input.value = '';
        input.disabled = true; // Disable input while waiting

        // Show typing indicator
        const typingId = 'typing-' + Date.now();
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('message', 'bot');
        typingDiv.id = typingId;
        typingDiv.textContent = 'Yazıyor...';
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        try {
            const response = await fetch('https://n8n.n8nturkey.com/webhook/ChatbotForn8n', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: text
                })
            });

            const data = await response.json();

            // Remove typing indicator
            const typingMsg = document.getElementById(typingId);
            if (typingMsg) typingMsg.remove();

            // Handle response - assuming data has 'output' or 'text' or is just the text
            // Adjust this based on actual n8n output structure. 
            // Common n8n pattern for chat is { "output": "response text" } or just returning the text/json.
            // For now, let's try to extract the most likely field or stringify.
            let botResponse = "Yanıt alınamadı.";

            if (typeof data === 'string') {
                botResponse = data;
            } else if (data.output) {
                botResponse = data.output;
            } else if (data.message) {
                botResponse = data.message;
            } else if (data.text) {
                botResponse = data.text;
            } else {
                botResponse = JSON.stringify(data); // Fallback debug
            }

            addMessage(botResponse, 'bot');

        } catch (error) {
            console.error('Chat Error:', error);
            const typingMsg = document.getElementById(typingId);
            if (typingMsg) typingMsg.remove();
            addMessage("Üzgünüm, şu anda yanıt veremiyorum. Lütfen daha sonra tekrar deneyin.", 'bot');
        } finally {
            input.disabled = false;
            input.focus();
        }
    }

    sendBtn.addEventListener('click', handleSend);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });
}

// Auto init
document.addEventListener('DOMContentLoaded', initChatWidget);
