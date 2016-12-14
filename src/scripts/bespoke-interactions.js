module.exports = function interactions(handlers) {

  let timeouts = []

  return function(deck) {

    deck.on('activate', function(event) {

      timeouts.forEach((id) => clearTimeout(id))

      for (selector in handlers) {
        if (event.slide.matches(selector)) {
          timeouts = handlers[selector](event.slide)
        }
      }
    })
  }
}
