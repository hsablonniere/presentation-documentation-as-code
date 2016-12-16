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

bespoke.from({ parent: 'article.deck', slides: 'section' }, [
  classes(),
  nav(),
  bullets('.build, .build-items > *:not(.build-items)'),
  hash(),
  multimedia(),
  protocol(),
  function () {
    Prism.highlightAll()
  },
  sounds(),
  interactions({
    '.tpl-title': function (slide) {
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
      return $msgLetters.map((l, i) => {
        l.style.visibility = 'hidden'
        return setTimeout(() => {
          l.style.visibility = 'visible'
        }, i * 120 + 50 * Math.random() + 2500)
      })
    }
  })
])
