StacheTrack.Views.applicationView = Backbone.View.extend({
  events: {
    
  },
  initialize: function() {
    
    $('#mustacheMolder').fadeOut();
    $("#starter").click(function() 
    {
        $('#loadStache').fadeOut(300, function()
        {
          App.init();
        });

        $('#starter').fadeOut(300, function()
        {
          $('#takePicture').fadeIn(300);
          $('#takePicture').click(function() {
              StacheTrack.Views.AppView.findMustacheImage();
          });
        });
        
        
    });

  },
  findMustacheImage: function() {
    $('#imageHolder').fadeOut(0);
    var canvasImage = App.convertCanvasToImage();
    $('#imageHolder').append(canvasImage);
    $('#imageHolder').fadeIn(500);
    $('#mustacheMolder').fadeIn(500);
  }

});