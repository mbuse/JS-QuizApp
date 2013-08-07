/**
 * Created with IntelliJ IDEA.
 * User: mbuse
 * Date: 06.08.13
 * Time: 10:14
 * To change this template use File | Settings | File Templates.
 */
quizApp.quizTypes['multipleChoice'].config = {
  styles: [ 'css/multipleChoice.css' ],
  html: [
    '<h1>Multiple Choice</h1>',
    '<div id="multipleChoice-question"></div>',
    '<div id="multipleChoice-answers">',
    '</div>',
    '<div id="buttons">',
      '<button onclick="quizApp.retry()">Clear</button>',
      '<button onclick="multipleChoice_submit()">Submit</button>',
    '</div>'
  ],
  init: multipleChoice_init
}

function multipleChoice_init(data) {
  var questionDiv = document.getElementById("multipleChoice-question");

  questionDiv.innerHTML = data.question;
  data.answers.forEachIndexed(multipleChoice_addAnswer)
}

function multipleChoice_addAnswer(index, answer) {
  var answersDiv  = document.getElementById("multipleChoice-answers");
  var inputType = (quizApp.current.data.multiple) ? "checkbox" : "radio";

  var input = document.createElement("input");
  input.setAttribute("type", inputType);
  input.setAttribute("name", "answers");
  input.setAttribute("value", index);
  answersDiv.appendChild(input);

  var span = document.createElement("span");
  span.innerHTML = answer;
  answersDiv.appendChild(span);

  answersDiv.appendChild(document.createElement("br"));
}

function multipleChoice_getSelection() {
  var answersDiv = document.getElementById("multipleChoice-answers");
  var inputs = answersDiv.getElementsByTagName("input");
  var selection = new Array();
  for (var i = 0; i < inputs.length; i++) {
    if (inputs[i].checked) {
      selection.push(inputs[i].getAttribute("value"));
    }
  }
  return selection.join(",");
}
function multipleChoice_submit() {
  var selection = multipleChoice_getSelection();
  var solution = quizApp.current.data.solution;

  if (selection == solution) {
    alert("Correct!");
    quizApp.next();
  }
  else {
    alert("Incorrect, try again!");
  }
}