require.config({
  paths: {
    backbone: 'lib/backbone',
    underscore: 'lib/underscore',
    jquery: 'lib/zepto',
    template: 'lib/template'
  },
  shim: {
  }
});

require(['jquery', 'views/job'], function ($, JobView) {
  
  var JobModel = Backbone.Model.extend({
    defaults: {
      filename: null,
      status: null
    },
    
    initialize: function (attrs, opts) {
    },
  });
  
  var JobCollection = Backbone.Collection.extend({
    model: JobModel,
    url: 'jobs'
  });
  
  var jobCollection = new JobCollection();
  
  // Populate collection with bootstrapped data
  JSON.parse(document.getElementById('jobData').innerHTML).jobs.forEach(function (job) {
    jobCollection.add(job);
    console.log(jobCollection);
  });
  //jobCollection.add();
  
  var eSource = new EventSource(document.URL);
  eSource.onopen = function (e) {
    console.log('Event source connection opened.');
  };
  eSource.addEventListener('RenderComplete', function (e) {
    console.log(e);
  });
  
  // Set up controls
  
  var dropTarget = $('#dropTarget');
  
  // Block 'dragenter' and 'dragover' events so that 'drop' and 'dragdrop' may trigger.
  dropTarget.on('dragenter dragover', function (e){
    e.preventDefault();
  });
  
  var fileArea = $('#fileArea');
  dropTarget.on('drop dragdrop', function (e) {
    e.stopPropagation();
    e.preventDefault();
    var formData = new FormData();
    var nFiles = e.dataTransfer.files.length;
    var uploadedFiles = [];
    for (var i = 0; i < nFiles; i++) {
      formData.append('files[]', e.dataTransfer.files[i]);
      var jobView = new JobView({
        filename: e.dataTransfer.files[i].name
      });
      uploadedFiles.push(jobView);
      fileArea.append(jobView.$el);
    }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        uploadedFiles.forEach(function (jobView) {
          jobView.status('Rendering');
        });
      }
    };
    xhttp.open('PUT', document.URL + 'jobs');
    xhttp.send(formData);
  });
  
  window.onbeforeunload = function () {
    eSource.close();
    return null;
  };
});