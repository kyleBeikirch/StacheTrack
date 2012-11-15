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
    
    console.log(audioData);
      
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
      id: 'rockDrums',
      source: 'audio/drums'
    },
    {
      id: 'rockGuitar',
      source: 'audio/classy'
    },
    {
      id: 'rockBass',
      source: 'audio/hillbilly'
    }];

    var funkGroup = [{
      id: 'funkDrums',
      source: 'audio/drums'
    },
    {
      id: 'funkGuitar',
      source: 'audio/classy'
    },
    {
      id: 'funkBrass',
      source: 'audio/hillbilly'
    }];

    var acousticGroup = [{
      id: 'acousticDrums',
      source: 'audio/drums'
    },
    {
      id: 'acousticGuitar',
      source: 'audio/classy'
    },
    {
      id: 'acousticSound',
      source: 'audio/hillbilly'
    }];
    
    var soundGroup;
    if(data.shape > 1.3)
    {
      soundGroup = rockGroup;
    }
    else if(data.shape < -1.3)
    {
      soundGroup = acousticGroup;
    }
    else
    {
      soundGroup = funkGroup ;
    }

    console.log(soundGroup);
    var mixerView = $('#mixer-view');
    var channels = Mixer.setup(soundGroup);
    var i = 0;
    
    Mixer.channelsToRender = [channels.classy, channels.hillbilly, channels.porno, channels.rocknroll, channels.smooth];

   // play all track
    $.each(channels, function(key, channel){
      channel.audio.volume = 0;
      channel.audio.play();
    });
    Mixer.setVolumes( data );

  },
  setVolumes: function( data) 
  {

    console.log( data );
    $.each(Mixer.channelsToRender, function(i, channel) {
      channel.audio.volume = .25;
  
    });
  }

};