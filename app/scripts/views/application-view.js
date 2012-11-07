StacheTrack.Views.applicationView = Backbone.View.extend({

});

$('#converter').click(function() {
    $('#imageHolder').fadeOut(0);
    var canvasImage = App.convertCanvasToImage();
    $('#imageHolder').append(canvasImage);
    $('#imageHolder').fadeIn(500);
  });
