/**
 * Created with IntelliJ IDEA.
 * User: mbuse
 * Date: 06.08.13
 * Time: 10:14
 * To change this template use File | Settings | File Templates.
 */
quizApp.quizTypes['wordOrder'].config = {
  styles: [ 'css/wordOrder.css' ],
  html: [
    '<h1>Word Order</h1>',
    '<p>Bring the following words into the correct order:</p>',
    '<div id="wordOrder-material"></div>',
    '<p>Drag the words into the following area and press Submit:</p>',
    '<div id="wordOrder-solution" ondrop="return wordOrder_dragDrop(event, this)"',
        ' ondragover="return wordOrder_dragOver(event, this)"',
        ' ondragenter="return wordOrder_dragEnter(event, this)"></div>',
    '<div id="buttons">',
      '<button onclick="quizApp.retry()">Clear</button>',
      '<button onclick="wordOrder_submit()">Submit</button>',
    '</div>'
  ],
  init: wordOrder_init
}

function wordOrder_config() {
  return quizApp.current.config;
}

function wordOrder_dragStart(ev) {
   ev.dataTransfer.effectAllowed='move';
   ev.dataTransfer.setData("Text", ev.target.getAttribute('id'));
   ev.dataTransfer.setDragImage(ev.target,0,0);
   return true;
}
function wordOrder_dragEnter(ev) {
   event.preventDefault();
   return true;
}
function wordOrder_dragOver(ev) {
    return false;
}
function wordOrder_dragDrop(ev, target) {
   var srcId = ev.dataTransfer.getData("Text");
   var word = document.getElementById(srcId);
   var eventOffsetX = ev.layerX - target.offsetLeft;
   var eventOffsetY = ev.layerY - target.offsetTop;
   ev.stopPropagation();
   var children = target.children;

   var found = false;
   for (var i=0; i< children.length; i++) {
     var childOffsetX = children[i].offsetLeft - target.offsetLeft;
     var childOffsetY = children[i].offsetTop - target.offsetTop;
     var deltaY = eventOffsetY - childOffsetY;
     if ( 0 <= deltaY && deltaY <= children[i].clientHeight ) {
       if (childOffsetX > eventOffsetX) {
         target.insertBefore(word, children[i]);
         found = true;
         break;
       }
     }
   }
   if (!found) {
    target.appendChild(word);
   }

   return false;
}

function wordOrder_init(data) {
  var wordDivs = new Array();
  data.words.forEach(function(word) {
    wordDivs.push(wordOrder_createWordDiv(word));
  });
  if (data.shuffle) {
    wordDivs.shuffle();
  }
  var materialDiv = document.getElementById("wordOrder-material");
  wordDivs.forEach(function(div) {
    materialDiv.appendChild(div);
  });
  var floatBreaker = document.createElement("hr");
  floatBreaker.setAttribute("class", "clear");
  materialDiv.appendChild(floatBreaker);

  var solutionDiv = document.getElementById("wordOrder-solution");
  var height = materialDiv.offsetHeight;
  solutionDiv.style.height = height + "px";
  solutionDiv.setAttribute("style", "height:" + height + "px;" );
}

function wordOrder_createWordDiv(text) {
  var div = document.createElement("div");
  div.setAttribute("class", "word");
  div.setAttribute("draggable", "true");
  div.setAttribute('ondragstart', 'return wordOrder_dragStart(event)');
  div.setAttribute('id', 'wordOrder_' + text + '_' + Math.random() * 100000);
  div.innerHTML = text;
  return div;
}
function wordOrder_submit() {
  var solutionDiv = document.getElementById("wordOrder-solution");
  var words = new Array();
  for (var i=0; i< solutionDiv.children.length; i++) {
    words.push(solutionDiv.children[i].innerHTML);
  }
  var answer = words.join(" ");
  if (answer == quizApp.current.data.solution) {
    alert("Correct");
    quizApp.next();
  }
  else {
    alert("Incorrect. Try Again");
  }
}