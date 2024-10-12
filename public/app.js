document.addEventListener('DOMContentLoaded', () => { 
    // Wait until the HTML content is fully loaded before running the script
    const chatWindow = document.getElementById('chat-window'); 
    // Reference to the chat window div for displaying messages
    const chatInput = document.getElementById('chat-input'); 
    // Reference to the input field where users type their messages
    const sendBtn = document.getElementById('send-btn'); 
    // Reference to the send button
    const socket = io(); 
    // Initialize a connection to the server via Socket.IO

    const anonymousUsers = ['User1', 'User2', 'User3', 'User4', 'User5', 'User6', 'User7', 'User8', 'User9', 'User10', 'User11', 'User12', 'User13', 'User14', 'User15'];
    // Array of anonymous usernames for assigning to users in the chat

    const aiUser = anonymousUsers[Math.floor(Math.random() * anonymousUsers.length)];
    // Randomly select an anonymous user to represent the AI

    sendBtn.addEventListener('click', sendMessage); 
    // Add event listener for send button to trigger sendMessage function when clicked

    function sendMessage() {
        const messageText = chatInput.value;
        // Get the text entered by the user in the input field
        if (messageText === '') return; 
        // If the message is empty, do nothing

        const user = anonymousUsers[Math.floor(Math.random() * anonymousUsers.length)];
        // Randomly select an anonymous user to attribute the message to
        const message = { user, text: messageText };
        // Create a message object with the user's name and message text
        socket.emit('chatMessage', message);
        // Send the message to the server via the 'chatMessage' event
        chatInput.value = ''; 
        // Clear the input field after sending the message
    }

    socket.on('chatMessage', (message) => {
        // Listen for incoming 'chatMessage' events from the server
        const messageElement = document.createElement('div');
        // Create a new div element to hold the message
        messageElement.classList.add('message'); 
        // Add the 'message' class to style the message
        messageElement.innerHTML = `<strong>${message.user}:</strong> ${message.text}`;
        // Set the inner HTML to display the user's name in bold and the message text
        chatWindow.appendChild(messageElement); 
        // Append the message to the chat window
        chatWindow.scrollTop = chatWindow.scrollHeight; 
        // Automatically scroll to the bottom of the chat window to show the latest message
    });

    function generateAiResponse() {
        const aiMessageText = "This is an AI-generated response.";
        // Text for the AI's automated response
        const aiMessage = { user: aiUser, text: aiMessageText };
        // Create a message object for the AI
        socket.emit('chatMessage', aiMessage);
        // Send the AI's message to the server
    }
});
