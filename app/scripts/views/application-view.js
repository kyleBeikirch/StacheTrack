StacheTrack.Views.applicationView = Backbone.View.extend({

});
$('#mustacheMolder').fadeOut();
$('#converter').click(function() {
    $('#imageHolder').fadeOut(0);
    var canvasImage = App.convertCanvasToImage();
    $('#imageHolder').append(canvasImage);
    $('#imageHolder').fadeIn(500);
    $('#mustacheMolder').fadeIn(500);
  });
