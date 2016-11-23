const bespoke = require('bespoke')
const classes = require('bespoke-classes')
const scale = require('bespoke-scale')
const nav = require('bespoke-nav')
const bullets = require('./bespoke-bullets--patched')
const hash = require('bespoke-hash')
const multimedia = require('bespoke-multimedia')
const protocol = require('./bespoke-protocol')

bespoke.from({ parent: 'article.deck', slides: 'section' }, [
  classes(),
  scale(),
  nav(),
  bullets('.build, .build-items > *:not(.build-items)'),
  hash(),
  multimedia(),
  protocol(),
])
