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

        let score = 0;
        const answeredCorrectly = new Set();

        // Score display
        const scoreDisplay = document.createElement("div");
        scoreDisplay.className = "score";
        scoreDisplay.textContent = `Score: 0 / ${data.questions.length}`;
        questionsContainer.appendChild(scoreDisplay);

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
                button.type = "button";

                button.addEventListener("click", () => {

                    // Don't allow interaction after the question is completed
                    if (answeredCorrectly.has(index)) {
                        return;
                    }

                    if (option === item.correctAnswer) {

                        // Correct answer
                        button.classList.remove("wrong");
                        button.classList.add("correct");

                        feedback.textContent = "✓ Correct!";
                        feedback.className = "feedback correct-text";

                        answeredCorrectly.add(index);
                        score++;

                        scoreDisplay.textContent =
                            `Score: ${score} / ${data.questions.length}`;

                        // Disable all buttons for this question
                        const allButtons =
                            questionBox.querySelectorAll(".option");

                        allButtons.forEach(btn => {
                            btn.disabled = true;
                        });

                    } else {

                        // Wrong answer
                        button.classList.add("wrong");

                        feedback.textContent =
                            "✗ Not quite — try again!";

                        feedback.className =
                            "feedback wrong-text";

                        // Only disable the button that was chosen.
                        // The student can try another answer.
                        button.disabled = true;
                    }
                });

                questionBox.appendChild(button);
            });

            questionBox.appendChild(feedback);
            questionsContainer.appendChild(questionBox);
        });

        // Reset button
        const resetButton = document.createElement("button");
        resetButton.className = "reset-button";
        resetButton.textContent = "↻ Reset Quiz";
        resetButton.type = "button";

        resetButton.addEventListener("click", () => {
            loadStudyMaterial();
        });

        questionsContainer.appendChild(resetButton);

    } catch (error) {
        console.error(error);

        document.getElementById("summary").textContent =
            "Study material could not be loaded.";
    }
}

loadStudyMaterial();
