module Middleman
  module Blog
    class BlogData
      alias_method :old_tags, :tags

      def tags
        tags = old_tags
        articles.each do |article|
          next unless article.tags.count.zero?
          tags['untagged'] ||= []
          tags['untagged'] << article
        end

        tags
      end

    end
  end
end
