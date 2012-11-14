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
    var audioFiles = [{
      id: 'drums',
      source: 'audio/drums'
    },
    {
      id: 'classy',
      source: 'audio/classy'
    },
    {
      id: 'hillbilly',
      source: 'audio/hillbilly'
    },
    {
      id: 'porno',
      source: 'audio/porno'
    },
    {
      id: 'rocknroll',
      source: 'audio/rocknroll'
    } ,
    {
      id: 'smooth',
      source: 'audio/smooth'
    }];
    
    var mixerView = $('#mixer-view');
    var channels = Mixer.setup(audioFiles);
    var i = 0;
    
    Mixer.channelsToRender = [channels.classy, channels.hillbilly, channels.porno, channels.rocknroll, channels.smooth];

   // play all track
    $.each(channels, function(key, channel){
      channel.audio.volume = 0;
      channel.audio.play();
    });
    channels.drums.audio.volume = 0.75;
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