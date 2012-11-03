
window.StacheTrack = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  init: function() {
    console.log('Hello from Backbone!');
  }
};

$(document).ready(function(){
  StacheTrack.init();

  $('#fillClosed').click(function() 
    {
      fillClosedCurve();
    });
  var canvasDiv=document.getElementById("imageHolder");
  var gr=new jsGraphics(canvasDiv);
  var penWidth;
  var col;
  var pen;
  var d1,d2;
  var msdiv=document.getElementById("timems");
  setPenColor(true);
    
  var points=new Array();

  var ie=false;

  canvasDiv.onmousemove = getMouseXY;
  canvasDiv.onclick=drawPoint;

  var mouseX = 0;
  var mouseY = 0;

  //Get mouse position
  function getMouseXY(e)
  {
    if (ie) 
    {
      mouseX = event.clientX + document.body.parentElement.scrollLeft;
      mouseY = event.clientY + document.body.parentElement.scrollTop;
    } else { 
      mouseX = e.pageX;
      mouseY = e.pageY;
    }  

    if (mouseX < 0){mouseX = 0}
    if (mouseY < 0){mouseY = 0}  
    
    mouseX =mouseX - canvasDiv.offsetLeft;
    mouseY =mouseY - canvasDiv.offsetTop;

    return true;
  }

  function setPenColor(noAlert)
  {
    col=new jsColor("blue");

    penWidth = 1

    if(!isNaN(penWidth))
      pen=new jsPen(col,penWidth);
    else
      pen=new jsPen(col,5);
      
    if(!noAlert)
    {
      if(points.length==0)
      {
        alert("Please click at any location on the blank canvas at left side to plot the points!");
        return false;
      }
      else if(points.length==1)
      {
        alert("2 or more points are required to draw any curve! Please plot more points by clicking at any location on the blank canvas at left side.");
        return false;
      }
    } 
    return true;
  }

  function drawPoint()
  {
    gr.fillRectangle(new jsColor("green"),new jsPoint(mouseX-6,mouseY-6),6,6);
    points[points.length]=new jsPoint(mouseX-3,mouseY-3);
  }

  function drawCurve()
  {
    if(!setPenColor())
        return;
    var ten=document.getElementById("tension").value;
    d1=(new Date()).getTime();
    gr.drawCurve(pen,points,ten);
    d2=(new Date()).getTime();
    msdiv.innerHTML=(d2-d1);
    showPoints();
    //points=new Array();
  }

  function drawClosedCurve()
  {
    if(!setPenColor())
        return;
    var ten=document.getElementById("tension").value;
    d1=(new Date()).getTime();
    gr.drawClosedCurve(pen,points,ten);
    d2=(new Date()).getTime();
    msdiv.innerHTML=(d2-d1);
    showPoints();
    //points=new Array();
  }

  function drawPolyBezier()
  {
    if(!setPenColor())
        return;
        
      if(points.length==4)
      {
        d1=(new Date()).getTime();
        gr.drawBezier(pen,points);
      } 
      else
      {
          d1=(new Date()).getTime();
      gr.drawPolyBezier(pen,points);
    }
    d2=(new Date()).getTime();
    msdiv.innerHTML=(d2-d1);
      showPoints();
    //points=new Array();
  }

  function fillClosedCurve()
  {
    if(!setPenColor())
        return;
    var ten= 0;
    d1=(new Date()).getTime();
    gr.fillClosedCurve(col,points,ten);
    d2=(new Date()).getTime();
    msdiv.innerHTML=(d2-d1);
    showPoints();
    //points=new Array();
  }

  function clearCanvas()
  {
    gr.clear();
    points=new Array();
  }

  function clearPreviousPoints()
  {
    points=new Array();
  }

  function CheckTension()
  {
      var ten=document.getElementById("tension").value;
      if(!isNaN(ten))
      {
        if(ten>10)
          document.getElementById("tension").value=10;
        else if(ten<-10)
          document.getElementById("tension").value=-10;
      }
  }

  function showPoints()
  {
    var txt=document.getElementById("txt");
    txt.innerHTML="";
    for(var i=0;i<points.length;i++)
    {
      txt.innerHTML=txt.innerHTML + "new jsPoint(" + points[i].x + "," + points[i].y + "),";
    }
  }


});


