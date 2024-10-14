document.addEventListener('DOMContentLoaded', () => {
    const chatWindow = document.getElementById('chat-window');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const socket = io(); 

    // List of anonymous users
    const anonymousUsers = ['User1', 'User2', 'User3', 'User4', 'User5', 'User6', 'User7', 'User8', 'User9', 'User10', 'User11', 'User12', 'User13', 'User14', 'User15'];

    // AI user randomly selected
    const aiUser = anonymousUsers[Math.floor(Math.random() * anonymousUsers.length)];

    // Event listener for the send button
    sendBtn.addEventListener('click', sendMessage);

    // Function to handle sending messages
    function sendMessage() {
        const messageText = chatInput.value.trim();  // Remove any extra spaces
        if (!messageText) return;  // Do nothing if input is empty

        // Select random anonymous user for the message
        const user = anonymousUsers[Math.floor(Math.random() * anonymousUsers.length)];
        const message = { user, text: messageText };
        
        // Emit the human message to the server
        socket.emit('chatMessage', message);
        
        // Clear the chat input after sending the message
        chatInput.value = '';

        // Trigger AI response based on the user message
        generateAiResponse(messageText);
    }

    // Listen for chat messages from the server and display them
    socket.on('chatMessage', (message) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.innerHTML = `<strong>${message.user}:</strong> ${message.text}`;
        chatWindow.appendChild(messageElement);
        chatWindow.scrollTop = chatWindow.scrollHeight;  // Scroll to the latest message
    });

    // Function to send user message to the AI backend for response
    async function sendMessageToAI(messageText) {
        try {
            const response = await fetch('https://4a76-34-86-12-253.ngrok-free.app/generate', {  // Updated URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer YOUR_API_KEY_HERE'  // Include API key in headers
                },
                body: JSON.stringify({ message: messageText })  // Send message in the request body
            });

            const data = await response.json();
            return data.response;  // Return AI-generated response
        } catch (error) {
            console.error("Error communicating with the AI:", error);
            return "Error in generating AI response.";
        }
    }

    // Function to handle AI response generation
    async function generateAiResponse(userMessageText) {
        const aiMessageText = await sendMessageToAI(userMessageText);  // Fetch AI response from backend
        const aiMessage = { user: aiUser, text: aiMessageText };
        socket.emit('chatMessage', aiMessage);  // Send AI message back to the chat
    }
});
