// ---------- The Educators (Soban Campus) - FAQ Chatbot ----------
// Simple rule-based chatbot: matches keywords in the user's question
// to a predefined answer. No external AI/API used - fully offline.

const chatbotFAQs = [
    {
        keywords: ["time", "timing", "waqt", "kitny baje", "kab khulta", "kab start", "school hours"],
        answer: "School ka time subah 8:00 AM se dopeher 1:00 PM tak hai."
    },
    {
        keywords: ["fee", "fees", "charges", "paisay", "kitni fee"],
        answer: "Fee ki tafseel ke liye please school office se rabta karein: 0300-7331807."
    },
    {
        keywords: ["admission", "apply", "dakhla", "admission kaise"],
        answer: "Admission ke liye hamari Admission page par form bhar sakte hain, ya school office tashreef la sakte hain."
    },
    {
        keywords: ["van", "transport", "bus", "pick and drop", "pickup", "lanay"],
        answer: "Ji haan, school van/transport service available hai."
    },
    {
        keywords: ["holiday", "holidays", "chutti", "chuttiyan", "vacation", "break"],
        answer: "Chhuttiyon ka schedule har class ke liye mukhtalif hota hai. Tafseel ke liye school office se rabta karein."
    },
    {
        keywords: ["boys", "girls", "co-education", "coeducation", "ladkay", "ladkiyan", "branch", "branches"],
        answer: "Hamari boys aur girls ke liye alag alag, aik dusre ke qareeb branches hain."
    },
    {
        keywords: ["facility", "facilities", "lab", "computer lab", "chemistry", "science lab", "chemicals"],
        answer: "School mein Computer Lab aur Chemistry Lab (chemicals ke sath) available hain."
    },
    {
        keywords: ["exam", "test", "paper", "assessment", "tests"],
        answer: "Hamara exam system Monthly Tests, Weekly Tests, Round Tests, aur 1st Term / 2nd Term exams par mushtamil hai."
    },
    {
        keywords: ["address", "location", "kahan hai", "where is", "kahan"],
        answer: "Ahmad Cottage, Opp. Best Way CNG, Raja Pur Stop, Mianwali Road, Multan."
    },
    {
        keywords: ["phone", "number", "contact", "call", "rabta"],
        answer: "Aap humein is number par contact kar sakte hain: 0300-7331807."
    },
    {
        keywords: ["class", "classes", "grade", "kon kon si class", "which classes"],
        answer: "Hum Class 1 se Matric (Class 10) tak classes offer karte hain."
    },
    {
        keywords: ["subject", "subjects", "parhai", "kya parhatay"],
        answer: "Mathematics, Science, Computer Science, English, Social Studies/Islamiat, aur Physical Education parhaye jate hain."
    },
    {
        keywords: ["principal", "principal name", "headmistress", "principal ka naam"],
        answer: "Hamari Principal Mam Fozia Mughees hain."
    },
    {
        keywords: ["director", "director name", "director ka naam"],
        answer: "Hamare Director Mr. Maqbool Ahmad hain."
    },
    {
        keywords: ["timetable", "time table", "periods"],
        answer: "Class timetable dekhne ke liye hamari Timetable page visit karein."
    },
    {
        keywords: ["hello", "hi", "salam", "assalam", "aoa", "hey"],
        answer: "Assalam o Alaikum! Main The Educators ka chat helper hoon. Aap mujhse school timings, fee, admission, facilities, principal/director, ya contact ke bare mein pooch sakte hain."
    }
];

const chatbotFallback = "Mujhe iska jawab abhi nahi pata. Please school office se rabta karein: 0300-7331807.";

function getChatbotResponse(message) {
    const lower = message.toLowerCase();
    for (const faq of chatbotFAQs) {
        for (const keyword of faq.keywords) {
            if (lower.includes(keyword)) {
                return faq.answer;
            }
        }
    }
    return chatbotFallback;
}

function addChatMessage(text, sender) {
    const messagesBox = document.getElementById("chatbot-messages");
    const bubble = document.createElement("div");
    bubble.className = "chat-bubble " + (sender === "user" ? "chat-bubble-user" : "chat-bubble-bot");
    bubble.textContent = text;
    messagesBox.appendChild(bubble);
    messagesBox.scrollTop = messagesBox.scrollHeight;
}

function sendChatMessage(presetText) {
    const input = document.getElementById("chatbot-input");
    const text = (presetText !== undefined ? presetText : input.value).trim();
    if (!text) return;

    addChatMessage(text, "user");
    input.value = "";

    setTimeout(function () {
        const response = getChatbotResponse(text);
        addChatMessage(response, "bot");
    }, 400);
}

function toggleChatbot() {
    const panel = document.getElementById("chatbot-panel");
    const isOpen = panel.classList.toggle("chatbot-open");
    if (isOpen && document.getElementById("chatbot-messages").children.length === 0) {
        addChatMessage("Assalam o Alaikum! Main The Educators ka chat helper hoon. Aap mujhse school timings, fee, admission, facilities, principal/director, ya contact ke bare mein pooch sakte hain.", "bot");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("chatbot-input");
    if (input) {
        input.addEventListener("keypress", function (e) {
            if (e.key === "Enter") {
                sendChatMessage();
            }
        });
    }
});
