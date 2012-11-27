StacheTrack.Views.applicationView = Backbone.View.extend({
  circles: undefined,
  deepLinkPoints: [],
  initialize: function() {

     setTimeout(function() 
      {
        $('#loadStache').css('background-size', '1280px 800px');
      }, 800);

     $('.stacheButton').hover(
      function () {

        if(!$(this).hasClass('inactive'))
        {
          if($(this).hasClass('left'))
          {
            $(this).find('.arrow').css('padding-right', '17px');
          }
          else if($(this).hasClass('small'))
          {
            $(this).find('.arrow').css('padding-left', '13px');
          }
          else
          {
            $(this).find('.arrow').css('padding-left', '17px');
          }
        }
        
      }, 
      function () {
        if($(this).hasClass('left'))
        {
          $(this).find('.arrow').css('padding-right', '7px');
        }
        else
        {
          $(this).find('.arrow').css('padding-left', '7px');
        }
      }
    );
    
    $("#starter").click(function() 
    {
        _gaq.push(['_trackEvent', 'view', 'startApp']);
        $('#loadStache').fadeOut(300, function()
        {
          if(App.running === false)
          {
            App.init();
          }
          else
          {
            StacheTrack.Views.AppView.addWebCam();
          }
          
          $('#pictureViewer').addClass('ready');
        });
        $('#starter').fadeOut(300);
        $('#amp').fadeOut(300);
        $('hr').fadeOut(300);

        $('#retakePic').bind('click.startFromBegin', function() 
        {
         
          $(App.canvas).fadeOut(500, function() {
            $('#pictureViewer').removeClass('ready');
            $('#loadStache').fadeIn(300);
            $('#starter').fadeIn(300);
            $('#amp').fadeIn(300);
            $('hr').fadeIn(300);

          });
          $('#takePicture').fadeOut(300);
          $('#acceptImage, #retakePic').fadeOut(400);

        });
   
    });

    $('#aboutLink').click(function() 
    {
        _gaq.push(['_trackEvent', 'view', 'aboutPage']);

        $('#whyPage').fadeIn(600);
        $('#contentArea').fadeOut(600);
    });

    $('#closeAbout').click(function() 
    {
        $('#whyPage').fadeOut(600);
        $('#contentArea').fadeIn(600);
    });

    var el = $('input[type=text], textarea');
    el.focus(function(e) {
        if (e.target.value == e.target.defaultValue)
            e.target.value = '';
    });
    el.blur(function(e) {
        if (e.target.value == '')
            e.target.value = e.target.defaultValue;
    });

    function getParameterByName(name)
    {
      name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
      var regexS = "[\\?&]" + name + "=([^&#]*)";
      var regex = new RegExp(regexS);
      var results = regex.exec(window.location.search);
      if(results == null)
        return "";
      else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    var quickStart = getParameterByName('quickStart');
    var deepLinkID = getParameterByName('uid');

    if(quickStart === "true")
    {
      $('#loadStache').fadeOut(0, function()
        {
          App.init();
          $('#pictureViewer').addClass('ready');
        });
    }
    else if(deepLinkID !== "")
    {
        _gaq.push(['_trackEvent', 'view', 'fromDeepLink']);

        App.deepLink = true;
        $('#loadStache').fadeOut(0);
        $('hr').fadeOut(0);
        $.post("http://stachetrack.com/api/getData.php?id=" + deepLinkID,
        { 

        },
        function(data){
            var fields = data.split('$$');
            var pointString = fields[0];
            StacheTrack.Views.AppView.deepLinkPoints = pointString.split(',');
            var url = fields[1];
            $('#yourSongName').html(fields[2]);
            $('#yourName').html(fields[3]);
            Mixer.deepLinkSongs = fields[4].split(',');
            var image = new Image();
            image.src = url;
            StacheTrack.Views.AppView.createMolder();

            StacheTrack.Views.AppView.setMustacheImage( image );
        });
        // setTimeout(function()
        // {
        //   var data = "76,295,90,120,230,170,300,190,365,265,290,235,200,230,110,235,$$../uploads/1353395908813.png$$Stache Track$$Unknown User$$3,1,1";
        //   var fields = data.split('$$');
        //     var pointString = fields[0];
        //     StacheTrack.Views.AppView.deepLinkPoints = pointString.split(',');
        //     var url = fields[1];
        //     $('#yourSongName').html(fields[2]);
        //     $('#yourName').html(fields[3]);
        //     Mixer.deepLinkSongs = fields[4].split(',');
        //     var image = new Image();
        //     StacheTrack.Views.AppView.createMolder();
        //     setTimeout(function(){
        //         image.src = url;
        //         StacheTrack.Views.AppView.setMustacheImage( image );
        //     }, 100);
            
        // }, 100);
    }
    else
    {
      
      var nAgt = navigator.userAgent;
      var fullVersion  = ''+parseFloat(navigator.appVersion); 
      var majorVersion = parseInt(navigator.appVersion,10);
      var nameOffset,verOffset,ix;

      setTimeout(function()
      {
        if ((verOffset=nAgt.indexOf("Chrome"))!=-1) 
        {
           fullVersion = nAgt.substring(verOffset+7);
           majorVersion = parseInt(''+fullVersion,10);
           if(majorVersion > 20)
           {
              $('#amp, #starter').fadeIn(500);
           }
           else
           {

            StacheTrack.Views.AppView.showChrome();
           }
        }

        else
        {
          StacheTrack.Views.AppView.showChrome();
        }

      }, 10);
     
    }


  },
  showChrome: function()
  {
      $('#chromePage').fadeIn(600);
      $('#contentArea').fadeOut(600);
  },
  addWebCam: function()
  {
    _gaq.push(['_trackEvent', 'view', 'allowWebcam']);
    $(App.canvas).fadeIn(800);
    $('#takePicture').fadeIn(300);
    $('#acceptImage, #retakePic').fadeIn(400);
    $('#takePicture').click(function() 
    {
      $('#retakePic').unbind('click.startFromBegin');
      StacheTrack.Views.AppView.findMustacheImage();
      $('#acceptImage').removeClass('inactive');
      $('#acceptImage img').attr('src', 'images/bigArrowRight.png');
    });

    
  },
  findMustacheImage: function() {
    $('#imageHolder').fadeOut(0);
    App.convertCanvasToImage();
    _gaq.push(['_trackEvent', 'view', 'takePicture']);
    
  },
  setMustacheImage: function ( canvasImage)
  {
    var scale = 6 - ((App.videoScale-100)/30);
    canvasImage.onload = function() 
    {
      
      
      $('#takePicture').fadeOut(400, function() 
        {
          if(App.deepLink !== true)
          {
            $('#redoPicture').fadeIn(400);
          }
          
        });
      

      $('#redoPicture').click(function() 
      {
        App.restart();
        $('#acceptImage').addClass('inactive');
        $('#acceptImage img').attr('src', 'images/bigArrowRightGray.png');
        $('#redoPicture, #imageHolder').fadeOut(400, function()
          {
            $('#imageHolder').html('');
            $('#takePicture').fadeIn(400);

          });

      });

      $('#retakePic').unbind('click.startFromBegin');
      $('#retakePic').bind('click.retakePhoto', function() 
        {
          App.restart();
          $('#acceptImage').addClass('inactive');
          $('#acceptImage img').attr('src', 'images/bigArrowRightGray.png');
          $('#redoPicture, #imageHolder').fadeOut(400, function()
            {
              $('#imageHolder').html('');
              $('#takePicture').fadeIn(400);
            });

        });

      if(App.deepLink === true)
      {
        $('#yourPic').html($(canvasImage).clone());
        $('#yourPic img').css({width: 172});
        $('#mustacheMolder').fadeIn(0);
        $('#yourInfo').css('top', '-100px');
        StacheTrack.Views.AppView.analyzePoints();
        StacheTrack.Views.AppView.drawWave();
        //StacheTrack.Views.AppView.finalView();
        $('#startOver').hide();
        $('#makeOwn').show();
      }

      $('#acceptImage').click(function() {
          if($('#acceptImage').hasClass('getPoints') === false)
          {
            _gaq.push(['_trackEvent', 'view', 'acceptPicture']);
            var canvasImage2 = canvasImage;
            var offsetLeft = Math.round(App.videoCenterX * -scale) + "px";
            var offsetTop = Math.round(App.videoCenterY * -scale) + "px";
            $('#imageHolder').html(canvasImage);
            $('#yourPic').html($(canvasImage).clone());
            $('#formPic').html($(canvasImage).clone());
            canvasImage.width = 533;
            offsetLeft = "-" + Math.max(-1 * parseInt(offsetLeft), canvasImage.width * -scale - 390) + "px";
            offsetTop = "-" + Math.min(-1*parseInt(offsetTop), canvasImage.width * scale * .75 - 386) + "px";
            $(canvasImage).animate({"left" : offsetLeft, "top" : offsetTop, width: canvasImage.width * scale}, 1200);
            $('#yourPic img').css({ width: 172});
            $('#formPic img').css({ width: 80}); 
            $('#imageHolder').fadeIn(500);
            if($(this).hasClass('inactive') === false)
            {
              $('#retakePic').unbind('click.retakePhoto');
              $('#retakePic').addClass('inactive');
              $('#retakePic img').attr('src', 'images/bigArrowLeftGray.png');
              StacheTrack.Views.AppView.createMolder(); 
              $('#mustacheMolder').fadeIn(500);
              App.stream.stop();
              
              $('#redoPicture').fadeOut(400, function() 
              {
                  $('#adjust, #nameForm').fadeIn(400);
                  $('#acceptImage').addClass('getPoints');
                  $('.getPoints').click(function()    
                  {

                    StacheTrack.Views.AppView.analyzePoints();
                    StacheTrack.Views.AppView.drawWave();

                  });
              });
            }
          }
        
          
      });
      
    }
    
  },
  createMolder: function()
  {

      var graphicsDiv=document.getElementById("mustacheMolder");
      var gr = new jxGraphics(graphicsDiv);
      var pen = new jxPen(new jxColor("#ff007e"), 2);
      var brushBlack = new jxBrush(new jxColor('#ff007e'));


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
      var curvePoints;
      //Predefined curve points
      if(App.deepLink === true)
      {
          var refPoints = StacheTrack.Views.AppView.deepLinkPoints;
          curvePoints = [new jxPoint(refPoints[0], refPoints[1]), new jxPoint(refPoints[2], refPoints[3]), new jxPoint(refPoints[4], refPoints[5]), new jxPoint(refPoints[6], refPoints[7]), new jxPoint(refPoints[8], refPoints[9]), new jxPoint(refPoints[10], refPoints[11]), new jxPoint(refPoints[12], refPoints[13]), new jxPoint(refPoints[14], refPoints[15])];
      }
      else
      {
         curvePoints = [new jxPoint(35, 265), new jxPoint(100, 190), new jxPoint(200, 170), new jxPoint(300, 190), new jxPoint(365, 265), new jxPoint(290, 235), new jxPoint(200, 230), new jxPoint(110, 235)];
      }
     

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

    var centerY = (parseInt(dots[2].center.y) + parseInt(dots[6].center.y))/2; 
    var endsY = (parseInt(dots[0].center.y) + parseInt(dots[4].center.y)) / 2;
    var mustacheData = {};
    mustacheData.height = maxY - minY;
    mustacheData.width = maxX - minX;
    mustacheData.ratio = Math.round(mustacheData.width/mustacheData.height*1000)/1000;
    mustacheData.thickness = -(dots[2].center.y - dots[6].center.y);
    mustacheData.shape = (centerY - endsY) / mustacheData.thickness;

    Mixer.init(mustacheData);
    _gaq.push(['_trackEvent', 'view', 'completeMustache']);

  },
  drawWave: function() 
  {
    if(App.deepLink !== true)
    {
      $('#analyzing').fadeIn(400);
    }
    
    $('canvas').fadeOut();
    $('#acceptImage, #retakePic, #imageHolder, #adjust, #nameForm').fadeOut(400, function() 
    {
      $('#pictureViewer').css("background", "none");
      
    });
    var graphicsDiv=document.getElementById("mustacheWave");
    var gr = new jxGraphics(graphicsDiv);
    var pen = new jxPen(new jxColor("#333"),0);
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
    $('div#mustacheWave line').attr( "stroke-width", "0");

    var lineLength = $('line').length;
    var delayLength = 5;
    var totalTime = lineLength * delayLength;
    if(App.deepLink === true)
    {
      delayLength = 0;
    }

    var count = 0
    delayedLoop();
    function delayedLoop ()
    {
      setTimeout(function() 
      {
        var currentLine = $('line')[count];
        $(currentLine).attr( "stroke-width", "1");
        count++;
        if(count <= lineLength)
        {
          delayedLoop();
        }
        else
        {
          StacheTrack.Views.AppView.finalView();
        }
      }, delayLength); 
    }

    var phraseCount = 0;
    var phraseLength = 5;
    var loopLength = totalTime / (phraseLength-2);
    phraseLoop();
    function phraseLoop ()
    {
      for( var i = 0; i < phraseLength; i++)
      {
        var currentPhrase = $('#analyzing img')[i];
        if(i === phraseCount)
        {
          $(currentPhrase).css( "display", "block");
        }
        else
        {
          $(currentPhrase).css( "display", "none");
        }
      }

      
      phraseCount++;
      if(phraseCount < phraseLength)
      {
        setTimeout(function() 
        {
          phraseLoop();
        }, loopLength);
      } 
    }
       
    
    $('path').fadeOut(500);
    $('circle').fadeOut(500);
  },
  playWave: function(percent)
  {
      var lineLength = $('line').length;
      var highlightedLines = Math.round(lineLength * percent);

      for(var i =0; i <= highlightedLines; i++)
      {
        var currentLine = $('line')[i];
        $(currentLine).attr( "stroke", "#ff007e");
      }
      for(var j = lineLength; j > highlightedLines; j--)
      {
        var currentLine = $('line')[j];
        $(currentLine).attr( "stroke", "#333");
      }
  },
  finalView: function()
  {
    if(App.deepLink !== true)
    {
          if($('#trackField').val() === "Enter your track name")
          {
              $('#yourSongName').html("Stache Track");
          }
          else
          {
            $('#yourSongName').html($('#trackField').val());
          }
          if($('#nameField').val() === "Enter your name")
          {
            $('#yourName').html("Unknown User");
          }
          else
          {
            $('#yourName').html($('#nameField').val());
          }
          
          
    }

    $("#analyzing").fadeOut(400, function() 
    {
        if(App.deepLink !== true)
        {
          $('#startOver').fadeIn(500);
        }
        $('#yourInfo').fadeIn(500);
    });

    
      

    $('#startOver, #makeOwn').click(function() 
      {
          window.location.href = window.location.pathname;
      });

    $('#playPause').click(function() 
    {  
      _gaq.push(['_trackEvent', 'view', 'playSong']);  
      Mixer.togglePlayer();
    });


    var dots = StacheTrack.Views.AppView.circles;
    var pointString = '';
    for(var i=0;i<dots.length;i++)   
    {
      pointString += (dots[i].center.x + "," + dots[i].center.y + ",");       
    }

    var songs = Mixer.songsPlayed.toString();
    var d = new Date();
    var n = d.getTime();
    var trackName = $('#yourSongName').html();
    var userName = $('#yourName').html();
    $.post("http://stachetrack.com/api/sendData.php?points=" + pointString + "&track=" + trackName + "&user=" + userName + "&time="+ n + "&songs=" + songs,
    { 
        src: App.imageDataURI
    },
    function(data){
        var testData = [];
        testData.UID = data;
        var template = $('#shareTemplate').html();
        var html = Mustache.to_html(template, testData);
        $('#shareBubble').html(html);
    });
    
    $('#export').hover(
      function () {
        $('#shareBubble').fadeIn(400);
      }, 
      function () {
        $('#shareBubble').fadeOut(400);
      }
    );
    
  }

});