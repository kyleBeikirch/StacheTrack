var Mixer = {
  channels: {},
  numChannels: 0,
  channelsToRender: undefined,
  setup: function(audioFiles) {
    var that = this
    $.each(audioFiles, function(i, audioData){
      var channel= new Mixer.Channel(audioData);
      $('body').append(channel.render());
      that.channels[audioData.id] = channel;
      that.numChannels = that.numChannels + 1;
    });
    
    return Mixer.channels;
    
  },
  Channel: function(audioData) {
      
    var audioTmpl = '<audio id="mixer-channel-{{id}}" preload="auto"><source src="{{source}}.mp3" type="audio/mpeg"><source src="{{source}}.ogg" type="audio/ogg"></audio><br/>';
    
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
      source: 'audio/sets/rock-drum'
    },
    {
      id: 'guitar',
      source: 'audio/sets/rock-lead-0'
    },
    {
      id: 'other',
      source: 'audio/sets/rock-misc-0'
    }];

    var industrialGroup = [{
      id: 'drums',
      source: 'audio/sets/industrial-drum'
    },
    {
      id: 'guitar',
      source: 'audio/sets/industrial-lead-0'
    },
    {
      id: 'other',
      source: 'audio/sets/industrial-misc-0'
    }];

    var jazzGroup = [{
      id: 'drums',
      source: 'audio/sets/jazz-drum'
    },
    {
      id: 'guitar',
      source: 'audio/sets/jazz-lead-0'
    },
    {
      id: 'other',
      source: 'audio/sets/jazz-misc-0'
    }];

    var modernGroup = [{
      id: 'drums',
      source: 'audio/sets/modern-drum'
    },
    {
      id: 'guitar',
      source: 'audio/sets/modern-lead-0'
    },
    {
      id: 'other',
      source: 'audio/sets/modern-misc-0'
    }];

    var tranceGroup = [{
      id: 'drums',
      source: 'audio/sets/trance-drum'
    },
    {
      id: 'guitar',
      source: 'audio/sets/trance-lead-0'
    },
    {
      id: 'other',
      source: 'audio/sets/trance-misc-0'
    }];

    var discoGroup = [{
      id: 'drums',
      source: 'audio/sets/disco-drum'
    },
    {
      id: 'guitar',
      source: 'audio/sets/disco-lead-0'
    },
    {
      id: 'other',
      source: 'audio/sets/disco-misc-0'
    }];

    var acousticGroup = [{
      id: 'drums',
      source: 'audio/sets/acoustic-drum'
    },
    {
      id: 'guitar',
      source: 'audio/sets/acoustic-lead-0'
    },
    {
      id: 'other',
      source: 'audio/sets/acoustic-misc-0'
    }];
    
    var soundGroup = [];
    if(data.shape > 1.5)
    {
      soundGroup = acousticGroup;
    }
    else if(data.shape > 1)
    {
      soundGroup = rockGroup;
    }
    else if(data.shape > .5)
    {
      soundGroup = discoGroup;
    }
    else if(data.shape > 0)
    {
      soundGroup = tranceGroup;
    }
    else if(data.shape > -.5)
    {
      soundGroup = modernGroup;
    }
    else if(data.shape > -1)
    {
      soundGroup = industrialGroup;
    }
    else
    {
      soundGroup = jazzGroup ;
    }

    var mixerView = $('#mixer-view');
    var channels = Mixer.setup(soundGroup);
    var i = 0;
    Mixer.channelsToRender = [];
    Mixer.channelsToRender.push(channels.guitar);
    if(data.thickness > 40)
    {
      Mixer.channelsToRender.push(channels.drums);
    }
    if(data.thickness > 75)
    {
      Mixer.channelsToRender.push(channels.other);
    }

   // play all track
    $.each(channels, function(key, channel){
      channel.audio.volume = 0;
      channel.audio.play();
    });
    
    Mixer.updateTimer();
    
    Mixer.setVolumes( data );


  },
  togglePlayer: function()
  {
      var channels = Mixer.channels;
      if(channels.guitar.audio.paused === false)
      {
        // play all track
        $.each(channels, function(key, channel){
          channel.audio.pause();
        });
      }
      else
      {
        $.each(channels, function(key, channel){
          channel.audio.play();
          Mixer.updateTimer();
        });
      }
  },
  updateTimer: function()
  {
    var channels = Mixer.channels;
    setTimeout(function()
    {
      if(channels.guitar.audio.paused === false)
      {
        StacheTrack.Views.AppView.playWave(channels.guitar.audio.currentTime/ channels.guitar.audio.duration);
        var current = Mixer.checkSingle(Math.floor(channels.guitar.audio.currentTime));
        var total = Mixer.checkSingle(Math.floor(channels.guitar.audio.duration));
        Mixer.updateTimer(channels);
        $('#timer').html( "0:" + current + " | 0:" + total);
      }
      else
      {
        Mixer.updateTimer(channels);
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
  setVolumes: function( data) 
  {

    $.each(Mixer.channelsToRender, function(i, channel) {
      channel.audio.volume = .25;
  
    });
  }

};