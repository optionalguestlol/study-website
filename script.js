 async function loadStudyMaterial() {
    try {
        const response = await fetch("current.json");

        if (!response.ok) {
            throw new Error("Could not load study material.");
        }

        const data = await response.json();

        // =========================
        // LESSON
        // =========================

        const lessonElement = document.getElementById("lesson");

        lessonElement.innerHTML = data.lesson
            .split(/\r?\n+/)
            .filter(paragraph => paragraph.trim() !== "")
            .map(paragraph => `<p>${paragraph.trim()}</p>`)
            .join("");


        // =========================
        // QUIZ SETUP
        // =========================

        const questionsContainer =
            document.getElementById("questions");

        questionsContainer.innerHTML = "";

        let score = 0;

        const answeredCorrectly = new Set();


        // =========================
        // PROGRESS
        // =========================

        const progressText =
            document.getElementById("progressText");

        const progressFill =
            document.getElementById("progressFill");


        function updateProgress() {

            const total = data.questions.length;
            const completed = answeredCorrectly.size;

            progressText.textContent =
                `${completed} / ${total} completed`;

            const percentage =
                total === 0
                    ? 0
                    : (completed / total) * 100;

            progressFill.style.width =
                `${percentage}%`;

            if (completed === total && total > 0) {
                showCompletion();
            }
        }


        // =========================
        // SCORE DISPLAY
        // =========================

        const scoreDisplay =
            document.createElement("div");

        scoreDisplay.className = "score";

        scoreDisplay.textContent =
            `Score: 0 / ${data.questions.length}`;

        questionsContainer.appendChild(scoreDisplay);


        // =========================
        // QUESTIONS
        // =========================

        data.questions.forEach((item, index) => {

            const questionBox =
                document.createElement("div");

            questionBox.className =
                "question-box";


            const questionTitle =
                document.createElement("h3");

            questionTitle.textContent =
                `${index + 1}. ${item.question}`;

            questionBox.appendChild(questionTitle);


            const feedback =
                document.createElement("div");

            feedback.className =
                "feedback";

            feedback.setAttribute(
                "aria-live",
                "polite"
            );


            item.options.forEach(option => {

                const button =
                    document.createElement("button");

                button.className =
                    "option";

                button.textContent =
                    option;

                button.type =
                    "button";


                button.addEventListener(
                    "click",
                    () => {

                        // Question already completed
                        if (
                            answeredCorrectly.has(index)
                        ) {
                            return;
                        }


                        // =========================
                        // CORRECT
                        // =========================

                        if (
                            option === item.correctAnswer
                        ) {

                            button.classList.remove(
                                "wrong"
                            );

                            button.classList.add(
                                "correct"
                            );


                            feedback.textContent =
                                "✓ Correct!";

                            feedback.className =
                                "feedback correct-text";


                            answeredCorrectly.add(
                                index
                            );

                            score++;


                            scoreDisplay.textContent =
                                `Score: ${score} / ${data.questions.length}`;


                            // Disable all options
                            const allButtons =
                                questionBox.querySelectorAll(
                                    ".option"
                                );

                            allButtons.forEach(btn => {
                                btn.disabled = true;
                            });


                            updateProgress();

                        }


                        // =========================
                        // WRONG
                        // =========================

                        else {

                            button.classList.add(
                                "wrong"
                            );

                            feedback.textContent =
                                "✗ Not quite — try again!";

                            feedback.className =
                                "feedback wrong-text";


                            // Disable only
                            // this wrong option
                            button.disabled = true;
                        }
                    }
                );


                questionBox.appendChild(button);

            });


            questionBox.appendChild(feedback);

            questionsContainer.appendChild(
                questionBox
            );

        });


        // =========================
        // RESET BUTTON
        // =========================

        const resetButton =
            document.createElement("button");

        resetButton.className =
            "reset-button";

        resetButton.textContent =
            "↻ Reset Quiz";

        resetButton.type =
            "button";


        resetButton.addEventListener(
            "click",
            () => {

                loadStudyMaterial();

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }
        );


        questionsContainer.appendChild(
            resetButton
        );


        updateProgress();


        // =========================
        // COMPLETION
        // =========================

        function showCompletion() {

            const completionCard =
                document.getElementById(
                    "completionCard"
                );

            const finalScore =
                document.getElementById(
                    "finalScore"
                );

            const completionMessage =
                document.getElementById(
                    "completionMessage"
                );


            finalScore.textContent =
                `${score} / ${data.questions.length}`;


            const percentage =
                Math.round(
                    (score / data.questions.length) * 100
                );


            if (percentage === 100) {

                completionMessage.textContent =
                    "Perfect score! You mastered this lesson! 🏆";

            } else if (percentage >= 80) {

                completionMessage.textContent =
                    "Excellent work! You really understand this topic! 🌟";

            } else if (percentage >= 60) {

                completionMessage.textContent =
                    "Good job! Review the lesson once more to strengthen your understanding. 💪";

            } else {

                completionMessage.textContent =
                    "Nice attempt! Go through the lesson again and give the quiz another try. 📚";
            }


            completionCard.classList.remove(
                "hidden"
            );


            completionCard.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }


        // =========================
        // COMPLETION RESET
        // =========================

        const completionReset =
            document.getElementById(
                "completionReset"
            );


        completionReset.addEventListener(
            "click",
            () => {

                loadStudyMaterial();

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }
        );


        // =========================
        // DARK MODE
        // =========================

        const themeButton =
            document.getElementById(
                "themeButton"
            );


        themeButton.addEventListener(
            "click",
            () => {

                document.body.classList.toggle(
                    "dark"
                );


                if (
                    document.body.classList.contains(
                        "dark"
                    )
                ) {

                    themeButton.textContent =
                        "☀️";

                } else {

                    themeButton.textContent =
                        "🌙";
                }
            }
        );


        // =========================
        // BACK TO TOP
        // =========================

        const topButton =
            document.getElementById(
                "topButton"
            );


        topButton.addEventListener(
            "click",
            () => {

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );


    } catch (error) {

        console.error(error);

        document.getElementById(
            "lesson"
        ).textContent =
            "Study material could not be loaded.";
    }
}


loadStudyMaterial();
