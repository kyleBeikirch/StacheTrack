var Mixer = {
  channels: {},
  numChannels: 0,
  channelsToRender: undefined,
  setup: function(audioFiles) {
    var that = this
    $.each(audioFiles, function(i, audioData){
      audioData.randomTrack = Math.floor(Math.random()*audioData.numTracks) + 1;
      var channel= new Mixer.Channel(audioData);
      $('body').append(channel.render());
      that.channels[audioData.id] = channel;
      that.numChannels = that.numChannels + 1;
    });
    
    return Mixer.channels;
    
  },
  Channel: function(audioData) {
      
    
    var audioTmpl = '<audio id="mixer-channel-{{id}}" preload="auto"><source src="audio/{{source}}{{randomTrack}}.mp3" type="audio/mpeg"><source src="{{source}}.ogg" type="audio/ogg"></audio><br/>';
    
    this.data = audioData;
    
    this.render = function() {
      this.el = $(Mustache.render(audioTmpl, audioData));
      this.audio = $(this.el)[0];
      return this.el;
    };
    
  },
  init: function(data ) {
    // audio data
    var rockGroup = [{
      id: 'drums',
      source: 'rock_drums',
      numTracks: 3
    },
    {
      id: 'guitar',
      source: 'rock_guitar',
      numTracks: 4
    },
    {
      id: 'bass',
      source: 'rock_bass',
      numTracks: 3
    }];

    var hardRockGroup = [{
      id: 'drums',
      source: 'hrock_drums',
      numTracks: 5
    },
    {
      id: 'guitar',
      source: 'hrock_guitar',
      numTracks: 4
    },
    {
      id: 'bass',
      source: 'hrock_bass',
      numTracks: 5
    }];

    var metalGroup = [{
      id: 'drums',
      source: 'metal_drums',
      numTracks: 3
    },
    {
      id: 'guitar',
      source: 'metal_guitar',
      numTracks: 5
    },
    {
      id: 'bass',
      source: 'metal_bass',
      numTracks: 3
    }];

    var fusionGroup = [{
      id: 'drums',
      source: 'fusion_drums',
      numTracks: 3
    },
    {
      id: 'guitar',
      source: 'fusion_guitar',
      numTracks: 3
    },
    {
      id: 'bass',
      source: 'fusion_bass',
      numTracks: 3
    }];

    var funkGroup = [{
      id: 'drums',
      source: 'funk_drums',
      numTracks: 5
    },
    {
      id: 'guitar',
      source: 'funk_guitar',
      numTracks: 6
    },
    {
      id: 'bass',
      source: 'funk_bass',
      numTracks: 4
    }];

    var acousticGroup = [{
      id: 'drums',
      source: 'acoustic_drums',
      numTracks: 3
    },
    {
      id: 'guitar',
      source: 'acoustic_guitar',
      numTracks: 5
    },
    {
      id: 'bass',
      source: 'acoustic_bass',
      numTracks: 3
    }];
    
    var soundGroup = [];
    if(data.shape > .9)
    {
      soundGroup = funkGroup;
    }
    else if(data.shape > .1)
    {
      soundGroup = fusionGroup;
    }
    else if(data.shape > -.4)
    {
      soundGroup = acousticGroup;
    }
    else if(data.shape > -1.1)
    {
      soundGroup = rockGroup;
    }
    else if(data.shape > -1.4)
    {
      soundGroup = hardRockGroup;
    }
    else
    {
      soundGroup = metalGroup;
    }

    var mixerView = $('#mixer-view');
    var channels = Mixer.setup(soundGroup);
    var i = 0;
    Mixer.lengthMod = data.width / 378;
    Mixer.channelsToRender = [];
    Mixer.channelsToRender.push(channels.guitar);
    if(data.thickness > 40)
    {
      Mixer.channelsToRender.push(channels.drums);
    }
    if(data.thickness > 75)
    {
      Mixer.channelsToRender.push(channels.bass);
    }

   // play all track
    $.each(channels, function(key, channel){
      channel.audio.volume = 0;
    });

    // manually looping cause the loop attrib is inaccurate
    channels.guitar.el.bind('ended', function() {
      $('#playPause').removeClass('pause');
    });
    
    Mixer.updateTimer();
    
  },
  togglePlayer: function()
  {
      var channels = Mixer.channels;
      if(channels.guitar.audio.paused === false)
      {
        // play all track
        $.each(channels, function(key, channel){
          channel.audio.pause();
          $('#playPause').removeClass('pause');
        });
      }
      else
      {
        $.each(channels, function(key, channel){
          channel.audio.play();
          Mixer.updateTimer();
          $('#playPause').addClass('pause');
        });
      }
  },
  updateTimer: function()
  {
    var channels = Mixer.channels;
    var adjustedDuration = channels.guitar.audio.duration * Mixer.lengthMod;
    setTimeout(function()
    {
      StacheTrack.Views.AppView.playWave(channels.guitar.audio.currentTime/ adjustedDuration);
      if(adjustedDuration - channels.guitar.audio.currentTime < .5)
      {
        var timeLeft = (adjustedDuration - channels.guitar.audio.currentTime) *.5;
        Mixer.setVolumes(timeLeft);
      }
      else
      {
        Mixer.setVolumes(.25);
      }
      var current = Mixer.checkSingle(Math.floor(channels.guitar.audio.currentTime));
      var total = Mixer.checkSingle(Math.floor(adjustedDuration));
      $('#timer').html( "0:" + current + " | 0:" + total);

      if(channels.guitar.audio.currentTime < adjustedDuration|| isNaN(adjustedDuration) === true)
      {
        Mixer.updateTimer();
      }

    }, 100);

  },
  checkSingle: function(num)
  {
    if(num < 10)
      {
        return "0" + num;
      }
      else
      {
        return num;
      }
  },
  setVolumes: function( num) 
  {

    $.each(Mixer.channelsToRender, function(i, channel) {
      channel.audio.volume = num;
  
    });
  }

};