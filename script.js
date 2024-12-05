// DOM Elements
const formSection = document.getElementById('form-section');
const chatSection = document.getElementById('chat-section');
const summarySection = document.getElementById('summary-section');

const patientForm = document.getElementById('patient-form');
const startChatButton = document.getElementById('start-chat');
const messages = document.getElementById('messages');
const chatInput = document.getElementById('chat-input');
const sendMessageButton = document.getElementById('send-message');
const summaryPatientDetails = document.getElementById('summary-patient-details');
const summaryPrescription = document.getElementById('summary-prescription');
const restartButton = document.getElementById('restart');

let patientDetails = {};
let currentQuestion = 0;
let symptoms = ""; // Store user's symptoms for use in prescription
let userAllergies = ""; // Store user's allergies

// OpenAI API Configuration
const OPENAI_API_KEY = "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";
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

// Form submission logic
startChatButton.addEventListener('click', () => {
    const formData = new FormData(patientForm);
    patientDetails = {
        name: formData.get('name'),
        fatherName: formData.get('father-name'),
        age: formData.get('age'),
        gender: formData.get('gender'),
        mobile: formData.get('mobile'),
        address: formData.get('address')
    };

    if (Object.values(patientDetails).some(value => !value)) {
        alert('Please fill all fields.');
        return;
    }

    formSection.classList.remove('active');
    chatSection.classList.add('active');
    addMessage("Hello, how may I help you?", "bot"); // Start with the greeting
});

// Handle sending messages
sendMessageButton.addEventListener('click', () => {
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    addMessage(userMessage, "user");
    chatInput.value = ''; // Clear chat input after sending message

    // Fetch bot response from OpenAI
    setTimeout(() => {
        getBotResponse(userMessage);
    }, 1500); // Delay before bot responds
});

// Add message to chat window
function addMessage(text, sender) {
    const message = document.createElement('div');
    message.className = `message ${sender}`;
    message.textContent = text;
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
}

// Fetch bot response from OpenAI
async function getBotResponse(userMessage) {
    try {
        const response = await fetch(OPENAI_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are a helpful medical assistant." },
                    { role: "user", content: userMessage }
                ],
                max_tokens: 100,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error("Failed to fetch response from OpenAI.");
        }

        const data = await response.json();
        const botMessage = data.choices[0].message.content.trim();
        addMessage(botMessage, "bot");
    } catch (error) {
        console.error("Error fetching bot response:", error);
        addMessage("I'm sorry, but I'm having trouble understanding. Could you please repeat?", "bot");
    }
}

// Restart the process
restartButton.addEventListener('click', () => {
    currentQuestion = 0;
    patientDetails = {};
    symptoms = "";
    userAllergies = "";
    messages.innerHTML = '';
    formSection.classList.add('active');
    chatSection.classList.remove('active');
    summarySection.classList.remove('active');
    addMessage("Hello, how may I help you?", "bot"); // Greet user on restart
});
