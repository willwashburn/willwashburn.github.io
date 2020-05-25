module BuildStyles
  def self.process(site, payload)
    return if @processed
    system "npm install && cross-env NODE_ENV=production gulp processStyles"
    @processed = true
  end
end

Jekyll::Hooks.register :site, :post_render do |site, payload|
  BuildStyles.process(site, payload)
end
