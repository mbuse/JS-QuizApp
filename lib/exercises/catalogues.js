
quizApp.current.implementation = {
  styles:[ 'css/catalogues.css' ],
  html:[
    '<h1 id="catalogues-title">Catalogues</h1>',
    '<p id="catalogues-text">Select one of the following catalogues:</p>',
    '<div id="catalogues-pane">',
      '<select id="catalogues-selector">"',
        '<option name="null">Nothing</option>',
      '</select>',
      '<div id="catalogues-ownCatalogue">',
        '<p id="catalogues-ownCatalogue-text">Alternatively enter your catalogue URL here:</p>',
        '<input id="catalogue-ownCatalogue-field" type="input" size="50" />',
      '</div>',
    '</div>',
    '<div id="buttons">',
    '<button onclick="quizApp.reload()">Clear</button>',
    '<button id="catalogues-load">Load</button>',
    '</div>'
  ],
  init:function (data) {
    this._set("title", data.title);
    this._set("text", data.text);
    data.quizzes.forEach( this._addOption.bind(this) );
    document.getElementById("catalogues-load").onclick = this.load.bind(this);
  },
  load:function () {
    var url = this._getCatalogueUrl();
    if (url=="null") {
      return true;
    }
    url = quizApp_url(url);
    quizApp.current.catalogue = null;
    quizApp_loadLibrary(url,
      function() {
        this._catalogueLoaded(url);
      }.bind(this),
      function() {
        return quizApp.current.catalogue;
      });
  },
  _getCatalogueUrl: function() {
    var catalogueUrlField = document.getElementById("catalogue-ownCatalogue-field");
    var url = catalogueUrlField.value;
    if (url && url.length>0) {
      return url;
    } else {
      return this._getSelector().value;
    }
  },
  _catalogueLoaded: function(url) {
    var catalogue = quizApp.current.catalogue;
    var baseUrl = this._getBaseUrl(url, catalogue);
    // add quizzes...
    catalogue.quizzes.forEach(function(quiz) {
      var quizUrl = quizApp_url(quiz, baseUrl);
      quizApp.quizzes.push(quizUrl);
    });

    quizApp.next();

  },
  _getBaseUrl: function(url, cat) {
    var index = url.lastIndexOf("/");
    var catalogueUrl = this._folderUrl((index<0) ? "" : url.substring(0, index) + "/");
    var catalogueBaseUrl = this._folderUrl(cat.baseUrl);
    if (catalogueBaseUrl) {
      if (quizApp_isAbsoluteUrl(catalogueBaseUrl)) {
        return catalogueBaseUrl;
      }
      return catalogueUrl + catalogueBaseUrl;
    }
    return catalogueUrl;
  },
  _folderUrl: function(url) {
    if (url && url.length>=1) {
      return (url.charAt(url.length-1)=="/") ? url : url + "/";
    }
    return url;
  },
  _set:function (id, text) {
    if (text) {
      document.getElementById("catalogues-" + id).innerHTML = text;
    }
  },
  _addOption: function(opt) {
    var select = this._getSelector();
    var option = document.createElement("option");
    option.setAttribute("value", opt.url);
    option.innerHTML = opt.name;
    select.appendChild(option);
  },
  _getSelector: function() {
    return document.getElementById("catalogues-selector");
  }
}