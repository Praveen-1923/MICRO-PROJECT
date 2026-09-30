const lessonData = {

    "Human Body": {
        description: "Learn about the major organs and systems of the human body.",
        topics: [
            "Major organs",
            "Human body systems",
            "Functions of organs"
        ]
    },

    "Solar System": {
        description: "Explore the Sun, planets and other objects in our solar system.",
        topics: [
            "The Sun",
            "Planets",
            "Planetary orbits",
            "Other objects in the Solar System"
        ]
    },

    "Plants": {
        description: "Learn about plant parts, photosynthesis and plant growth.",
        topics: [
            "Parts of a plant",
            "Photosynthesis",
            "Plant growth"
        ]
    },

    "Animals": {
        description: "Understand different types of animals and their characteristics.",
        topics: [
            "Animal groups",
            "Animal characteristics",
            "Animal habitats"
        ]
    },

    "Cells": {
        description: "Learn about cells and their basic structures.",
        topics: [
            "Cell structure",
            "Cell membrane",
            "Nucleus",
            "Cell functions"
        ]
    },

    "Force and Motion": {
        description: "Understand force, motion and movement.",
        topics: [
            "Force",
            "Motion",
            "Speed",
            "Direction"
        ]
    },

    "Light": {
        description: "Learn about light, reflection and refraction.",
        topics: [
            "Sources of light",
            "Reflection",
            "Refraction"
        ]
    },

    "Energy": {
        description: "Explore different forms of energy.",
        topics: [
            "Types of energy",
            "Kinetic energy",
            "Potential energy"
        ]
    },

    "Earth": {
        description: "Learn about the structure and features of Earth.",
        topics: [
            "Earth's structure",
            "Landforms",
            "Oceans"
        ]
    },

    "Maps": {
        description: "Learn how maps represent different places.",
        topics: [
            "Types of maps",
            "Map symbols",
            "Directions"
        ]
    },

    "Continents": {
        description: "Explore the continents of the world.",
        topics: [
            "Seven continents",
            "Continental locations",
            "Major geographical features"
        ]
    }

};


const params = new URLSearchParams(window.location.search);

const lessonName = params.get("lesson");


const lesson = lessonData[lessonName];


if (lesson) {

    document.getElementById("lessonTitle").textContent =
        lessonName;

    document.getElementById("lessonDescription").textContent =
        lesson.description;


    const topicList =
        document.getElementById("lessonTopics");


    lesson.topics.forEach(topic => {

        const item = document.createElement("li");

        item.textContent = topic;

        topicList.appendChild(item);

    });

}
const continueButton = document.getElementById("continueButton");

continueButton.addEventListener("click", function () {

    const selectedLesson =
        encodeURIComponent(lessonName);

    window.location.href =
        "visualization.html?lesson=" + selectedLesson;

});