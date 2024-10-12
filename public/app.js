document.addEventListener('DOMContentLoaded', () => {
    const chatWindow = document.getElementById('chat-window');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const socket = io(); 

    const anonymousUsers = ['User1', 'User2', 'User3', 'User4', 'User5', 'User6', 'User7', 'User8', 'User9', 'User10', 'User11', 'User12', 'User13', 'User14', 'User15'];
    const aiUser = anonymousUsers[Math.floor(Math.random() * anonymousUsers.length)];

    sendBtn.addEventListener('click', sendMessage);

    function sendMessage() {
        const messageText = chatInput.value;
        if (messageText === '') return;

     
        const user = anonymousUsers[Math.floor(Math.random() * anonymousUsers.length)];
        const message = { user, text: messageText };
        socket.emit('chatMessage', message);
        chatInput.value = '';
    }
    socket.on('chatMessage', (message) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.innerHTML = `<strong>${message.user}:</strong> ${message.text}`;
        chatWindow.appendChild(messageElement);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    });

    function generateAiResponse() {
        const aiMessageText = "This is an AI-generated response.";
        const aiMessage = { user: aiUser, text: aiMessageText };
        socket.emit('chatMessage', aiMessage);
    }
});
