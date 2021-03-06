var exerciseTypes = {

}

quizApp = {
  quizzes: [],
  start: function() {
    if (quizApp.quizzes.length>0) {
      quizApp_loadAndInitQuiz(0);
    }
    else {
      alert("No Exercises!");
    }
  },
  reporting: {
    start: function() {
      quizApp.reporting.currentReport = {
        quizIndex: quizApp.current.index,
        start: Date.now(),
        end: undefined,
        time: 0,
        tries: 0,
      };
      quizApp.reporting.reports.push(quizApp.reporting.currentReport);
    },
    finish: function() {
      var report = quizApp.reporting.currentReport;
      report.end = Date.now();
      report.time = report.end - report.start;
      report.tries++;
    },
    retry: function() {
      quizApp.reporting.currentReport.tries ++;
    },
    clear: function() {},
    reports: [],
    currentReport: undefined
  },
  next: function() {
    var index = quizApp.current.index + 1;
    if (index == quizApp.quizzes.length) {
      alert("Congratulations, you finished all exercises!");
      return;
    }
    quizApp_loadAndInitQuiz(index);
  },
  reload: function() {
    quizApp_initExercise();
  },
  _currentExerciseUrl: function() {
    return quizApp.quizzes[quizApp.current.index];
  },
  current : {
    implementation: undefined,
    data: undefined,
    index: -1
  },
  baseUrl : "",
  implementations: { },
  cache: {
    styles: {},
    datas: {},
    implementations: {}
  },
  defaults: {
    loading: {
      maxRetry: 50,
      retryInterval: 100
    }
  }
}

function quizApp_loadAndInitQuiz(index) {
  if (index >= 0 && index < quizApp.quizzes.length) {
    var dataUrl = quizApp.quizzes[index];
    quizApp.current.index = index;
    quizApp.current.data = quizApp.cache.datas[dataUrl];
    quizApp_loadLibrary(
      dataUrl,
      function() {
        quizApp.cache.datas[dataUrl] = quizApp.current.data;
        quizApp_initExercise();
      },
      function() {
        return quizApp.current.data;
      });
    return true;
  } else {
    console.log("quizApp_loadAndInitQuiz() - no quiz with index=" + index);
    return false;
  }
}

function quizApp_initExercise(data) {
  if (!data) {
    data = quizApp.current.data;
  }
  quizApp_clearWorkbench();
  var type = data.type;
  quizApp.current.implementation = quizApp.cache.implementations[type];
  if (!quizApp.current.implementation) {
    var implementationUrl = quizApp.implementations[type];
    if (implementationUrl) {
      quizApp_loadLibrary(implementationUrl);
    } else {
      alert("No Such Exercise Implementation for type: " + type);
      return;
    }
  }

  //exerciseType.libraries.forEach( _loadLibrary );
  quizApp_invokeWhenConditionApplies(
      function() {
        var config = quizApp.current.implementation;
        var html = config.html;
        var workbench = document.getElementById("workbench");
        config.styles.forEach( quizApp_loadCSS );
        workbench.innerHTML = html.join("");
        config.init(data);
        // cache...
        quizApp.cache.implementations[type] = config;
      }, 
      function() { 
        return quizApp.current.implementation;
      });

}

function quizApp_clearWorkbench() {
  var workbench = document.getElementById("workbench");
  workbench.innerHTML = "";
}

function quizApp_loadLibrary(libPath, fun, condition) {
  // don't load the library if the condition is already true...
  if (!condition || !condition()) {
    var fileref=document.createElement('script') ;
    fileref.setAttribute("type","text/javascript");
    fileref.setAttribute("src", quizApp_url(libPath));
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

function quizApp_loadCSS(stylePath, baseUri) {
  var path = (baseUri) ? baseUri + stylePath : stylePath;
  if (!quizApp.cache.styles[path]) {
    var fileref=document.createElement("link");
    fileref.setAttribute("rel", "stylesheet");
    fileref.setAttribute("type", "text/css");
    fileref.setAttribute("href", quizApp_url(path));
    document.getElementsByTagName("head")[0].appendChild(fileref);
    quizApp.cache.styles[path] = true;
  }
}

function quizApp_url(uriPath, baseUrl) {
  if (!baseUrl) {
    baseUrl = quizApp.baseUrl;
  }
  if (quizApp_isAbsoluteUrl(uriPath)) {
    return uriPath; // unchanged...
  }
  return (baseUrl) ? baseUrl + uriPath : uriPath;
}

function quizApp_isAbsoluteUrl(url) {
  return url
      && ( url.indexOf("http://")==0
        || url.indexOf("https://")==0
        || url.indexOf("file:///")==0 );
}

function quizApp_invokeLater(fun) {
  setTimeout(fun, quizApp.defaults.loading.retryInterval);
}

function quizApp_invokeWhenConditionApplies(fun, condition, maxRetries) {
  if (!maxRetries) {
    maxRetries = quizApp.defaults.loading.maxRetry;
  }
  var retry = 0;
  
  var callback = function() {
    retry++;
    if (condition()) {
      fun();
    }
    else {
      if (retry < maxRetries) {
        console.log("quizApp_invokeWhenConditionApplies()retrying ("+retry+" of " + maxRetries + ")");
        setTimeout(callback, quizApp.defaults.loading.retryInterval);
      }
      else {
        console.log("quizApp_invokeWhenConditionApplies() tried " + retry + " times without success... retry cancelled.");
      }
    }
  }
  callback();
}

function quizApp_stopEventBubbling(e) {
 var evt = e ? e:window.event;
 if (evt.stopPropagation)    evt.stopPropagation();
 if (evt.cancelBubble!=null) evt.cancelBubble = true;
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


// IE 9 Fixes...
if (!window.console) {
  console = {
    warn : function(){},
    error : function(){},
    time : function(){},
    timeEnd : function(){}
  };
}
