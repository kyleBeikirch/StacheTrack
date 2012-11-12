StacheTrack.Views.applicationView = Backbone.View.extend({
  events: {
    
  },
  initialize: function() {
    
    $('#mustacheMolder').fadeOut();
    $("#starter").click(function() 
    {
        App.init();
    });

  },
  dosomething: function() {
    $('#imageHolder').fadeOut(0);
    var canvasImage = App.convertCanvasToImage();
    $('#imageHolder').append(canvasImage);
    $('#imageHolder').fadeIn(500);
    $('#mustacheMolder').fadeIn(500);
  }

});