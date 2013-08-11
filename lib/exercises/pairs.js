/**
 * Created with IntelliJ IDEA.
 * User: mbuse
 * Date: 11.08.13
 * Time: 11:49
 * To change this template use File | Settings | File Templates.
 */

quizApp.current.implementation = {
  styles:[ 'css/pairs.css' ],
  html:[
    '<h1 id="pairs-title">Sorting</h1>',
    '<p id="pairs-text">Sort the following words:</p>',
    '<div id="pairs-words"></div>',
    '<div id="pairs-containers"></div>',
    '<div id="buttons">',
    '<button onclick="quizApp.reload()">Clear</button>',
    '<button id="pairs-submit" disabled="disabled">Submit</button>',
    '</div>'
  ],
  init:function (data) {
    this._set("title", data.title);
    this._set("text", data.text);
    this._prepareContainers(data);
    this._prepareWords(data);
    var that = this;
    document.getElementById("pairs-submit").onclick = function() {
      that._submit(data);
    }
    quizApp.reporting.start();
  },
  _submit: function(data) {
    var solution = new Array();
    data.pairs.forEach(function(pair) {
      solution.push(pair[0], pair[1]);
    });
    // iterate containers...
    var success = true;
    for (var i=0; i< this.containers.length; i = i+2) {
      var leftContainer = this.containers[i];
      var rightContainer = this.containers[i+1];
      var leftWord = this._findWordInContainer(leftContainer);
      var rightWord = this._findWordInContainer(rightContainer);
      // find pair in solutions...
      var leftIndex = solution.indexOf(leftWord);
      var rightIndex = (leftIndex%2 == 0) ? leftIndex + 1 : leftIndex - 1;

      if (rightWord == solution[rightIndex]) {
        // right!!!
        leftContainer.setAttribute("class", "pairs-target pairs-correct");
        rightContainer.setAttribute("class", "pairs-target pairs-correct");
      }
      else {
        // wrong...
        leftContainer.setAttribute("class", "pairs-target pairs-wrong");
        rightContainer.setAttribute("class", "pairs-target pairs-wrong");
        success = false;
      }
    }
    if (success) {
      quizApp.reporting.finish();
      alert("Correct!");
      quizApp.next();
    }
    else {
      quizApp.reporting.retry();
      alert("Incorrect, try again...");
    }
  },
  _findWordInContainer: function(container) {
    var wordDivs = container.getElementsByTagName("div");
    return (wordDivs.length>0) ? wordDivs[0].innerHTML : null;
  },
  _prepareWords: function(data) {
    var words = new Array();
    var container = document.getElementById("pairs-words");
    var that = this;
    data.pairs.forEach(function(pair) {
      words.push(pair[0], pair[1]);
    });
    words.shuffle();
    words.forEach(function(word) {
      var div = that._createWord(word);
      container.appendChild(div);
    });
    var clear = document.createElement("hr");
    clear.setAttribute("class", "clear");
    container.appendChild(clear);
  },
  _prepareContainers: function(data) {
    this.containers = new Array();
    var parent = document.getElementById("pairs-containers");
    var that = this;
    data.pairs.forEachIndexed(function(index, pair) {
      var pairContainer = that._createDiv(null, "pairs-container", parent);
      var pairContainerLeft = that._createDiv(null, "pairs-container-left", pairContainer);
      var pairContainerRight = that._createDiv(null, "pairs-container-right", pairContainer);
      var pairTargetLeft = that._createDiv("pairs-target-left-" + index, "pairs-target", pairContainerLeft);
      var pairTargetRight = that._createDiv("pairs-target-right-" + index, "pairs-target", pairContainerRight);
      that._registerDropHandlers(pairTargetLeft);
      that._registerDropHandlers(pairTargetRight);
      that.containers.push(pairTargetLeft, pairTargetRight);
    });
  },
  _registerDropHandlers: function(div) {
    var that = this;
    div.ondragenter = function(evt) {
      return that._dragEnter(evt, div);
    }
    div.ondragover  = this._dragOver;
    div.ondrop = function(evt) {
      return that._drop(evt, div);
    }
  },
  _createWord: function(word) {
    var div = document.createElement("div");
    div.setAttribute("class", "pairs-word");
    div.setAttribute("draggable", "true");
    div.setAttribute('id', 'wordOrder_' + word + '_' + Math.random() * 100000);
    div.ondragstart = this._dragStart;
    div.innerHTML = word;
    return div;
  },
  _dragStart:function (ev) {
    ev.dataTransfer.effectAllowed = 'move';
    ev.dataTransfer.setData("Text", ev.target.getAttribute('id'));
    ev.dataTransfer.setDragImage(ev.target, 0, 0);
    return true;
  },
  _dragEnter:function (ev, container) {
    if (container.getElementByTagName("div").length==0) {
      ev.preventDefault();
      return true;
    } else {
      return false;
    }
  },
  _dragOver:function (ev) {
    return false;
  },
  _drop:function (evt, container) {
    evt.stopPropagation();
    var srcId = evt.dataTransfer.getData("Text");
    var word = document.getElementById(srcId);
    container.appendChild(word);
    word.setAttribute("class", "pairs-word");
    this._checkSubmitButtonState();
    this._changeDropTargetStyle(container);
    return false;
  },
  _changeDropTargetStyle:function(target) {
    var index = this.containers.indexOf(target);
    var otherIndex = (index%2==0) ? index+1 : index-1;
    this.containers[index].setAttribute("class", "pairs-target");
    this.containers[otherIndex].setAttribute("class", "pairs-target");
  },
  _checkSubmitButtonState:function() {
    var sortingWords = document.getElementById("pairs-words");
    var submitButton = document.getElementById("pairs-submit");
    if (sortingWords.getElementsByTagName("div").length>0) {
      submitButton.setAttribute("disabled", "disabled");
    } else {
      submitButton.removeAttribute("disabled");
    }
  },
  _createDiv:function(id, cls, parent) {
    var div = document.createElement("div");
    if (id) {
      div.setAttribute("id", id);
    }
    if (cls) {
      div.setAttribute("class", cls);
    }
    if (parent) {
      parent.appendChild(div);
    }
    return div;
  },
  _set:function (id, text) {
    if (text) {
      document.getElementById("pairs-" + id).innerHTML = text;
    }
  }
}