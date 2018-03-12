define(['backbone', 'template'], function (Backbone, Template) {
  var JobView = Backbone.View.extend({
    events: {
      'click .close': 'remove',
      'click .download': 'download'
    },
    
    tagName: 'div',
    className: 'job-container',
    
    template: new Template('fileTemplate'),
    
    initialize: function (opts) {
      if (opts.el)
        this.setElement(el);
      else {
        this.$el.append(this.template.render(opts));
        this.$status = this.$('.status');
      }
    },
    
    // Request to download this job's associated render
    download: function () {
      console.log('Request to download ' +'' /*this.model.get('filename')*/);
    },
    
    status: function (s) {
      this.$status.html(s);
    },
  });
  
  return JobView;
});