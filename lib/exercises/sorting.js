/**
 * Created with IntelliJ IDEA.
 * User: mbuse
 * Date: 11.08.13
 * Time: 11:49
 * To change this template use File | Settings | File Templates.
 */

quizApp.current.implementation = {
  styles:[ 'css/sorting.css' ],
  html:[
    '<h1 id="sorting-title">Sorting</h1>',
    '<p id="sorting-text">Sort the following words:</p>',
    '<div id="sorting-words"></div>',
    '<div id="sorting-collections"></div>',
    '<div id="buttons">',
    '<button onclick="quizApp.reload()">Clear</button>',
    '<button id="sorting-submit" disabled="disabled">Submit</button>',
    '</div>'
  ],
  init:function (data) {
    this._set("title", data.title);
    this._set("text", data.text);
    this._prepareCollections(data);
    this._prepareWords(data);
    var that = this;
    document.getElementById("sorting-submit").onclick = function() {
      that._submit(data);
    }
    quizApp.reporting.start();
  },
  _submit: function(data) {
    var collections = document.getElementById("sorting-collections").children;
    var success = true;
    for (var i=0; i<collections.length; i++) {
      var collection = collections[i];
      var wordDivs = collection.getElementsByTagName("div");
      for (var k=0; k<wordDivs.length; k++) {
        var wordDiv = wordDivs[k];
        var word = wordDiv.innerHTML;
        if (data.words[i].indexOf(word)>=0) {
          wordDiv.setAttribute("class", "sorting-word sorting-correct");
        }
        else {
          wordDiv.setAttribute("class", "sorting-word sorting-wrong");
          success = false;
        }
      }
    }

    if (success) {
      quizApp.reporting.finish();
      alert("Correct");
      quizApp.next();
    } else {
      quizApp.reporting.retry();
      alert("Not Correct, try again...");
    }

  },
  _prepareWords: function(data) {
    var words = new Array();
    var container = document.getElementById("sorting-words");
    var that = this;
    data.words.forEach(function(anotherArray) {
      anotherArray.forEach(function(word) {
        words.push(word);
      });
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
  _prepareCollections: function(data) {
    var container = document.getElementById("sorting-collections");
    var that = this;
    data.collections.forEachIndexed(function(index, title) {
      var collection = document.createElement("div");
      collection.setAttribute("id", "sorting-collection--" + index);
      collection.setAttribute("class", "sorting-collection");
      collection.ondragover = that._dragOver;
      collection.ondragenter = that._dragEnter;
      collection.ondrop = function(evt) { return that._drop(evt, collection) };
      var collectionTitle = document.createElement("h2");
      var clear = document.createElement("hr");
      clear.setAttribute("class", "clear");
      collectionTitle.innerHTML = title;
      collection.appendChild(collectionTitle);
      collection.appendChild(clear);
      container.appendChild(collection);
    });
  },
  _createWord: function(word) {
    var div = document.createElement("div");
    div.setAttribute("class", "sorting-word");
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
  _dragEnter:function (ev) {
    ev.preventDefault();
    return true;
  },
  _dragOver:function (ev) {
    return false;
  },
  _drop:function (evt, container) {

    evt.stopPropagation();
    var srcId = evt.dataTransfer.getData("Text");
    var word = document.getElementById(srcId);
    var clear = container.getElementsByTagName("hr");
    if (clear.length > 0) {
      container.insertBefore(word, clear[0]);
    } else {
      container.appendChild(word);
    }
    word.setAttribute("class", "sorting-word");
    this._checkSubmitButtonState();
    return false;
  },
  _checkSubmitButtonState:function() {
    var sortingWords = document.getElementById("sorting-words");
    var submitButton = document.getElementById("sorting-submit");
    if (sortingWords.getElementsByTagName("div").length>0) {
      submitButton.setAttribute("disabled", "disabled");
    } else {
      submitButton.removeAttribute("disabled");
    }
  },
  _set:function (id, text) {
    if (text) {
      document.getElementById("sorting-" + id).innerHTML = text;
    }
  }
}