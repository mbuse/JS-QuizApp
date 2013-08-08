quizApp.current.implementation = {
  styles: [ 'css/pictures.css' ],
  html: [
    '<h1>Pictures</h1>',
    '<p id="pictures-question"></p>',
    '<div id="pictures-pane"></div>',
    '<hr class="clear" />',
    '<div id="buttons" style="display:none">',
      '<button onclick="quizApp.retry()">Retry</button>',
      '<button onclick="quizApp.next()">Continue</button>',
    '</div>'
  ],

  init: function(data) {
    var question = document.getElementById("pictures-question");
    var picturesPane = document.getElementById("pictures-pane");

    var _grayoutPictures = function(index, picUrl) {
      var pic = document.getElementById("pictures-pic"+index);

      if (index != data.correctAnswer) {
        var shade = document.createElement("div");
        shade.setAttribute("class", "pictures-grayshade");
        pic.appendChild(shade);
        pic.onclick = undefined;
        pic = shade;
      }

      pic.onclick = quizApp.next;

      if (data.showSolutions && data.solutions) {
        var hint = document.createElement("div");
        hint.setAttribute("class", "pictures-solution");
        hint.innerHTML = data.solutions[index];
        pic.appendChild(hint);
      }
    };

    var _success = function() {
      data.pictures.forEachIndexed(_grayoutPictures);

      document.getElementById("buttons").removeAttribute("style");
    };

    var _failure = function() {
      alert("Incorrect Answer, try again...");
    };

    var _addPicture = function(index, pictureUrl) {
      var pic = document.createElement("div");
      pic.setAttribute("id", "pictures-pic"+index);
      pic.setAttribute("class", "pictures-pic");
      pic.setAttribute("style", "background-image:url('"+pictureUrl+"')");
      pic.onclick =  function() {
        if (index == data.correctAnswer) {
          _success();
        }
        else {
          _failure();
        }
      }
      picturesPane.appendChild(pic);
    };

    question.innerHTML = data.question;

    data.pictures.forEachIndexed(_addPicture);
  }


}