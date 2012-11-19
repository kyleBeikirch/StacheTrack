StacheTrack.Views.applicationView = Backbone.View.extend({
  circles: undefined,
  initialize: function() {
    
    $('#mustacheMolder').fadeOut();
    $("#starter").click(function() 
    {
        $('#loadStache').fadeOut(300, function()
        {
          App.init();
          $('#pictureViewer').addClass('ready');
        });
        $('#starter').fadeOut(300);
        $('#amp').fadeOut(300);
        
        
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
    App.convertCanvasToImage();
    
  },
  setMustacheImage: function ( canvasImage)
  {
    var scale = 7 - ((App.videoScale-100)/30);
    canvasImage.onload = function() 
    {
      

      var offsetLeft = Math.round(App.videoCenterX * -scale) + "px";
      var offsetTop = Math.round(App.videoCenterY * -scale) + "px";
      $('#imageHolder').html(canvasImage);
      canvasImage.width = 533;
      $(canvasImage).animate({"left" : offsetLeft, "top" : offsetTop, width: canvasImage.width * scale}, 1200);
      $('#imageHolder').fadeIn(500);
      $('#takePicture').fadeOut(400);
      $('#acceptImage, #retakePic').fadeIn(400);
      

      $('#retakePic').click(function() 
      {
        App.restart();
        $('#acceptImage, #retakePic, #imageHolder').fadeOut(400, function()
          {
            $('#imageHolder').html('');
          });
        $('#takePicture').fadeIn(400);

      });

      $('#acceptImage').click(function() {
          StacheTrack.Views.AppView.createMolder(); 
          $('#mustacheMolder').fadeIn(500);
          App.stream.stop();
          $('#retakePic').fadeOut(400);
          $('#acceptImage').fadeOut(400, function() 
          {
            $('#getPoints').fadeIn(400, function() 
            {
              $('#getPoints').click(function()    
              {
                StacheTrack.Views.AppView.analyzePoints();
                StacheTrack.Views.AppView.drawWave();
                
              });
            });
          });
      });
      
    }
    
  },
  createMolder: function()
  {

      var graphicsDiv=document.getElementById("mustacheMolder");
      var gr = new jxGraphics(graphicsDiv);
      var pen = new jxPen(new jxColor("black"), 2);
      var brushBlack = new jxBrush(new jxColor('black'));


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
      var curvePoints = [new jxPoint(68, 287), new jxPoint(164, 205), new jxPoint(286, 184), new jxPoint(379, 188), new jxPoint(473, 208), new jxPoint(551, 292), new jxPoint(456, 260), new jxPoint(378, 245), new jxPoint(288, 241), new jxPoint(172, 255)];

      //Draw closed curve
      var curve = new jxClosedCurve(curvePoints, pen, brushBlack)
      curve.draw(gr);

      $('path').attr('fill-opacity', 0);

      //Draw circles at the curve points
      var circles = new Array(), drag = false, activeCircle;;
      for (var i in curvePoints) {
          var cir = new jxCircle(curvePoints[i], 4, pen, brushBlack);
              cir.draw(gr);
              cir.addEventListener('mousedown', circleMouseDown);
              cir.addEventListener('mouseup', circleMouseUp);
              circles[i] = cir;
          }
      $('circle').mousedown(function() {
        $(this).attr("r",  8);
        $(this).attr("fill",  "white");
        $(this).attr("stroke",  "white");

      });
      $('circle').mouseup(function() {
        $(this).attr("r",  4);
        $(this).attr("fill",  "black");
        $(this).attr("stroke",  "black");
      });

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
    var centerY = (dots[2].center.y + dots[8].center.y + dots[3].center.y + dots[7].center.y)/4;
    var endsY = (dots[0].center.y + dots[5].center.y) / 2;
    var mustacheData = {};
    mustacheData.height = maxX - minX;
    mustacheData.width = maxY - minY;
    mustacheData.ratio = Math.round(mustacheData.width/mustacheData.height*1000)/1000;
    mustacheData.thickness = -((dots[2].center.y - dots[8].center.y) + (dots[3].center.y - dots[7].center.y))/2;
    mustacheData.shape = (centerY - endsY) / mustacheData.thickness;

    Mixer.init(mustacheData);


  },
  drawWave: function() 
  {
    var graphicsDiv=document.getElementById("mustacheWave");
    var gr = new jxGraphics(graphicsDiv);
    var pen = new jxPen(new jxColor("#333"),1);
    var lineObject = new Array();
    var path = $('path')[0];
    var pathLength = Math.round(path.getTotalLength());
    for( var i=0; i < pathLength; i++)
    {
      var pt = path.getPointAtLength(i);
      var xVert = Math.floor(pt.x);
      var yVert = Math.floor(pt.y);

      if(lineObject[xVert] === undefined)
      {
        lineObject[xVert] = yVert;
      }
      else
      {
          var randOff1 = Math.floor(Math.random() * 40 - 20);
          var randOff2 = Math.floor(Math.random() * 40 - 20);
          var line = new jxLine(new jxPoint(xVert, yVert + randOff1), new jxPoint(xVert, lineObject[xVert] + randOff2), pen);
          line.draw(gr);
      }
      
    }

    $('div#mustacheWave line').tsort({attr:'x1'});
    $('line').each(function(indexInArray)
    {
        setTimeout( function () {
          var currentLine = $('line')[indexInArray];
          $(currentLine).attr( "stroke", "#ff007e");
        }, indexInArray * 25);
});
    $('path').fadeOut(500);
    $('circle').fadeOut(500);
  }

});