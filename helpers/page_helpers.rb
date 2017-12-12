module PageHelpers
  # deprecated
  def navigation_pages
    sitemap.resources.find_all { |p| p.data['navigation'] }
  end

  def categories
    categories = {}

    blog.articles.each do |article|
      category = article.data[:category] || 'uncategorized'
      categories[category] ||= []
      categories[category] << article
    end

    categories
  end

  def categories_by_count
    categories.sort_by { |t| t[1].count }.reverse
  end

  def blog_by_tag_count
    blog.tags.sort_by { |t| t[1].count }.reverse
  end

  def tag_size(article_count)
    case article_count
    when 1; 'small'
    when 2..5; 'medium'
    when 6..10; 'large'
    else 'x-large'
    end
  end

  def previous_sunday(date)
    date.prev_day(date.cwday % 7)
  end

  def standard_date(date)
    format_date(date, data.site.date_format)
  end

  def format_datetime(date)
    format_date(date, "%F")
  end

  def format_date(date, format)
    date.strftime(format)
  end

  def sorted_elements(hsh)
    hsh.values.sort_by do |el|
      el.end_date || Date.today
    end.reverse
  end

  def solo_date(date, format)
    content_tag :span, class: 'time' do
      content_tag :time, datetime: format_datetime(date) do
        format_date(date, format)
      end
    end
  end

  def resume_date(element)
    date_format = current_page.data.date_format
    content = ""

    if element.start_date
      content += solo_date(element.start_date, date_format) + " — "

      if element.end_date
        content += solo_date(element.end_date, date_format)
      else
        content += content_tag :span, class: 'time' do
          "Current"
        end
      end
    elsif element.date
      content += solo_date(element.date, date_format)
    end

    content
  end
end
