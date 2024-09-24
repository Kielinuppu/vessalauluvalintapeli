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
    const nextArrow = document.getElementById('nextArrow');

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
        gameScreen.classList.remove('hidden');
        currentRound = 0;
        score = 0;
        stars.innerHTML = '';
        gameQuestions = generateQuestions();
        nextQuestion();
    }

    function generateQuestions() {
        let questions = [];
        let trueCount = 0;
        
        // Ensure at least 2 true statements
        while (trueCount < 2) {
            let index = Math.floor(Math.random() * 6);
            if (!questions.some(q => q.statementIndex === index)) {
                questions.push({ statementIndex: index, imageIndex: index });
                trueCount++;
            }
        }
        
        // Fill the rest randomly
        while (questions.length < 5) {
            let statementIndex = Math.floor(Math.random() * 6);
            let imageIndex = Math.floor(Math.random() * 6);
            if (!questions.some(q => q.statementIndex === statementIndex)) {
                questions.push({ statementIndex, imageIndex });
            }
        }
        
        shuffleArray(questions);
        return questions;
    }

    function nextQuestion() {
        if (currentRound < 5) {
            const { statementIndex, imageIndex } = gameQuestions[currentRound];
            question.textContent = statements[statementIndex];
            nalleImage.src = `kuva${imageIndex + 1}.avif`;
            playAudio(`aani${statementIndex + 1}.mp3`);
            nextArrow.classList.add('hidden');
            trueButton.disabled = false;
            falseButton.disabled = false;
            currentRound++;
        } else {
            endGame();
        }
    }

    function checkAnswer(isTrue) {
        const { statementIndex, imageIndex } = gameQuestions[currentRound - 1];
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
        if (currentRound < 5) {
            nextArrow.classList.remove('hidden');
        } else {
            setTimeout(endGame, 1000);
        }
    }

    function addStar() {
        const star = document.createElement('img');
        star.src = 'tahti.avif';
        star.classList.add('star');
        stars.appendChild(star);
    }

    function endGame() {
        gameScreen.classList.add('hidden');
        endScreen.classList.remove('hidden');
        finalStars.innerHTML = '';
        for (let i = 0; i < score; i++) {
            const star = document.createElement('img');
            star.src = 'tahti.avif';
            star.classList.add('star');
            finalStars.appendChild(star);
        }
        finalFeedback.innerHTML = `<p>HIENOA!</p><p>${score}/5 OIKEIN</p>`;
    }

    function playAudio(filename) {
        const audio = new Audio(filename);
        audio.play();
    }

    startButton.addEventListener('click', startGame);
    playAgainButton.addEventListener('click', () => {
        endScreen.classList.add('hidden');
        startGame();
    });
    trueButton.addEventListener('click', () => checkAnswer(true));
    falseButton.addEventListener('click', () => checkAnswer(false));
    nextArrow.addEventListener('click', nextQuestion);
});