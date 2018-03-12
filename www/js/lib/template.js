define(function () {
  
  var Template = function (templateId) {
    var temp = document.getElementById(templateId).innerHTML;
    var regex = /{(.*?)}/g;
    var parts = [];
    var reps = [];
    var lastIndex = 0;
    var i = 0;
    var result;
    while((results = regex.exec(temp)) !== null) {
      parts.push(temp.slice(lastIndex, results.index));
      reps.push(results[1]);
      lastIndex = regex.lastIndex;
    }
    parts.push(temp.slice(lastIndex));

    this.render = function (data) {
      var retVal = '';
      var i;
      for (i = 0; i < reps.length; i++) {
        retVal += parts[i];
        retVal += data[reps[i]];
      }
      retVal += parts[i];
      return retVal;
    };
  };
  Template.prototype = new Object;
  
  Template.prototype.render = function (data) {
    throw new Error('Template not yet compiled.');
  };
  
  return Template;
});