/**
 * Created with IntelliJ IDEA.
 * User: mbuse
 * Date: 06.08.13
 * Time: 10:14
 * To change this template use File | Settings | File Templates.
 */
quizApp.current.implementation = {
  styles: [ 'css/wordOrder.css' ],
  html: [
    '<h1>Word Order</h1>',
    '<p id="wordOrder-text">Bring the following words into the correct order.</p>',
    '<div id="wordOrder-material"></div>',
    '<div id="wordOrder-solution" ondrop="return wordOrder_dragDrop(event, this)"',
        ' ondragover="return wordOrder_dragOver(event, this)"',
        ' ondragenter="return wordOrder_dragEnter(event, this)"></div>',
    '<div id="buttons">',
      '<button onclick="quizApp.reload()">Clear</button>',
      '<button onclick="wordOrder_submit()">Submit</button>',
    '</div>'
  ],
  init: wordOrder_init
}

function wordOrder_config() {
  return quizApp.current.implementation;
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
  if (data.text) {
    document.getElementById("wordOrder-text").innerHTML = data.text;
  }
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
  quizApp.reporting.start();
}

function wordOrder_createWordDiv(text) {
  var div = document.createElement("div");
  div.setAttribute("class", "word");
  div.setAttribute("draggable", "true");
  div.setAttribute('ondragstart', 'return wordOrder_dragStart(event)');

  if (text.charAt(0)=='~') {
    div.setAttribute("class", div.getAttribute("class") + " connect-left");
    text = text.substring(1);
  }
  if (text.charAt(text.length-1)=='~') {
    div.setAttribute("class", div.getAttribute("class") + " connect-right");
    text = text.substring(0, text.length-1);
  }
  div.setAttribute('id', 'wordOrder_' + text + '_' + Math.random() * 100000);
  div.innerHTML = text;
  return div;
}
function wordOrder_submit() {
  var solutionDiv = document.getElementById("wordOrder-solution");
  var words = " ";
  for (var i=0; i< solutionDiv.children.length; i++) {
    var div = solutionDiv.children[i];
    var w = div.innerHTML;
    if (div.getAttribute("class").indexOf("connect-left")>=0
      && words.charAt(words.length-1)==' ') {
      words = words.substring(0, words.length-1);
    }
    words = words + w;
    if (div.getAttribute("class").indexOf("connect-right")==-1) {
      words = words + " ";
    }
  }

  var answer = words.trim();
  if (answer == quizApp.current.data.solution) {
    quizApp.reporting.finish();
    alert("Correct");
    quizApp.next();
  }
  else {
    quizApp.reporting.retry();
    alert("Incorrect. Try Again");
  }
}