require 'asciidoctor/extensions' unless RUBY_ENGINE == 'opal'
require 'pp'

include ::Asciidoctor

Extensions.register do
  treeprocessor do
    process do |doc|
      puts 'blocks'
      pp doc
      puts 'slides'
      slides = doc.find_by :role => 'SLIDE'
      puts slides
      puts '----'
      doc
    end
  end
end
