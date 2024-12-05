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
const downloadButton = document.createElement('button');  // New Download Button

let patientDetails = {};
let currentQuestion = 0;
let symptoms = "";  // Store user's symptoms for use in prescription
let additionalSymptoms = ""; // Store additional symptoms
let userAllergies = "";  // Store user's allergies

// Chatbot flow (Improved questions based on symptoms)
const questions = [
    "What symptoms are you experiencing?",
    "How long have you had these symptoms?",
    "Do you have any further symptoms?",
    "Do you have any further questions?"
];

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
    chatInput.value = '';

    // Process bot response with a delay
    setTimeout(() => {
        botResponse(userMessage);
    }, 1500);  // Delay before bot responds
});

// Add message to chat window
function addMessage(text, sender) {
    const message = document.createElement('div');
    message.className = `message ${sender}`;
    message.textContent = text;
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
}

// Simulate bot response based on user input
function botResponse(userMessage) {
    const normalizedMessage = userMessage.toLowerCase().trim();

    // Check if the response is valid and relevant
    if (currentQuestion === 0) {
        if (!normalizedMessage || !isValidSymptoms(normalizedMessage)) {
            addMessage("Please describe your symptoms clearly. For example: 'fever', 'headache', etc.", "bot");
            return;
        }
        symptoms = normalizedMessage;  // Store the user's symptoms
        addMessage("I see, how long have you had these symptoms?", "bot");
        currentQuestion++;
    } else if (currentQuestion === 1) {
        if (!normalizedMessage || !isValidDuration(normalizedMessage)) {
            addMessage("Please provide a valid duration (e.g., '2 days', '1 week').", "bot");
            return;
        }
        addMessage("Got it! Do you have any further symptoms?", "bot");
        currentQuestion++;
    } else if (currentQuestion === 2) {
        if (normalizedMessage.toLowerCase().includes('no') || normalizedMessage.toLowerCase().includes('none')) {
            addMessage("Okay, do you have any further questions?", "bot");
        } else {
            additionalSymptoms = normalizedMessage;  // Store additional symptoms
            addMessage("Got it. Do you have any further questions?", "bot");
        }
        currentQuestion++;
    } else if (currentQuestion === 3) {
        addMessage("Thank you for providing the information. Would you like to see your medical report?", "bot");
        currentQuestion++;
    } else {
        addMessage("I hope I was able to help. Here is your report:", "bot");
        const showReportButton = document.createElement('button');
        showReportButton.textContent = "Show Report";
        showReportButton.addEventListener('click', showSummary);
        chatSection.appendChild(showReportButton);
    }
}

// Check if symptoms are valid
function isValidSymptoms(symptoms) {
    const validSymptoms = ['fever', 'headache', 'cold', 'cough', 'stomach pain', 'nausea'];
    return validSymptoms.some(symptom => symptoms.includes(symptom));
}

// Check if duration is valid
function isValidDuration(duration) {
    const durationPattern = /\d+\s*(days|weeks|months)/;
    return durationPattern.test(duration);
}

// Generate Dynamic Prescription based on symptoms and responses
function generatePrescription(symptoms) {
    let medication = "";
    let advice = "";

    if (symptoms.toLowerCase().includes("fever")) {
        medication = "Paracetamol 500mg every 6 hours for 3 days";
        advice = "Make sure to stay hydrated, rest well, and avoid cold drinks or spicy foods.\nAllow your body to recover by getting adequate rest and sleep.\nKeep track of your temperature using a thermometer to check if the fever persists or rises significantly.\nUse a damp cloth on your forehead to help reduce your body temperature.";
    } else if (symptoms.toLowerCase().includes("headache")) {
        medication = "Ibuprofen 400mg twice a day for 3 days";
        advice = "Rest in a quiet, dark room. Drink plenty of water and avoid stress.";
    } else if (symptoms.toLowerCase().includes("cold") || symptoms.toLowerCase().includes("cough")) {
        medication = "Cough syrup 10ml thrice a day and Paracetamol 500mg if fever occurs";
        advice = "Avoid exposure to cold air. Drink warm fluids and avoid smoking.";
    } else if (symptoms.toLowerCase().includes("stomach pain")) {
        medication = "Antacids 20mg twice a day";
        advice = "Avoid spicy and greasy food. Drink water and eat light foods like rice and bananas.";
    } else {
        medication = "Consult a doctor for a detailed examination";
        advice = "Take rest and stay hydrated.";
    }

    return { medication, advice };
}

// Show summary with dynamic prescription
function showSummary() {
    const { medication, advice } = generatePrescription(symptoms);

    summaryPatientDetails.innerHTML = `
        <strong>Name:</strong> ${patientDetails.name}<br>
        <strong>Father's Name:</strong> ${patientDetails.fatherName}<br>
        <strong>Age:</strong> ${patientDetails.age}<br>
        <strong>Gender:</strong> ${patientDetails.gender}<br>
        <strong>Mobile:</strong> ${patientDetails.mobile}<br>
        <strong>Address:</strong> ${patientDetails.address}
    `;
    summaryPrescription.innerHTML = `
        <strong>Prescription:</strong> ${medication}<br>
        <strong>Advice:</strong> ${advice}
    `;

    // Add Download Button
    downloadButton.textContent = "Download Report";
    downloadButton.addEventListener('click', downloadReport);
    summarySection.appendChild(downloadButton);

    chatSection.classList.remove('active');
    summarySection.classList.add('active');
}

// Download the medical report
// Download the medical report in PDF format
function downloadReport() {
    const { medication, advice } = generatePrescription(symptoms);

    // Create a new PDF document
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const id=564;

    // Add Title
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 255); // Blue color for the title
    doc.text('MEDICAL REPORT', 105, 20, { align: 'center' });

    // Add Patient Details Section
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0); // Black color for text
    doc.text('Patient Details:', 10, 30);
    doc.setFontSize(12);
    doc.text(`ID: ${id}`, 10, 35);
    doc.text(`Name: ${patientDetails.name}`, 10, 40);
    doc.text(`Father's Name: ${patientDetails.fatherName}`, 10, 45);
    doc.text(`Age: ${patientDetails.age}`, 10, 50);
    doc.text(`Gender: ${patientDetails.gender}`, 10, 55);
    doc.text(`Mobile: ${patientDetails.mobile}`, 10, 60);
    doc.text(`Address: ${patientDetails.address}`, 10, 65);

    // Add Symptoms Section
    doc.setFontSize(14);
    doc.text('Symptoms:', 10, 80);
    doc.setFontSize(12);
    doc.text(`Primary Symptoms: ${symptoms}`, 10, 90);
    doc.text(`Additional Symptoms: ${additionalSymptoms || "None"}`, 10, 95);

    // Add Prescription Section
    doc.setFontSize(14);
    doc.text('Prescription:', 10, 110);
    doc.setFontSize(12);
    doc.text(`Medication: ${medication}`, 10, 120);

    // Add Medical Advice Section
    doc.setFontSize(14);
    doc.text('Medical Advice:', 10, 135);
    doc.setFontSize(12);
    doc.text(advice, 10, 145);

    // Add Footer
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text('Thank you for using DoctorChat!', 10, doc.internal.pageSize.height - 10);

    // Save the generated PDF
    doc.save('MedicalReport.pdf');
}

    

// Restart the process
restartButton.addEventListener('click', () => {
    currentQuestion = 0;
    patientDetails = {};
    symptoms = "";
    additionalSymptoms = "";
    userAllergies = "";
    messages.innerHTML = '';
    formSection.classList.add('active');
    chatSection.classList.remove('active');
    summarySection.classList.remove('active');
});
