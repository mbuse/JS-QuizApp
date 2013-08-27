quizApp.current.implementation = {
  styles: [ 'css/youtube.css' ],
  html: [
    '<h1 id="youtube-title">YouTube.com</h1>',
    '<div id="youtube-pane">',
      '<iframe id="youtube-frame" width="480" height="360" src="#" frameborder="0" allowfullscreen>',
      '</iframe>',
    '</div>',
    '<div id="youtube-text"></div>',
    '<hr class="clear" />',
    '<div id="buttons">',
      '<button onclick="quizApp.next()">Continue</button>',
    '</div>'
  ],

  init: function(data) {
    var frame = document.getElementById("youtube-frame");
    frame.setAttribute("src", "https://www.youtube.com/embed/" + data.movieId);
    if (data.title) {
      var title = document.getElementById("youtube-title");
      title.innerHTML = data.title;
    }
    if (data.text) {
      var textpane = document.getElementById("youtube-text");
      var appendParagraph = function(t) {
        var paragraph = document.createElement("p");
        paragraph.innerHTML = t;
        textpane.appendChild(paragraph);
      }
      if (data.text.constructor === Array) {
        data.text.forEach(appendParagraph);
      }
      else if (typeof data.text === 'string') {
        appendParagraph(data.text);
      }
    }
  }
}
