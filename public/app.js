document.addEventListener('DOMContentLoaded', () => {
    const chatWindow = document.getElementById('chat-window');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const socket = io(); 

 
    const anonymousUsers = ['User1', 'User2', 'User3', 'User4', 'User5', 'User6', 'User7', 'User8', 'User9', 'User10', 'User11', 'User12', 'User13', 'User14', 'User15'];
    const aiUser = anonymousUsers[Math.floor(Math.random() * anonymousUsers.length)];

 
    sendBtn.addEventListener('click', sendMessage);
    function sendMessage() {
        const messageText = chatInput.value.trim();  
        if (!messageText) return;  

      
        const user = anonymousUsers[Math.floor(Math.random() * anonymousUsers.length)];
        const message = { user, text: messageText };
        socket.emit('chatMessage', message);
        chatInput.value = '';
        generateAiResponse(messageText);
    }
    socket.on('chatMessage', (message) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.innerHTML = `<strong>${message.user}:</strong> ${message.text}`;
        chatWindow.appendChild(messageElement);
        chatWindow.scrollTop = chatWindow.scrollHeight; 
    });

    
    async function sendMessageToAI(messageText) {
        try {
            const response = await fetch('http://localhost:5000/generate', {  
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer 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'  
                },
                body: JSON.stringify({ message: messageText }) 
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            return data.response;  
        } catch (error) {
            console.error("Error communicating with the AI:", error);
            return null;  
        }
    }

 
    async function generateAiResponse(userMessageText) {
        const aiMessageText = await sendMessageToAI(userMessageText);  // Fetch AI response from backend

        if (aiMessageText) {  
            const aiMessage = { user: aiUser, text: aiMessageText };
            socket.emit('chatMessage', aiMessage);  
        }
    }
});
