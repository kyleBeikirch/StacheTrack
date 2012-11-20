
var App = {
    imageData: undefined,
    imageDataURI: undefined,
    deepLink: false,
    start: function(stream) {
        App.stream = stream;
        App.video.addEventListener('canplay', function() {
            App.video.removeEventListener('canplay');
            setTimeout(function() {
                App.video.play();
                StacheTrack.Views.AppView.addWebCam();
                App.canvas.width = 533;
                App.canvas.height = 400;
                App.backCanvas.width = 133;
                App.backCanvas.height = 100;
                App.backContext = App.backCanvas.getContext('2d');
            
                var w = 300 / 4 * 0.8,
                    h = 270 / 4 * 0.8;
            
                App.comp = [{
                    x: (App.video.videoWidth / 4 - w) / 2,
                    y: (App.video.videoHeight / 4 - h) / 2,
                    width: w, 
                    height: h,
                }];
            
                App.drawToCanvas();
            }, 500);
        }, true);
        
        var domURL = window.URL || window.webkitURL;
        App.video.src = domURL ? domURL.createObjectURL(stream) : stream;
    },
    restart: function() {
        App.running = "yes";
        App.glasses.src = 'images/glasses.png';
        App.drawToCanvas();
    },
    denied: function() {
        console.log('Camera access denied!<br>Please reload and try again.');
    },
    error: function(e) {
        if (e) {
            console.error(e);
        }
        console.log('Please go to about:flags in Google Chrome and enable the &quot;MediaStream&quot; flag.');
    },
    drawToCanvas: function() {

        if(App.running !== "no")
        {
            requestAnimationFrame(App.drawToCanvas);
        
            var video = App.video,
                ctx = App.context,
                backCtx = App.backContext,
                m = 4,
                w = 4,
                s = 1.1,
                i,
                comp;
            
                ctx.drawImage(video, 0, 0, App.canvas.width, App.canvas.height);
            
            
            backCtx.drawImage(video, 0, 0, App.backCanvas.width, App.backCanvas.height);
            
            comp = ccv.detect_objects(App.ccv = App.ccv || {
                canvas: App.backCanvas,
                cascade: cascade,
                interval: 4,
                min_neighbors: 1
            });
            
            if (comp.length) {
                App.comp = comp;
            }
            

            for (i = App.comp.length; i--; ) {
                
                ctx.drawImage(App.glasses, (App.comp[i].x - w / 2) * m - 20, (App.comp[i].y - w / 2) * m - 45, (App.comp[i].width + w) * m * s, (App.comp[i].height + w) * m * s);
                if(App.running === "last")
                {
                    App.videoScale = (App.comp[i].height + w) * m;
                    App.videoCenterX = ((App.comp[i].x - w / 2) * m) + 40;
                    App.videoCenterY = ((App.comp[i].y - w / 2) * m) + 75;
                }
            }

        }        
    },
    convertCanvasToImage: function() {

        App.glasses.src = 'images/clear.gif';
        App.running = "last";
        setTimeout(function() 
        {
            var image = new Image();
            var canvas = App.canvas;
            App.imageData = canvas.toDataURL("image/png");
            image.src = App.imageData;
            StacheTrack.Views.AppView.setMustacheImage( image );
            App.running = "no";
            App.imageDataURI = canvas.toDataURL("image/png");

        }, 100);
        
    }
};
App.videoScale = 0;
App.videoCenterX = 0;
App.videoCenterY = 0;
App.running = "yes";
App.glasses = new Image();
App.glasses.src = 'images/glasses.png';

App.init = function() {
    App.video = document.createElement('video');
    App.backCanvas = document.createElement('canvas');
    App.canvas = document.querySelector('#output');
    $(App.canvas).fadeOut();
    App.context = App.canvas.getContext('2d');
    App.info = document.querySelector('#info');
    
    navigator.getUserMedia_ = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    
    try {
        navigator.getUserMedia_({
            video: true,
            audio: false
        }, App.start, App.denied);
    } catch (e) {
        try {
            navigator.getUserMedia_('video', App.start, App.denied);
        } catch (e) {
            App.error(e);
        }
    }
    
    App.video.loop = App.video.muted = true;
    App.video.load();
};