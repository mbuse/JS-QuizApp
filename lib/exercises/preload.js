quizApp.current.implementation = {
  styles: [ 'css/preload.css' ],
  html: [
    '<h1 id="preload-title">Loading...</h1>',
    '<p id="preload-text"></p>',
    '<div id="preload-pane">',
      '<p id="preload-message"><span id="preload-currentFile">nothing</span> ',
        '(<span id="preload-currentIndex">0</span> of ',
        '<span id="preload-count">0</span>)',
       '</p>',
       '<div id="preload-progress-bar"><div id="preload-progress"></div></div>',
    '</div>',
    '<div id="buttons">',
      '<button id="preload-continue" disabled="disabled" onclick="quizApp.next()">Continue</button>',
    '</div>'
  ],
  init: function(data) {
    if (data.title) {
      document.getElementById("preload-title").innerHTML = data.title;
    }
    if (data.text) {
      document.getElementById("preload-text").innerHTML = data.text;
    }
    var currentIndex = quizApp.current.index;
    var count = quizApp.quizzes.length - currentIndex;
    document.getElementById("preload-count").innerHTML = ""+count;

    var updateUI = function(index, file) {
      var idx = index - currentIndex;
      document.getElementById("preload-currentIndex").innerHTML = idx;
      var percentage = Math.ceil( 100 * idx / count );
      document.getElementById("preload-progress").setAttribute("style", "width:" + percentage + "%");
      document.getElementById("preload-currentFile").innerHTML = file;
    }

    var loadImpl = function(index, type) {
      var urlPath = quizApp.implementations[type];
      if (urlPath) {
        updateUI(index, urlPath);
        quizApp.current.implementation = quizApp.cache.implementations[type];
        quizApp_loadLibrary(
          urlPath,
          function() {
            quizApp.cache.implementations[type] = quizApp.current.implementation;
            var styles = quizApp.current.implementation.styles;
            if (styles) {
              styles.forEach( quizApp_loadCSS );
            }
          },
          function() { return quizApp.current.implementation }
        );
      } else {
        return;
      }
    };

    var loadData = function(index) {
      if (index >= 0 && index < quizApp.quizzes.length) {
        var dataUrl = quizApp.quizzes[index];
        updateUI(index, dataUrl);
        quizApp.current.index = index;
        quizApp.current.data = quizApp.cache.datas[dataUrl];
        quizApp_loadLibrary(
          dataUrl,
          function() {
            quizApp.cache.datas[dataUrl] = quizApp.current.data;
            var type = quizApp.current.data.type;
            loadImpl(index, type);
            quizApp_invokeWhenConditionApplies(
              function() { loadData(index + 1); },
              function() {
                return quizApp.cache.implementations[type];
              }
            );
          },
          function() {
            return quizApp.current.data;
          });
      } else {
        quizApp.current.index = currentIndex;
        quizApp.current.data = data;
        quizApp.current.implementation = quizApp.cache.implementations[data.type];
        updateUI(quizApp.quizzes.length, "done");
        document.getElementById("preload-continue").removeAttribute("disabled");
      }
    }
    loadData(currentIndex + 1);
  }
}
