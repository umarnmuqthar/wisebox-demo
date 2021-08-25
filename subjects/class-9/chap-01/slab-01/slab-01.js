const submitBtn = document.getElementById('submit-btn');
const nextBtn = document.getElementById('next-btn');

const questionElement = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));

const progressBar = document.getElementById('progressBar');

const choiceContainers = Array.from(
  document.getElementsByClassName('choice-container')
);

const choiceExplanationArray = Array.from(
  document.getElementsByClassName('choice-explanation')
);

/////////////loader animation////////////////

const loader = document.getElementById('loader');
const quizHeader = document.getElementById('quiz-header');
const questionSection = document.getElementById('question-section');
const answersSection = document.getElementById('answers-section');

//////////////////QUOTES///////////////////////////

const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
let quotes = [
  {
    quote: 'Practice only makes for improvement.',
    author: 'Les Brown',
  },
  {
    quote:
      'Don’t practice until you get it right. Practice until you can’t get it wrong.',
    author: 'Unknown',
  },
  {
    quote:
      'The more you practice the better you’ll be, the harder you train the great in you they’ll see.',
    author: 'Alcurtis Turner',
  },
  {
    quote: 'If you don’t practice, you don’t deserve to win.',
    author: 'Andre Agassi',
  },
  {
    quote: 'The goal of practice is always to keep our beginner’s mind.',
    author: 'Jack Kornfield',
  },
  {
    quote: 'Practice like you play, little things make big things happen.',
    author: 'Tony Dorsett',
  },
  {
    quote:
      'Best practices are those practices that generally produce the best results.',
    author: 'Chad White',
  },
  {
    quote:
      'When you get to practice against the best, it brings the best out of you.',
    author: 'Marshawn Lynch',
  },
  {
    quote:
      'Practice what you know, and it will help to make clear what now you do not know.',
    author: 'Rembrandt',
  },
  {
    quote: 'Practice puts brains in your muscles.',
    author: 'Sam Snead',
  },
  {
    quote:
      'Success is nothing more than a few simple disciplines, practise every day.',
    author: 'Unknown',
  },
  {
    quote: 'When you practise, you get better. It’s very simple.',
    author: 'Unknown',
  },
  {
    quote: 'Sweat more in practise, bleed less in war.',
    author: 'Spartan Warrior Credo',
  },
];

let currentQuote = {};
let quoteIndex = Math.floor(Math.random() * quotes.length);
currentQuote = quotes[quoteIndex];
quoteText.innerText = currentQuote.quote;
quoteAuthor.innerText = currentQuote.author;
//////////////////////////
let currentQuestion = {};
let availableQuestions = [];
// for progressBar
let questionCounter = 0;

const MAX_QUESTIONS = 8;
let questions = [];

//////////////////////////JSON//////////////////////////////////////////////////////////////////////

fetch('./slab-01.json')
  .then((res) => {
    return res.json();
  })
  .then((loadedQuestions) => {
    questions = loadedQuestions;
    questions = questions.sort(() => Math.random() - 0.5);
    startGame();
  })
  .catch((err) => {
    console.error(err);
  });

//////////////////////////////////////AVAILABLE-QUESTIONS/////////////////////////////////////

function startGame() {
  questionCounter = 1;
  availableQuestions = questions.slice(0, 7);
  console.log(availableQuestions);
  showQuestion();
  quizHeader.classList.remove('hidden');
  questionSection.classList.remove('hidden');
  answersSection.classList.remove('hidden');
  loader.style.display = 'none';
  progressBar.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;
}

choices.forEach((choice) => {
  choice.addEventListener('click', choiceClick);
});

function choiceClick(e) {
  selectedChoice = e.target;
  window.selectedAnswer = selectedChoice.dataset['number'];
  window.closest = selectedChoice.closest('.choice-container');

  if (closest.classList.contains('selected')) {
    closest.classList.remove('selected');
  } else {
    choiceContainers.forEach((e) => {
      e.classList.remove('selected');
    });
    closest.classList.add('selected');
    submitBtn.style.display = 'block';
    submitBtn.classList.add('animate');
  }
}

function answerValidation() {
  if (window.selectedAnswer == currentQuestion.answer) {
    window.closest.classList.add('correct');
    window.closest.lastElementChild.style.display = 'block';
    questionCounter++;
    progressBar.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;
  } else {
    window.closest.classList.add('incorrect');

    choices.forEach((choice) => {
      if (choice.dataset['number'] == currentQuestion.answer) {
        choice.parentElement.parentElement.classList.add('correct');
        choice.parentElement.nextElementSibling.style.display = 'block';
      }
    });
    availableQuestions.push(currentQuestion);
  }
  choiceExplanationArray.forEach((element) => {
    if (element.dataset['number'] == currentQuestion.answer) {
      element.innerHTML = currentQuestion.explanation;
    }
  });

  choices.forEach((choice) => {
    choice.removeEventListener('click', choiceClick);
  });

  window.closest.classList.remove('selected');

  submitBtn.style.display = 'none';
  nextBtn.style.display = 'block';
  nextBtn.classList.add('animate');
}

function setNextQuestion() {
  if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    //go to the end page
    return window.location.assign('./end-01.html');
  }
  showQuestion();

  if (nextBtn.classList.contains('animate')) {
    nextBtn.classList.remove('animate');
  }
  nextBtn.style.display = 'none';
  window.closest.classList.remove('selected');

  choiceContainers.forEach((e) => {
    e.classList.remove('incorrect');
    e.classList.remove('correct');
    e.lastElementChild.style.display = 'none';
  });
  choices.forEach((choice) => {
    choice.addEventListener('click', choiceClick);
  });
  window.scrollTo(0, 0);
}
//
//////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////

function showQuestion() {
  // const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[0];
  question.innerHTML = currentQuestion.question;

  choices.forEach((choice) => {
    const number = choice.dataset['number'];
    choice.innerHTML = currentQuestion['choice' + number];
  });
  availableQuestions.splice(0, 1);
  console.log(availableQuestions);
}

submitBtn.addEventListener('click', answerValidation);
nextBtn.addEventListener('click', setNextQuestion);
