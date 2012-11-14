StacheTrack.Views.applicationView = Backbone.View.extend({
  events: {
    
  },
  circles: undefined,
  initialize: function() {
    
    $('#mustacheMolder').fadeOut();
    $("#starter").click(function() 
    {
        $('#loadStache').fadeOut(300, function()
        {
          App.init();
        });

        $('#starter').fadeOut(300);
        
        
    });

  },
  addWebCam: function()
  {
    $(App.canvas).fadeIn(800);
    $('#takePicture').fadeIn(300);
    
    $('#takePicture').click(function() 
    {
      StacheTrack.Views.AppView.findMustacheImage();
    });

    
  },
  findMustacheImage: function() {
    $('#imageHolder').fadeOut(0);
    var canvasImage = App.convertCanvasToImage();
    $('#imageHolder').append(canvasImage);
    $('#imageHolder').fadeIn(500);
    StacheTrack.Views.AppView.createMolder(); 
    $('#mustacheMolder').fadeIn(500);
    App.stream.stop();
    $('#takePicture').fadeOut(400, function() 
    {
      $('#getPoints').fadeIn(400, function() 
      {
        $('#getPoints').click(function()    
        {
          StacheTrack.Views.AppView.analyzePoints(); 
        });
      });
    });
    


  },
  createMolder: function()
  {

      var graphicsDiv=document.getElementById("mustacheMolder");
      var gr = new jxGraphics(graphicsDiv);
      var pen = new jxPen(new jxColor("black"),1);
      var brushYellow = new jxBrush(new jxColor('yellow'));
      var brushRed = new jxBrush(new jxColor('663300'));

      graphicsDiv.onmousemove = getMouseXY;

      var mouseX = 0, mouseY = 0;

       

      //Mousedown event handler for circle
      function circleMouseDown(evt, obj) {
          drag = true;
          activeCircle = obj;
      }

      //Mouseup event handler for circle
      function circleMouseUp() {
          drag = false;
          activeCircle = null;
      }

      //Predefined curve points
      var curvePoints = [new jxPoint(68, 187), new jxPoint(164, 105), new jxPoint(286, 84), new jxPoint(379, 88), new jxPoint(473, 108), new jxPoint(551, 192), new jxPoint(456, 160), new jxPoint(378, 145), new jxPoint(288, 141), new jxPoint(172, 155)];

      //Draw closed curve
      var curve = new jxClosedCurve(curvePoints, pen, brushRed)
      curve.draw(gr);

      //Draw circles at the curve points
      var circles = new Array(), drag = false, activeCircle;;
      for (var i in curvePoints) {
          var cir = new jxCircle(curvePoints[i], 5, pen, brushYellow);
              cir.draw(gr);
              cir.addEventListener('mousedown', circleMouseDown);
              cir.addEventListener('mouseup', circleMouseUp);
              circles[i] = cir;
          }

      StacheTrack.Views.AppView.circles = circles;

      //Check mouse position and redraw curve/circles
      function getMouseXY(e) {

        if (document.all) //For IE
        {
          mouseX = event.clientX + document.body.parentElement.scrollLeft;
          mouseY = event.clientY + document.body.parentElement.scrollTop;
        } else { 
          mouseX = e.pageX
          mouseY = e.pageY
        }  

        if (mouseX < 0){mouseX = 0}
        if (mouseY < 0){mouseY = 0}  
        
        mouseX = mouseX - $(graphicsDiv).offset().left;
        mouseY = mouseY - $(graphicsDiv).offset().top;
        
        //Redraw the curve with the changed point
        if (drag) {
            if (activeCircle) {
                activeCircle.center = new jxPoint(mouseX, mouseY);
                activeCircle.draw(gr);
                var curvePoints = new Array(); 
                for (var i in circles) {
                    curvePoints[i] = circles[i].center;
                }
                curve.points = curvePoints;
                curve.draw(gr); 
            }
        }
        return true;
      }

  }, 
  analyzePoints: function()    
  {

    var maxY = 0;
    var maxX = 0;
    var minY = 1000;
    var minX = 1000;
    

    var dots = StacheTrack.Views.AppView.circles;
    for(var i=0;i<dots.length;i++)   
    {
      maxY = Math.max( maxY, dots[i].center.y);
      minY = Math.min( minY, dots[i].center.y);
      maxX = Math.max( maxX, dots[i].center.x);
      minX = Math.min( minX, dots[i].center.x);
      
    }

    var height = maxX - minX;
    var width = maxY - minY;
    var ratio = Math.round(width/height*1000)/1000;


  }

});