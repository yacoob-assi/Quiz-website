// var category;
// var questionsNum;
// var optionsNum;

var currentQuesNum = 0;
var questionsInfo;
var mark = 0;
var countInterval;
let categoryEle = document.querySelector(".category");
let questonsNumEle = document.querySelector(".questionsNum");
let button = document.querySelector("button");
let currentQues = document.querySelector(".currentQuestion");
let timeEle = document.querySelector("footer > span");
let optionsBox = document.querySelector(".options");
let questionText = document.querySelector("h2");
let footer = document.querySelector("footer");
let body = document.querySelector(".quizBody");

fetch(
  "https://quizapi.io/api/v1/questions?apiKey=otHpP2Q4azz0xcFniA7MnS4WoYrcvJKRUjTgr8AH&limit=20"
)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    questionsInfo = data;

    setCategory(questionsInfo[currentQuesNum].category);
    setQuestionsNum(questionsInfo.length);
    setQuestion();
    addOptions();
    addfooterSpans(questionsInfo.length);
    countDown(5);
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

function setCategory(category) {
  categoryEle.innerHTML = category;
}

function setQuestion() {
  questionText.innerHTML = questionsInfo[currentQuesNum].question;
}

function addOptions() {
  const currentQuestionAnswers = questionsInfo[currentQuesNum].answers;

  optionsBox.innerHTML = "";

  for (let key in currentQuestionAnswers) {
    if (currentQuestionAnswers[key]) {
      let option = document.createElement("div");
      option.innerHTML = `<div> 
      <input type="radio" id="${key}" name="${currentQuesNum}">
      <label for="${key}">${currentQuestionAnswers[key]}</label>
      </div>`;

      optionsBox.appendChild(option);
    }
  }
}

function setQuestionsNum(num) {
  questonsNumEle.innerHTML = num;
}

function addfooterSpans(num) {
  for (let i = 0; i < num; i++) {
    let span = document.createElement("span");
    currentQues.appendChild(span);
  }
}

function setCurrentSpan(num, addClass = "currentSpan") {
  document
    .querySelector(`.currentQuestion span:nth-child(${num})`)
    .classList.add(addClass);
}

function Mark() {
  var correctAnswer = 0;
  var checked = 0;
  const correctAnswers = questionsInfo[currentQuesNum].correct_answers;
  const radios = document.querySelectorAll('input[type="radio"]');

  for (let key in correctAnswers)
    if (correctAnswers[key] !== "true") correctAnswer++;
    else break;

  for (let i = 0; i < radios.length; i++)
    if (!radios[i].checked) checked++;
    else break;

  if (checked === radios.length)
    setCurrentSpan(currentQuesNum + 1, "notAnswered");
  else {
    setCurrentSpan(currentQuesNum + 1);
    if (checked === correctAnswer) mark++;
  }
}

function getMark() {
  footer.remove();
  optionsBox.remove();
  questionText.remove();
  var result;
  var resultClass;
  if (mark === questionsInfo.length) {
    resultClass = "excellent";
    result = "Perfect";
  } else if (mark >= questionsInfo.length * 0.9) result = "Excellent";
  else if (
    mark >= 0.8 * questionsInfo.length &&
    mark < 0.9 * questionsInfo.length
  ) {
    resultClass = "excellent";
    result = "Very Good";
  } else if (
    mark >= 0.7 * questionsInfo.length &&
    mark < 0.8 * questionsInfo.length
  ) {
    result = "Good";
    resultClass = "excellent";
  } else {
    result = "Bad";
    resultClass = "bad";
  }

  body.innerHTML = `${result} : ${mark}`;
  body.className = resultClass;
}

function nextQues() {
  clearInterval(countInterval);
  Mark();
  currentQuesNum++;
  if (currentQuesNum === questionsInfo.length) {
    getMark();
    return;
  }
  setCategory(questionsInfo[currentQuesNum].category);

  setQuestion();
  addOptions();
  countDown(5);
}

function countDown(period) {
  let minutes, seconds;
  countInterval = setInterval(function () {
    minutes = Number.parseInt(period / 60);
    seconds = Number.parseInt(period % 60);
    timeEle.innerHTML = `${minutes}:${seconds}`;
    if (--period < 0) {
      clearInterval(countInterval);
      button.click();
    }
  }, 1000);
}
button.addEventListener("click", nextQues);
button.innerHTML = "Submit answer";
