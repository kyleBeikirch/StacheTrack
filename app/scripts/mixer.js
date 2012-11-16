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
      source: 'audio/drums'
    },
    {
      id: 'guitar',
      source: 'audio/classy'
    },
    {
      id: 'other',
      source: 'audio/hillbilly'
    }];

    var funkGroup = [{
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
    if(data.shape > 1.3)
    {
      soundGroup = acousticGroup;
    }
    else if(data.shape < -1.3)
    {
      soundGroup = rockGroup;
    }
    else
    {
      soundGroup = funkGroup ;
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
    Mixer.setVolumes( data );

  },
  setVolumes: function( data) 
  {

    $.each(Mixer.channelsToRender, function(i, channel) {
      channel.audio.volume = .25;
  
    });
  }

};