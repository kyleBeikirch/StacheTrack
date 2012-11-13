
window.StacheTrack = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  init: function() {
    console.log("Main init");
    // init views
    this.Views = {
      AppView: new StacheTrack.Views.applicationView()
    },
    
    // init router
    this.Routers = {
      PageRouter: new StacheTrack.Routers.ApplicationRouter()
    };
    
    var that = this;
    
    // this.Routers.PageRouter.dateUpdated(function() {
    //   that.onDateUpdated();
    // });
    
    // Backbone.history.start();
  }
};

// requestAnimationFrame shim
      
(function() {     
  var i = 0,
  lastTime = 0,
  vendors = ['ms', 'moz', 'webkit', 'o'];
  
  while (i < vendors.length && !window.requestAnimationFrame) {
    
    window.requestAnimationFrame = window[vendors[i] + 'RequestAnimationFrame'];
    i++;
  }
  
  if (!window.requestAnimationFrame) {
    
    window.requestAnimationFrame = function(callback, element) {
    
      var currTime = new Date().getTime(),
      timeToCall = Math.max(0, 1000 / 60 - currTime + lastTime),
      id = setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);

      lastTime = currTime + timeToCall;
    
      return id;
    };
  }
      
}());

$(document).ready(function(){
  
  StacheTrack.init();
  var graphicsDiv=document.getElementById("mustacheMolder");
  var gr = new jxGraphics(graphicsDiv);
  var pen = new jxPen(new jxColor("black"),1);
  var brushYellow = new jxBrush(new jxColor('yellow'));
  var brushRed = new jxBrush(new jxColor('663300'));

  graphicsDiv.onmousemove = getMouseXY;

  var mouseX = 0, mouseY = 0;

   $('#fillClosed').click(function()    
    {
      showPoints(); 
    });

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
    
    mouseX =mouseX - graphicsDiv.offsetLeft;
    mouseY = mouseY - graphicsDiv.offsetTop;
    
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

  function showPoints()    
  {

    var maxY = 0;
    var maxX = 0;
    var minY = 1000;
    var minX = 1000;

    var txt=document.getElementById("txt");   
    txt.innerHTML="";
     
    for(var i=0;i<circles.length;i++)   
    {
      maxY = Math.max( maxY, circles[i].center.y);
      minY = Math.min( minY, circles[i].center.y);
      maxX = Math.max( maxX, circles[i].center.x);
      minX = Math.min( minX, circles[i].center.x);
      
    }

    var height = maxX - minX;
    var width = maxY - minY;
    var ratio = Math.round(width/height*1000)/1000;

    txt.innerHTML= "MaxY: " + maxY + ", MinY: " + minY + ", MaxX: " + maxX + ", MinX: " + minX + ", height: " + height + ", width: " + width + ", ratio: " + ratio;


  }
});


