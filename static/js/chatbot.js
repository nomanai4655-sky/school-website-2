// ---------- The Educators (Soban Campus) - FAQ Chatbot ----------
// Enhanced Keyword-Matching with Scoring Algorithm

const chatbotFAQs = [
    {
        id: "timings",
        keywords: ["time", "timing", "timings", "waqt", "kitny baje", "kab khulta", "kab start", "school hours", "saturday", "sunday", "off", "weekend", "chutti", "open time", "close time"],
        answer: "School ka time Monday se Friday subah 8:00 AM se dopeher 1:00 PM tak hai. Saturday aur Sunday ko weekend off hota hai."
    },
    {
        id: "exhibition",
        keywords: ["exhibition", "numaish", "10 october", "10 oct", "october 10", "project", "projects", "science exhibition", "web project", "website project", "exhibition date"],
        answer: "10 October ko school mein Science & Tech Exhibition hai! Yahan students apne innovative science models, web applications, aur chatbot projects display kar rahe hain."
    },
    {
        id: "events",
        keywords: ["sports day", "function", "functions", "event", "events", "festival", "festivals", "activity", "activities", "14 august", "independence day", "iqbal day", "annual day", "trips", "tour"],
        answer: "School mein mukhtalif events aur festivals manaye jate hain jaise Annual Sports Day, Science Exhibition, Independence Day celebrations, Islamic functions, aur Educational Trips."
    },
    {
        id: "fee",
        keywords: ["fee", "fees", "charges", "paisay", "kitni fee", "dues", "dakhla fee", "monthly fee", "structure"],
        answer: "Fee structure aur monthly charges ki mukammal tafseel ke liye please school office se rabta karein: 0300-7331807."
    },
    {
        id: "admission",
        keywords: ["admission", "apply", "dakhla", "admission kaise", "new admission", "dakhla kab", "process", "procedure"],
        answer: "Admission ke liye aap hamari website par Admission Form bhar sakte hain, ya direct school office (8:00 AM se 1:00 PM) visit kar sakte hain."
    },
    {
        id: "transport",
        keywords: ["van", "transport", "bus", "pick and drop", "pickup", "lanay", "gaadi", "route"],
        answer: "Ji haan, school ki apni van/transport service available hai jo mukhtalif routes par students ko pick and drop ki sahulat deti hai."
    },
    {
        id: "vacations",
        keywords: ["holiday", "holidays", "chuttiyan", "vacation", "summer vacation", "winter break", "eid holiday"],
        answer: "Annual vacations aur Eids ki chuttiyon ka schedule official notification aur WhatsApp group ke zariye inform kiya jata hai."
    },
    {
        id: "branches",
        keywords: ["boys", "girls", "co-education", "coeducation", "ladkay", "ladkiyan", "branch", "branches", "separate"],
        answer: "Hamari Boys aur Girls ke liye alag alag branches hain jo aik doosre ke kaafi kareeb hain."
    },
    {
        id: "labs",
        keywords: ["facility", "facilities", "lab", "computer lab", "chemistry lab", "science lab", "chemicals", "practical", "pc"],
        answer: "School mein fully equipped Computer Lab aur Chemistry Lab (safe chemical apparatus ke sath) available hain."
    },
    {
        id: "exams",
        keywords: ["exam", "exams", "test", "tests", "paper", "papers", "assessment", "1st term", "2nd term", "midterm", "final"],
        answer: "Hamara evaluation system Weekly Tests, Monthly Assessments, Round Tests, aur 1st & 2nd Term Exams par mushtamil hai."
    },
    {
        id: "location",
        keywords: ["address", "location", "kahan hai", "where is", "kahan", "rasta", "map", "address kya hai", "stop"],
        answer: "School Address: Ahmad Cottage, Opp. Best Way CNG, Raja Pur Stop, Khanewal Road, Multan."
    },
    {
        id: "contact",
        keywords: ["phone", "number", "contact", "call", "rabta", "mobile", "helpline", "whatsapp"],
        answer: "Aap humein official contact number par call ya WhatsApp kar sakte hain: 0300-7331807."
    },
    {
        id: "classes",
        keywords: ["class", "classes", "grade", "grades", "kon kon si class", "which classes", "matric", "primary", "middle"],
        answer: "Hum Playgroup/Nursery se le kar Class 10th (Matric - Science & Arts) tak classes offer karte hain."
    },
    {
        id: "syllabus",
        keywords: ["subject", "subjects", "parhai", "kya parhatay", "syllabus", "course", "english medium", "pctb", "books name"],
        answer: "School mein Punjab Curriculum & Textbook Board (PCTB) ka updated syllabus English Medium mein parhaya jata hai."
    },
    {
        id: "principal",
        keywords: ["principal", "principal name", "headmistress", "principal ka naam", "mam fozia"],
        answer: "Hamari Principal Mam Fozia Mughees hain."
    },
    {
        id: "director", "keywords": ["director", "director name", "director ka naam", "maqbool ahmed"],
        answer: "Hamare Director Mr. Maqbool Ahmad hain."
    },
    {
        id: "uniform",
        keywords: ["uniform", "dress", "kapray", "wardrobe", "coat", "badge", "tie"],
        answer: "School uniform ki complete details admission ke waqt di jati hain. Aap uniform kisi bhi local market shop se purchase kar sakte hain."
    },
    {
        id: "books",
        keywords: ["books", "book", "kitab", "kitabain", "notebook", "notebooks", "copies", "register", "stationery"],
        answer: "Syllabus books aap kisi bhi book shop se le sakte hain, jabke school official logo wali notebooks (copies) school office se milengi."
    },
    {
        id: "discipline",
        keywords: ["teacher", "teachers", "staff", "ustad", "qualification", "mar nahi pyar", "behavior", "discipline"],
        answer: "Hamara teaching staff highly qualified hai. School mein strict 'Mar Nahi Pyar' policy aur respectful learning environment ko follow kiya jata hai."
    },
    {
        id: "discounts",
        keywords: ["discount", "discounts", "concession", "scholarship", "scholarships", "bhen bhai", "sibling", "siblings", "financial aid"],
        answer: "Bhen-bhaiyon (siblings) ke liye special fee concession di jati hai, aur deserving/merit-based students ko scholarships di jati hain."
    },
    {
        id: "safety",
        keywords: ["security", "cctv", "camera", "safe", "hifazat", "guard", "guards", "boundary"],
        answer: "Campus 100% safe hai. Tamam classrooms aur corridors mein CCTV cameras active hain aur main gate par trained security guards majood hote hain."
    },
    {
        id: "power",
        keywords: ["power", "light", "electricity", "generator", "solar", "ups", "load shedding"],
        answer: "Uninterrupted power supply ke liye campus mein Commercial Solar System aur Backup Generator ki sahulat majood hai."
    },
    {
        id: "documents",
        keywords: ["documents", "b form", "bform", "kaghzat", "dakhla form", "birth certificate", "pictures"],
        answer: "Admission ke liye B-Form zaroori nahi hai, basic details aur previous school leaving certificate/result card required hota hai."
    },
    {
        id: "greeting",
        keywords: ["hello", "hi", "salam", "assalam", "aoa", "hey", "good morning", "kaise ho"],
        answer: "Assalam o Alaikum! Main The Educators ka chat assistant hoon. Aap mujhse timing, fee, admission, 10 October exhibition, ya facilities ke baare mein kuch bhi pooch sakte hain!"
    },
    {
        id: "thanks",
        keywords: ["thank", "thanks", "shukriya", "ok", "acha", "bohot shukriya", "great"],
        answer: "Aap ka bohot shukriya! Agar koi aur sawal ho toh zaroor poochiye."
    }
];

