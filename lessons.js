const lessons = {

    science: [
        {
            title: "Human Body",
            description: "Learn about the major organs and systems of the human body.",
            icon: "🫀"
        },
        {
            title: "Solar System",
            description: "Explore the Sun, planets and other objects in our solar system.",
            icon: "🌍"
        },
        {
            title: "Plants",
            description: "Learn about plant parts, photosynthesis and plant growth.",
            icon: "🌱"
        },
        {
            title: "Animals",
            description: "Understand different types of animals and their characteristics.",
            icon: "🐘"
        }
    ],

    biology: [
        {
            title: "Cells",
            description: "Learn about cells and their basic structures.",
            icon: "🧬"
        },
        {
            title: "Human Body",
            description: "Explore organs and systems of the human body.",
            icon: "🫀"
        },
        {
            title: "Plants",
            description: "Learn about plant structures and growth.",
            icon: "🌱"
        }
    ],

    physics: [
        {
            title: "Force and Motion",
            description: "Understand force, motion and movement.",
            icon: "⚡"
        },
        {
            title: "Light",
            description: "Learn about light, reflection and refraction.",
            icon: "💡"
        },
        {
            title: "Energy",
            description: "Explore different forms of energy.",
            icon: "🔋"
        }
    ],

    geography: [
        {
            title: "Earth",
            description: "Learn about the structure and features of Earth.",
            icon: "🌍"
        },
        {
            title: "Maps",
            description: "Learn how maps represent different places.",
            icon: "🗺️"
        },
        {
            title: "Continents",
            description: "Explore the continents of the world.",
            icon: "🌎"
        }
    ]
};


const params = new URLSearchParams(window.location.search);

const subject = params.get("subject") || "science";

const lessonContainer = document.getElementById("lessonContainer");

const selectedLessons = lessons[subject] || lessons.science;


selectedLessons.forEach((lesson, index) => {

    const card = document.createElement("div");

    card.className = "lesson-card";

    card.innerHTML = `
        <div class="lesson-icon">${lesson.icon}</div>

        <h2>${lesson.title}</h2>

        <p>${lesson.description}</p>

        <button onclick="startLesson(${index})">
            Start Learning
        </button>
    `;

    lessonContainer.appendChild(card);
});


function startLesson(index) {

    const selected = selectedLessons[index];

    const lessonName = encodeURIComponent(selected.title);

    window.location.href =
        "lesson.html?lesson=" + lessonName;
}