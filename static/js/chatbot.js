const chatbotFAQs = [
    {
        keywords: ["time", "timing", "timings", "waqt", "kitny baje", "kab khulta", "kab start", "school hours", "school timing", "school timing kya hai"],
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
        answer: "Hamari boys aur girls ke liye alag alag branches hain jo aik dusre ke kaafi kareeb hain, zyada door nahi hain."
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
        keywords: ["address", "location", "kahan hai", "where is", "kahan", "rasta", "map"],
        answer: "Ahmad Cottage, Opp. Best Way CNG, Raja Pur Stop, Khanewal Road, Multan."
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
        keywords: ["subject", "subjects", "parhai", "kya parhatay", "syllabus", "syllabuss"],
        answer: "School mein Government of Punjab ka syllabus parhaya jata hai. Core subjects mein Math, Science, Computer, English, Social Studies/Islamiat wagera shamil hain."
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
        keywords: ["books", "book", "kitab", "kitabain", "notebook", "notebooks", "copies", "register"],
        answer: "Books aap kisi bhi book center se le sakte hain, jabke school se official notebooks (copies) milengi."
    },
    {
        keywords: ["uniform", "dress", "kapray", "wardrobe"],
        answer: "Uniform school se nahi milta, aap market se khareed sakte hain."
    },
    {
        keywords: ["sports", "game", "games", "khel", "trip", "trips", "tour", "activity", "activities", "events"],
        answer: "School mein Sports Day bhi hota hai aur bacho ke liye educational & fun trips bhi arrange kiye jate hain."
    },
    {
        keywords: ["ptm", "parent teacher", "meeting", "waldein", "result"],
        answer: "PTM (Parent Teacher Meeting) ke bare mein tafseelat school ke official WhatsApp group mein bata di jati hain."
    },
    {
        keywords: ["security", "cctv", "camera", "safe", "hifazat", "guard", "guards"],
        answer: "Campus fully safe aur secure hai. Yahan CCTV cameras lagay hue hain aur trained security guards bhi majood hain."
    },
    {
        keywords: ["documents", "b form", "bform", "kaghzat", "dakhla form"],
        answer: "Admission ke liye B-Form zaroori nahi hai."
    },
    {
        keywords: ["library", "books room"],
        answer: "Filhal school mein library ki sahulat majood nahi hai."
    },
    {
        keywords: ["power", "light", "electricity", "generator", "solar", "ups"],
        answer: "School mein load shedding se bachne ke liye Generator aur Solar System dono ki sahulat majood hai."
    },
    {
        keywords: ["water", "pani", "drinking water", "peene ka pani"],
        answer: "Students ke liye saaf aur pak clean drinking water ka mukammal intezam hai."
    },
    {
        keywords: ["teacher", "teachers", "staff", "ustad", "qualification", "mar nahi pyar", "mar nahi piyar"],
        answer: "Hamara tamam staff highly qualified aur experienced hai. School mein strict 'Mar Nahi Pyar' policy par amal kiya jata hai."
    },
    {
        keywords: ["discount", "discounts", "concession", "scholarship", "scholarships", "bhen bhai", "sibling", "siblings", "mora"],
        answer: "Bhen-bhaiyon (siblings) ko fee mein discounts diye jate hain, aur mustahiq bacho ko scholarships bhi di jati hain."
    },
    {
        keywords: ["aim", "motto", "maqsad", "vision"],
        answer: "Hamara mukhyaye aim tamaam bacho ko aala aur behtareen taleem dena hai."
    },
    {
        keywords: ["hello", "hi", "salam", "assalam", "aoa", "hey"],
        answer: "Assalam o Alaikum! Main The Educators ka chat helper hoon. Aap mujhse school timings, fee, admission, facilities, principal/director, ya contact ke bare mein pooch sakte hain."
    },
    {
        keywords: ["thank", "thanks", "shukriya", "ok", "aacha"],
        answer: "Aap ka bohot shukriya! Agar koi aur sawal ho toh zaroor poochiye."
    }
];
