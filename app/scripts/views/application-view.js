StacheTrack.Views.applicationView = Backbone.View.extend({

});

$('#converter').click(function() {
    console.log('clicked');
    var canvasImage = App.convertCanvasToImage();
    $('#imageHolder').append(canvasImage);
  });
