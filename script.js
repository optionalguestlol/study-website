async function loadStudyMaterial() {
    try {
        const response = await fetch("current.json");

        if (!response.ok) {
            throw new Error("Could not load study material.");
        }

        const data = await response.json();

        // Display summary
        document.getElementById("summary").textContent = data.summary;

        // Display questions
        const questionsContainer = document.getElementById("questions");
        questionsContainer.innerHTML = "";

        data.questions.forEach((item, index) => {
            const questionBox = document.createElement("div");
            questionBox.className = "question-box";

            const questionTitle = document.createElement("h3");
            questionTitle.textContent = `${index + 1}. ${item.question}`;

            questionBox.appendChild(questionTitle);

            const feedback = document.createElement("div");
            feedback.className = "feedback";
            feedback.setAttribute("aria-live", "polite");

            item.options.forEach(option => {
                const button = document.createElement("button");
                button.className = "option";
                button.textContent = option;

                button.addEventListener("click", () => {

                    // Prevent answering again
                    const allButtons =
                        questionBox.querySelectorAll(".option");

                    allButtons.forEach(btn => {
                        btn.disabled = true;
                    });

                    if (option === item.correctAnswer) {
                        button.classList.add("correct");
                        feedback.textContent = "✓ Correct!";
                        feedback.className = "feedback correct-text";
                    } else {
                        button.classList.add("wrong");
                        feedback.textContent =
                            `✗ Incorrect. The correct answer is: ${item.correctAnswer}`;
                        feedback.className = "feedback wrong-text";

                        // Highlight correct answer
                        allButtons.forEach(btn => {
                            if (btn.textContent === item.correctAnswer) {
                                btn.classList.add("correct");
                            }
                        });
                    }
                });

                questionBox.appendChild(button);
            });

            questionBox.appendChild(feedback);
            questionsContainer.appendChild(questionBox);
        });

    } catch (error) {
        console.error(error);

        document.getElementById("summary").textContent =
            "Study material could not be loaded.";
    }
}

loadStudyMaterial();
