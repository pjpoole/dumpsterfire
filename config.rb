# Activate and configure extensions
# https://middlemanapp.com/advanced/configuration/#configuring-extensions
require 'lib/blog_data'

Time.zone = "Eastern Time (US & Canada)"

activate :autoprefixer do |prefix|
  prefix.browsers = "last 2 versions"
end

activate :blog do |blog|
  blog.prefix = "blog"
  blog.layout = "post"
  blog.sources = '/entries/{year}-{month}-{day}-{title}.html'
  blog.paginate = true
  blog.page_link = "page{num}"
  blog.per_page = 10

  blog.tag_template = 'blog/tag.html'
  blog.calendar_template = 'blog/calendar.html'

  blog.custom_collections = {
    category: {
      link: '/categories/{category}.html',
      template: '/blog/category.html'
    }
  }

  blog.new_article_template = File.expand_path('template.erb', __dir__)
end

ignore '/blog/drafts/*'

activate :livereload
activate :directory_indexes
activate :syntax, line_numbers: true

set :markdown_engine, :kramdown

# Layouts
# https://middlemanapp.com/basics/layouts/

# Per-page layout changes
page '/*.xml', layout: false
page '/*.json', layout: false
page '/*.txt', layout: false

# With alternative layout
# page '/path/to/file.html', layout: 'other_layout'

# Proxy pages
# https://middlemanapp.com/advanced/dynamic-pages/

# proxy(
#   '/this-page-has-no-template.html',
#   '/template-file.html',
#   locals: {
#     which_fake_page: 'Rendering a fake page with a local variable'
#   },
# )

# Helpers
# Methods defined in the helpers block are available in templates
# https://middlemanapp.com/basics/helper-methods/

# helpers do
#   def some_helper
#     'Helping'
#   end
# end

# Build-specific configuration
# https://middlemanapp.com/advanced/configuration/#environment-specific-settings

configure :build do
  activate :minify_css
end

activate :deploy do |deploy|
  deploy.build_before  = true
  deploy.deploy_method = :sftp
  deploy.host          = 'schley.dreamhost.com'
  deploy.port          = 22
  deploy.path          = '/home/dh_vm49df/dumpsterfire.nyc'
  deploy.user          = 'dh_vm49df'
end

Dir['helpers/*'].each(&method(:load))
