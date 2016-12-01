require 'asciidoctor/extensions' unless RUBY_ENGINE == 'opal'
require 'pp'

include ::Asciidoctor

Extensions.register do
  treeprocessor do
    process do |doc|

      slides = doc.find_by :role => 'SLIDE'

      doc.blocks.clear

      slides.each do |slide|

        # puts slide

        section = Section.new doc, 1
        section.title = "!"
        section.id = slide.id

        # this seems to be needed but why?
        section.set_attr "id", ""

        if slide.context === :open
          section.roles.concat slide.roles
          section.blocks.concat slide.blocks
        else
          slide.id = nil
          slide.remove_role 'SLIDE'
          section.blocks << slide
        end

        doc.blocks << section

      end

      # puts 'blocks'
      # pp doc



      # section = Section.new doc
      # section.level = 1
      # section.title = "!"
      # section.generate_id
      # puts slides


      # , "", {
      #   :title => '!',
      #   :level => 1
      # }
      # section.set_attr "title", '!'
      # section.set_attr "level", 1

      # pp section

      # doc.blocks << section
      # pp doc.blocks[0]
      # puts doc.blocks[0].id
      # puts doc.blocks[1].id
      # puts doc.blocks[2].attributes
      # puts doc.blocks[3].attributes
      # puts doc.blocks[4].attributes
      # doc.blocks.concat slides
      doc
    end
  end
end
