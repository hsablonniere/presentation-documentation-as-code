require 'asciidoctor/extensions' unless RUBY_ENGINE == 'opal'
require 'pp'

include ::Asciidoctor

Extensions.register do
  treeprocessor do
    process do |doc|

      slides = (doc.find_by role: 'SLIDE').map {|slide|
        slide.parent.blocks.delete slide
        sect = Asciidoctor::Section.new doc, 1, false
        sect.title = '!'
        sect.id = slide.id
        slide.id = nil
        if slide.blocks?
          slide.blocks.each do |child|
            sect << (slide.blocks.delete child)
            child.remove_role 'SLIDE'
            child.parent = sect
          end
        else
          sect << slide
          slide.remove_role 'SLIDE'
          slide.parent = sect
        end
        sect
      }
      doc.blocks.replace slides
      nil
      
    end
  end
end
