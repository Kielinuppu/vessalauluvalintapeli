document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('startScreen');
    const gameScreen = document.getElementById('gameScreen');
    const endScreen = document.getElementById('endScreen');
    const startButton = document.getElementById('startButton');
    const playAgainButton = document.getElementById('playAgainButton');
    const question = document.getElementById('question');
    const nalleImage = document.getElementById('nalleImage');
    const trueButton = document.getElementById('trueButton');
    const falseButton = document.getElementById('falseButton');
    const stars = document.getElementById('stars');
    const finalStars = document.getElementById('finalStars');
    const finalFeedback = document.getElementById('finalFeedback');
    const scoreText = document.getElementById('scoreText');
    const nextArrow = document.getElementById('nextArrow');
    const speakerIcon = document.getElementById('speakerIcon');

    const statements = [
        "NALLELLA ON VESSAHÄTÄ",
        "NALLE ISTUU PÖNTÖLLÄ",
        "NALLE PYYHKII",
        "NALLE VETÄÄ VESSAN",
        "NALLE PESEE KÄDET",
        "NALLE KUIVAA KÄDET"
    ];

    let currentRound = 0;
    let score = 0;
    let gameQuestions = [];

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function startGame() {
        startScreen.classList.add('hidden');
        endScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        currentRound = 0;
        score = 0;
        stars.innerHTML = '';
        gameQuestions = generateQuestions();
        loadQuestionContent(gameQuestions[currentRound]);
        playAudio('avaiv.mp3', () => {
            playQuestionAudio();
        });
    }

    function generateQuestions() {
        let questions = [];
        let trueCount = 0;

        while (trueCount < 2) {
            let index = Math.floor(Math.random() * 6);
            if (!questions.some(q => q.statementIndex === index)) {
                questions.push({ statementIndex: index, imageIndex: index });
                trueCount++;
            }
        }

        while (questions.length < 5) {
            let statementIndex = Math.floor(Math.random() * 6);
            if (!questions.some(q => q.statementIndex === statementIndex)) {
                let possibleImages = [];
                for (let i = 0; i < 6; i++) {
                    if (statementIndex === 1) {
                        if (i !== 1 && i !== 2) {
                            possibleImages.push(i);
                        }
                    } else {
                        if (i !== statementIndex) {
                            possibleImages.push(i);
                        }
                    }
                }
                let randomIndex = Math.floor(Math.random() * possibleImages.length);
                let imageIndex = possibleImages[randomIndex];
                questions.push({ statementIndex, imageIndex });
            }
        }

        shuffleArray(questions);
        return questions;
    }

    function loadQuestionContent(question) {
        const { statementIndex, imageIndex } = question;
        nalleImage.src = `kuva${imageIndex + 1}.png`;
        nalleImage.style.display = 'block';
        this.question.textContent = statements[statementIndex];
        nextArrow.classList.add('hidden');
        trueButton.disabled = false;
        falseButton.disabled = false;
    }

    function playQuestionAudio() {
        const { statementIndex } = gameQuestions[currentRound];
        playAudio(`aani${statementIndex + 1}.mp3`);
    }

    function nextQuestion() {
        if (currentRound < 4) {
            currentRound++;
            loadQuestionContent(gameQuestions[currentRound]);
            playQuestionAudio();
        } else {
            endGame();
        }
    }

    function checkAnswer(isTrue) {
        const { statementIndex, imageIndex } = gameQuestions[currentRound];
        const correctAnswer = statementIndex === imageIndex;
        if ((isTrue && correctAnswer) || (!isTrue && !correctAnswer)) {
            score++;
            playAudio('oikein.mp3');
            addStar();
        } else {
            playAudio('vaarin.mp3');
        }
        trueButton.disabled = true;
        falseButton.disabled = true;
        if (currentRound < 4) {
            nextArrow.classList.remove('hidden'); // Näytetään nuoli vain, jos kysymyksiä on jäljellä
        } else {
            setTimeout(endGame, 1000); // Ei näytetä nuolta pelin lopussa
        }
    }

    nextArrow.addEventListener('click', () => {
        nextArrow.classList.add('hidden'); // Piilotetaan nuoli heti klikattaessa
        nextQuestion(); // Siirrytään seuraavaan kysymykseen
    });

    function addStar() {
        const star = document.createElement('img');
        star.src = 'tahti.png';
        star.classList.add('star');
        stars.appendChild(star);
    }

    function endGame() {
        gameScreen.classList.add('hidden');
        endScreen.classList.remove('hidden');
        finalStars.innerHTML = '';
        for (let i = 0; i < score; i++) {
            const star = document.createElement('img');
            star.src = 'tahti.png';
            star.classList.add('star');
            finalStars.appendChild(star);
        }
        finalFeedback.textContent = 'HIENOA!';
        scoreText.textContent = `${score}/5 OIKEIN`;
    }

    function playAudio(filename, callback) {
        const audio = new Audio(filename);
        audio.play();
        if (callback) {
            audio.onended = callback;
        }
    }

    startButton.addEventListener('click', startGame);
    playAgainButton.addEventListener('click', startGame);
    trueButton.addEventListener('click', () => checkAnswer(true));
    falseButton.addEventListener('click', () => checkAnswer(false));
    speakerIcon.addEventListener('click', playQuestionAudio);
});
