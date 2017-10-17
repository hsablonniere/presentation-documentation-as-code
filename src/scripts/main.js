const bespoke = require('bespoke')
const classes = require('bespoke-classes')
const scale = require('bespoke-scale')
const nav = require('bespoke-nav')
const bullets = require('./bespoke-bullets--patched')
const hash = require('bespoke-hash')
const multimedia = require('bespoke-multimedia')
const protocol = require('./bespoke-protocol')
const interactions = require('./bespoke-interactions')
const sounds = require('./bespoke-sounds')

const Prism = require('prismjs')
require('prismjs/plugins/unescaped-markup/prism-unescaped-markup')
require('prismjs/plugins/normalize-whitespace/prism-normalize-whitespace')
require('prismjs/plugins/keep-markup/prism-keep-markup')
require('prismjs/components/prism-asciidoc')
require('prismjs/components/prism-latex')
require('prismjs/components/prism-ruby')

const audioCtx = new AudioContext()
function loadsound(url) {

  return new Promise((resolve, reject) => {

    const request = new XMLHttpRequest()
    request.open('GET', url, true)
    request.responseType = 'arraybuffer'
    request.onload = function () {
      const audioData = request.response
      audioCtx.decodeAudioData(audioData, resolve, reject)
    }
    request.send()
  })
}

const typewriter = {}

Promise
  .all([
    loadsound('images/type.mp3'),
    loadsound('images/ding.mp3'),
  ])
  .then(([type, ding]) => {
    typewriter.type = type
    typewriter.ding = ding
  })

function play(buff) {

  let source

  // return [
  // function () {
  source = audioCtx.createBufferSource()
  source.buffer = buff
  source.connect(audioCtx.destination)
  source.start(0)
  // },
  // function () {
  //   if (source != null) {
  //     source.stop()
  //     source.disconnect(audioCtx.destination)
  //     source = null
  //   }
  // },
// ]
}

bespoke.from({ parent: 'article.deck', slides: 'section' }, [
  classes(),
  nav(),
  bullets('.build, .build-items > *:not(.build-items)'),
  hash(),
  protocol(),
  function () {
    Prism.highlightAll()
  },
  sounds(),
  interactions({

    '.tpl-title': function (slide, deck) {
      const $msg = slide.querySelector('p')

      if (!$msg.classList.contains('letter-processed')) {

        const splittedMsg = $msg.innerHTML
          .split(' ')
          .map((part) => {
            return part
              .split('&nbsp;')
              .map((word) => {
                return word
                  .split('')
                  .map((l) => `<span class="letter">${l}</span>`)
                  .join('')
              })
              .join('<span class="letter">&nbsp;</span>')
          })
          .join(' ')

        $msg.classList.add('letter-processed')
        $msg.innerHTML = splittedMsg
      }

      $msgLetters = Array.from($msg.querySelectorAll('.letter'))
      const dingTimeout = setTimeout(() => {
        play(typewriter.ding)
      }, $msgLetters.length * 120 + 50 + 2500)

      const typeTimeouts = $msgLetters.map((l, i) => {
        l.style.visibility = 'hidden'
        return setTimeout(() => {
          l.style.visibility = 'visible'
          play(typewriter.type)
        }, i * 120 + 50 * Math.random() + 2500)
      })

      return [...typeTimeouts, dingTimeout]
    }
  })
])