const chatbotFallback = "Mujhe iska exact jawab nahi mila. Please school office se rabta karein: 0300-7331807 par call karein.";

// Flexible Scoring Search Engine
function getChatbotResponse(message) {
    const cleaned = message.toLowerCase().replace(/[^\w\s]/gi, "");
    const userWords = cleaned.split(/\s+/).filter(w => w.length > 0);

    let bestMatch = null;
    let highestScore = 0;

    for (const faq of chatbotFAQs) {
        let score = 0;

        for (const keyword of faq.keywords) {
            const kw = keyword.toLowerCase();

            // Direct Phrase Match (Highest Priority)
            if (kw.includes(" ") && cleaned.includes(kw)) {
                score += 5;
            }
            
            // Individual Word Matching
            for (const word of userWords) {
                if (kw === word) {
                    score += 3; // Exact single word match
                } else if (word.length > 3 && kw.includes(word)) {
                    score += 1; // Partial sub-word match
                }
            }
        }

        if (score > highestScore) {
            highestScore = score;
            bestMatch = faq;
        }
    }

    // Minimum threshold for matching score
    if (highestScore >= 2 && bestMatch) {
        return bestMatch.answer;
    }

    return chatbotFallback;
}

function addChatMessage(text, sender) {
    const messagesBox = document.getElementById("chatbot-messages");
    if (!messagesBox) return;

    const bubble = document.createElement("div");
    bubble.className = "chat-bubble " + (sender === "user" ? "chat-bubble-user" : "chat-bubble-bot");
    bubble.textContent = text;
    messagesBox.appendChild(bubble);
    messagesBox.scrollTop = messagesBox.scrollHeight;
}

function sendChatMessage(presetText) {
    const input = document.getElementById("chatbot-input");
    const text = (presetText !== undefined ? presetText : (input ? input.value : "")).trim();
    if (!text) return;

    addChatMessage(text, "user");
    if (input) input.value = "";

    setTimeout(function () {
        const response = getChatbotResponse(text);
        addChatMessage(response, "bot");
    }, 350);
}

function toggleChatbot() {
    const panel = document.getElementById("chatbot-panel");
    if (!panel) return;
    
    const isOpen = panel.classList.toggle("chatbot-open");
    const messagesBox = document.getElementById("chatbot-messages");
    if (isOpen && messagesBox && messagesBox.children.length === 0) {
        addChatMessage("Assalam o Alaikum! Main The Educators ka chat helper hoon. Aap mujhse school timings, 10 Oct exhibition, fee, admission, ya location ke bare mein pooch sakte hain.", "bot");
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
