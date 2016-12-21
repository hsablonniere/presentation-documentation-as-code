module.exports = function () {

  const audioCtx = new AudioContext();
  function loadsound(url) {

    return new Promise((resolve, reject) => {

      const request = new XMLHttpRequest();
      request.open('GET', url, true);
      request.responseType = 'arraybuffer';
      request.onload = function() {
        const audioData = request.response;
        audioCtx.decodeAudioData(audioData, resolve, reject)
      }
      request.send();
    })
  }

  function playStop(buff) {

    // let source

    return [
      function () {
        // console.log('foo', source);
        // if (source == null) {
          let source = audioCtx.createBufferSource()
          source.buffer = buff
          source.connect(audioCtx.destination)
          source.start(0)
        // }
      },
      function () {
        // if (source != null) {
        //   source.stop()
        //   source.disconnect(audioCtx.destination)
        //   source = null
        // }
      },
    ]
  }

  return function(deck) {

    Promise.all([
      loadsound('images/morning-edvard-grieg.mp3'),
      loadsound('images/5th-symphony-beethoven-one.mp3'),
      loadsound('images/5th-symphony-beethoven-two.mp3'),
      loadsound('images/type.mp3'),
      loadsound('images/ding.mp3'),
    ]).then(([morning, beethovenOne, beethovenTwo, type, ding]) => {

      deck.on('activate', function(event) {

        console.info(event.slide.id)

        // if (event.slide.id === 'true-story' || event.slide.id === 'fin') {
        if (event.slide.id === 'true-story') {
          [deck.playSound, deck.stopSound] = playStop(morning)
          return
        }

        if (event.slide.id === 'story-dangers') {
          [deck.playSound, deck.stopSound] = playStop(beethovenOne)
          return
        }

        if (event.slide.id === 'story-dangers-two') {
          [deck.playSound, deck.stopSound] = playStop(beethovenTwo)
          return
        }

        // deck.playSound = null
        // deck.stopSound = null
        [deck.playSound, deck.stopSound] = playStop(type)
        deck.playDing = playStop(ding)[0]
      })
    })
  }
}
