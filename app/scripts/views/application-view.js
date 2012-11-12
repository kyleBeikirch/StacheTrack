StacheTrack.Views.applicationView = Backbone.View.extend({
  events: {
    "click #converter": "dosomething",
  },
  initialize: function() {
    
    $('#mustacheMolder').fadeOut();

  },
  dosomething: function() {
    $('#imageHolder').fadeOut(0);
    var canvasImage = App.convertCanvasToImage();
    $('#imageHolder').append(canvasImage);
    $('#imageHolder').fadeIn(500);
    $('#mustacheMolder').fadeIn(500);
  }

});