async function loadStudyMaterial() {
    try {
        const response = await fetch("current.json");

        if (!response.ok) {
            throw new Error("Could not load study material.");
        }

        const data = await response.json();

        document.getElementById("summary").textContent = data.summary;

        const questionsContainer = document.getElementById("questions");
        questionsContainer.innerHTML = "";

        data.questions.forEach((question, index) => {
            const questionElement = document.createElement("div");
            questionElement.className = "question";
            questionElement.textContent = `${index + 1}. ${question}`;
            questionsContainer.appendChild(questionElement);
        });

        const answersContainer = document.getElementById("answers");
        answersContainer.innerHTML = "";

        data.answers.forEach((answer, index) => {
            const answerElement = document.createElement("div");
            answerElement.className = "answer";
            answerElement.textContent = `${index + 1}. ${answer}`;
            answersContainer.appendChild(answerElement);
        });

    } catch (error) {
        document.getElementById("summary").textContent =
            "Study material is not available yet.";

        console.error(error);
    }
}

loadStudyMaterial();
