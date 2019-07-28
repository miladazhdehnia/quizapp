
import {
    shuffle
} from "./modules/array-shuffle.js";
import {
    questions
} from "./modules/qustions.js";

const start = document.getElementById('start');
const quiz = document.getElementById('quiz');
const question = document.getElementById('question');
const choicesContinr = document.getElementById('choices');
const timeGauge = document.getElementById('timegauge');
const progress = document.getElementById('progress');
const scoreContainer = document.getElementById('score-container');
const counter = document.getElementById('counter');
const restart = document.getElementById('restart');

const red = 'rgba(204, 51, 51, 1)';
const green = 'rgba(94, 237, 99, 1)';
const yellow = 'rgba(237, 213, 94, 1)';

let lastQuestionIndex = questions.length - 1;
let currentQuestionIndex = 0;

let score = 0;
let timer; //1000ms = 1s
let count = 0;
const questionTime = 10; //10sec
const gaugeWidth = 10;
const gaugeUnit = gaugeWidth / questionTime;

function renderQuestion() {
    let q = questions[currentQuestionIndex];
    //shuffle the choices for ervery restart
    let choices = shuffle(q.choices);
    question.innerHTML = "<p>" + q.question + "</p>";
    let i = 1;
    for (const choice of choices) {
        let div = document.getElementById('choice' + i);
        div.innerHTML = choice;
        i++;
    }
    choicesContinr.addEventListener('click', checkAnswer);
}


function renderProgress() {
    for (let qIndex = 0; qIndex <= lastQuestionIndex; qIndex++) {
        let div = document.createElement('div');
        div.setAttribute('class', 'prog');
        div.setAttribute('id', 'p' + qIndex)
        progress.appendChild(div);
    }
}

function renderCount() {
    if (count <= questionTime) {
        counter.innerHTML = count;
        timeGauge.style.width = count * gaugeUnit + "rem";
        count++
    } else {
        count = 0;
        answerIsWrong()
        nextOrEnd()
    }
}


function checkAnswer(e) {
    count = 0;
    choicesContinr.removeEventListener('click', checkAnswer);
    let correct = questions[currentQuestionIndex].correct;
    if (e.target.innerHTML == correct) {
        answeIsCorrect()
    } else {
        answerIsWrong()
    }
    nextOrEnd()
}
//check if another question is remaining render it or if not end the game
let nextOrEnd = () => {
    if (currentQuestionIndex < lastQuestionIndex) {
        currentQuestionIndex++;
        return renderQuestion();
    } else if (currentQuestionIndex = lastQuestionIndex) {
        return endGame()
    }
}

function answeIsCorrect() {
    console.log('correct')
    document.getElementById('p' + currentQuestionIndex)
        .style.backgroundColor = green;
    score++
}

function answerIsWrong() {
    console.log('wrong')
    document.getElementById('p' + currentQuestionIndex)
        .style.backgroundColor = red;
}

async function startGame() {
    start.style.display = 'none';
    await renderQuestion();
    timer = setInterval(renderCount, 1000);
    quiz.style.display = 'block';
    renderProgress();
    renderCount();
}
async function endGame() {
    clearInterval(timer);
    await setTimeout(
        () => {
            quiz.style.display = 'none';
            scores();
        }, 500)
        setTimeout(
            () => {
                restart.style.display = 'block';
            }, 1000)
}

function scores() {
    scoreContainer.style.display = 'block';
    switch (score) {
        case 3:
            let three = '<i class="fa fa-laugh fa-3x"></i> <p>ترکوندی من چی بگم؟!</p>'
            scoreContainer.style.color = green;
            scoreContainer.innerHTML = three;
            break;
        case 2:
            let two = '<i class="fa fa-smile fa-3x"></i> <p>خوب بود!</p>'
            scoreContainer.style.color = yellow;
            scoreContainer.innerHTML = two;
            break;
        case 1:
            scoreContainer.style.color = red;
            let one = '<i class="fa fa-meh fa-3x"></i> <p>اون یدونرم شانسی زدی نه؟</p>'
            scoreContainer.innerHTML = one;
            break;
            //when have 3 wrong answer
        default:
            scoreContainer.style.color = red;
            scoreContainer.innerHTML = '<i class="fa fa-meh-blank fa-3x"></i> <p>برو نبینمت یدونه درست میزدی ثواب داشت</p>'

    }
}

start.addEventListener('click', startGame)