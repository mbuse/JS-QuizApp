var exerciseTypes = {

}

quizApp = {
  quizzes: [],
  start: function() {
    if (quizApp.quizzes.length>0) {
      quizApp.current.index = 0;
      quizApp_loadLibrary(
          quizApp._currentExerciseUrl(), 
          quizApp_initExercise, 
          function() {
            return quizApp.current.data; 
          });
    }
    else {
      alert("No Exercises!");
    }
  },
  next: function() {
    quizApp.current.index++;
    if (quizApp.current.index == quizApp.quizzes.length) {
      alert("Congratulations, you finished all exercises!");
      return;
    }
    quizApp_loadLibrary(quizApp._currentExerciseUrl(), quizApp_initExercise);
  },
  retry: function() {
    quizApp_initExercise();
  },
  _currentExerciseUrl: function() {
    return quizApp.quizzes[quizApp.current.index];
  },
  current : {
    config: undefined,
    data: undefined,
    index: -1
  },
  quizTypes: {
    'wordOrder': {  lib: "lib/exercises/wordOrder.js"  },
    'multipleChoice': { lib: "lib/exercises/multipleChoice.js" }
  }
}



function quizApp_initExercise(data) {
  if (!data) {
    data = quizApp.current.data;
  }
  quizApp_clearWorkbench();
  var type = data.type;
  var descriptor = quizApp.quizTypes[type];
  if (descriptor && descriptor.lib) {
    if (!descriptor.config) {
      quizApp_loadLibrary(descriptor.lib);
    }
  }
  else {
    alert("No Such Exercise Type: " + type);
    return;
  }
  //exerciseType.libraries.forEach( _loadLibrary );
  quizApp_invokeLater(function() {
    var config = quizApp.quizTypes[type].config;
    var html = config.html;
    var workbench = document.getElementById("workbench");
    config.styles.forEach( quizApp_loadCSS );
    workbench.innerHTML = html.join("");
    config.init(data);
    quizApp.current.config = config;
    quizApp.current.data = data;
  });

}

function quizApp_clearWorkbench() {
  var workbench = document.getElementById("workbench");
  workbench.innerHTML = "";
}

function quizApp_loadLibrary(libPath, fun, condition) {
  var fileref=document.createElement('script') ;
  fileref.setAttribute("type","text/javascript");
  fileref.setAttribute("src", libPath);
  if (typeof fileref!="undefined") {
    document.getElementsByTagName("head")[0].appendChild(fileref);
  }
  if (fun) {
    if (condition) {
      quizApp_invokeWhenConditionApplies(fun, condition);
    } else {
      quizApp_invokeLater(fun);
    }
  }
}

function quizApp_loadCSS(stylePath) {
  var fileref=document.createElement("link");
  fileref.setAttribute("rel", "stylesheet");
  fileref.setAttribute("type", "text/css");
  fileref.setAttribute("href", stylePath);
  if (typeof fileref!="undefined")
    document.getElementsByTagName("head")[0].appendChild(fileref);
}

function quizApp_invokeLater(fun) {
  setTimeout(fun, 100);
}

function quizApp_invokeWhenConditionApplies(fun, condition, maxRetries) {
  if (!maxRetries) {
    maxRetries = 10;
  }
  var retry = 0;
  
  var callback = function() {
    retry++;
    if (condition()) {
      fun();
    }
    else {
      if (retry < r) {
        setTimeOut(callback, 10);
      }
      else {
        console.log("quizApp_invokeWhenConditionApplies() tried " + retry + " times without success... retry cancelled.");
      }
    }
  }
  callback();
}

function quizApp_arrayShuffle(){
  var tmp, rand;
  for(var i =0; i < this.length; i++){
    rand = Math.floor(Math.random() * this.length);
    tmp = this[i];
    this[i] = this[rand];
    this[rand] =tmp;
  }
}

function quizApp_forEachIndexed(functionWithIndex) {
  for (var i=0; i<this.length; i++) {
    functionWithIndex(i, this[i]);
  }
}

Array.prototype.shuffle =quizApp_arrayShuffle;
Array.prototype.forEachIndexed = quizApp_forEachIndexed;
