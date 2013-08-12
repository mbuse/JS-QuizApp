quizApp.current.implementation = {
  styles:[ 'css/facebookTest.css' ],
  html:[
    '<h1 id="facebookTest-title">Facebook API Test</h1>',
    '<div id="fb-root">',
    '</div>',
    '<div id="facebookTest-friends"></div>',
    '<hr class="clear" />',
    '<div id="buttons">',
      '<button id="facebookTest-continue" onclick="quizApp.next()">Continue</button>',
    '</div>'
  ],
  friendsTemplate: '<div class="facebookTest-friend"><img src="{pictureUrl}"><p>{name}</p></div>',
  init:function (data) {
    this._set("title", data.title);
    var that = this;
    window.fbAsyncInit = function () {
      // init the FB JS SDK
      FB.init({
        appId: data.appId,
        channelUrl:data.channelUrl,
        status:data.status,
        xfbml:data.xfbml
      });

      // Additional initialization code such as adding Event Listeners goes here
      that.doIt(data);
    };

    // Load the SDK asynchronously
    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/" + data.locale + "/all.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

  },
  doIt:function(data) {
    var that = this;
    FB.login(function(response) {
       if (response.authResponse) {
         console.log('Welcome!  Fetching your information.... ');
         FB.api('/me/friends?fields=name,picture.width(100).height(100)', that._showFriends);
       } else {
         console.log('User cancelled login or did not fully authorize.');
       }
     });
  },
  _showFriends: function(response) {
    var that = quizApp.current.implementation; // funny, facebook looses scope 'this'...
    response.data.forEach(function(data) {
      var div = document.createElement("div");
      var html = that.friendsTemplate;
      html = html.replace("{name}", data.name);
      html = html.replace("{pictureUrl}", data.picture.data.url);
      div.innerHTML = html;
      var container = document.getElementById("facebookTest-friends");
      container.appendChild(div);
    });
  },
  _set:function (id, text) {
    if (text) {
      document.getElementById("facebookTest-" + id).innerHTML = text;
    }
  }
}
