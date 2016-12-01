module.exports = function protocol() {

  return function (deck) {

    const metas = {}
    Array.from(document.querySelectorAll('head meta')).forEach((meta) => {
        metas[meta.getAttribute('name')] = meta.getAttribute('content')
    })

    const notes = {}
    Array.from(document.querySelectorAll('aside#all-notes [id]')).forEach((note) => {
      notes[note.id] = note.innerHTML
    })

    const steps = deck.slides.map((slide, slideIdx) => {

      // const notes = [].slice.call(slide.querySelectorAll('aside[role="note"] p, aside[role="note"] li'))
      //   .map((note) => note.textContent)
      //   .join('\n')

      if (slide.bullets.length > 0) {
        return slide.bullets.map((b, bulletIdx) => {
          return {
            cursor: String(slideIdx) + '.' + String(bulletIdx),
            states: [],
            notes: notes[slide.id],
          }
        })
      }

      return {
        // cursor: String(slideIdx),
        cursor: slide.id,
        states: [],
        notes: notes[slide.id],
      }
    })

    const details = {
      title: document.title || '',
      authors: metas.author || '',
      description: metas.description || '',
      vendor: 'bespoke.js',
      steps,
      ratios: ['16/9'],
      themes: ['default'],
    }

    window.addEventListener('message', ({ source, data: { command, commandArgs } }) => {

      switch (command) {

        case 'get-slide-deck-details':
          source.postMessage({ event: 'slide-deck-details', eventData: { details } }, '*')
          break;

        case 'go-to-step':
          const { cursor } = commandArgs
          // const [slideIdx, subslideIdx] = cursor.split('.')
          const idx = deck.slides.findIndex((s) => s.id === cursor)
          deck.slide(idx)
          // deck.slide(Number(slideIdx))
          // deck.activateBullet(Number(slideIdx), Number(subslideIdx))
          break;

        default:
          console.debug(`unknown protocol command ${command} with args`, commandArgs)
      }
    })
  }
}
