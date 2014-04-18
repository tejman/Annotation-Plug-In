
jade = (function(exports){
/*!
 * Jade - runtime
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Lame Array.isArray() polyfill for now.
 */

if (!Array.isArray) {
  Array.isArray = function(arr){
    return '[object Array]' == Object.prototype.toString.call(arr);
  };
}

/**
 * Lame Object.keys() polyfill for now.
 */

if (!Object.keys) {
  Object.keys = function(obj){
    var arr = [];
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        arr.push(key);
      }
    }
    return arr;
  }
}

/**
 * Merge two attribute objects giving precedence
 * to values in object `b`. Classes are special-cased
 * allowing for arrays and merging/joining appropriately
 * resulting in a string.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 * @api private
 */

exports.merge = function merge(a, b) {
  var ac = a['class'];
  var bc = b['class'];

  if (ac || bc) {
    ac = ac || [];
    bc = bc || [];
    if (!Array.isArray(ac)) ac = [ac];
    if (!Array.isArray(bc)) bc = [bc];
    ac = ac.filter(nulls);
    bc = bc.filter(nulls);
    a['class'] = ac.concat(bc).join(' ');
  }

  for (var key in b) {
    if (key != 'class') {
      a[key] = b[key];
    }
  }

  return a;
};

/**
 * Filter null `val`s.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function nulls(val) {
  return val != null;
}

/**
 * Render the given attributes object.
 *
 * @param {Object} obj
 * @param {Object} escaped
 * @return {String}
 * @api private
 */

exports.attrs = function attrs(obj, escaped){
  var buf = []
    , terse = obj.terse;

  delete obj.terse;
  var keys = Object.keys(obj)
    , len = keys.length;

  if (len) {
    buf.push('');
    for (var i = 0; i < len; ++i) {
      var key = keys[i]
        , val = obj[key];

      if ('boolean' == typeof val || null == val) {
        if (val) {
          terse
            ? buf.push(key)
            : buf.push(key + '="' + key + '"');
        }
      } else if (0 == key.indexOf('data') && 'string' != typeof val) {
        buf.push(key + "='" + JSON.stringify(val) + "'");
      } else if ('class' == key && Array.isArray(val)) {
        buf.push(key + '="' + exports.escape(val.join(' ')) + '"');
      } else if (escaped && escaped[key]) {
        buf.push(key + '="' + exports.escape(val) + '"');
      } else {
        buf.push(key + '="' + val + '"');
      }
    }
  }

  return buf.join(' ');
};

/**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

exports.escape = function escape(html){
  return String(html)
    .replace(/&(?!(\w+|\#\d+);)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};

/**
 * Re-throw the given `err` in context to the
 * the jade in `filename` at the given `lineno`.
 *
 * @param {Error} err
 * @param {String} filename
 * @param {String} lineno
 * @api private
 */

exports.rethrow = function rethrow(err, filename, lineno){
  if (!filename) throw err;

  var context = 3
    , str = require('fs').readFileSync(filename, 'utf8')
    , lines = str.split('\n')
    , start = Math.max(lineno - context, 0)
    , end = Math.min(lines.length, lineno + context);

  // Error context
  var context = lines.slice(start, end).map(function(line, i){
    var curr = i + start + 1;
    return (curr == lineno ? '  > ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'Jade') + ':' + lineno
    + '\n' + context + '\n\n' + err.message;
  throw err;
};

  return exports;

})({});

jade.templates = {};
jade.render = function(node, template, data) {
  var tmp = jade.templates[template](data);
  node.innerHTML = tmp;
};

jade.templates["browseComments"] = function(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
}
return buf.join("");
}
jade.templates["commentButton"] = function(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<button type="button" class="comment-btn btn btn-default btn-sm"><span class="glyphicon glyphicon-edit"></span></button>');
}
return buf.join("");
}
jade.templates["commentEntryBox"] = function(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div id="comment-form" class="panel panel-default"><div class="panel-body user-comment"><div class="row comment-header"><div class="col-xs-3 comment-pic"><img src="http://gravatar.com/avatar/1?d=identicon"/></div><div class="col-xs-9 comment-info"><strong>Test User</strong></div></div><div class="row comment-input"><div class="col-xs-12"><textarea class="form-control"></textarea></div></div><div class="row comment-buttons"><div class="col-xs-8"><button id="submit-comment" class="btn btn-primary btn-xs">Submit</button><button id="cancel-comment" class="btn btn-default btn-xs">Cancel</button></div></div></div></div>');
}
return buf.join("");
}
jade.templates["commentViewBox"] = function(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
// iterate comments
;(function(){
  if ('number' == typeof comments.length) {
    for (var i = 0, $$l = comments.length; i < $$l; i++) {
      var comment = comments[i];

buf.push('<div class="panel panel-default"><div');
buf.push(attrs({ 'data-id':(i), "class": ('panel-body') + ' ' + ('user-comment') }, {"data-id":true}));
buf.push('><div class="row comment-header"><div class="col-xs-3 comment-pic"><img src="http://gravatar.com/avatar/1?d=identicon"/></div><div class="col-xs-9 comment-info"><strong>' + escape((interp = comment.user) == null ? '' : interp) + '</strong><time class="comment-ts">' + escape((interp = comment.timestamp) == null ? '' : interp) + '</time></div></div><div class="row comment-text"><div class="col-xs-12"><p>' + escape((interp = comment.commentText) == null ? '' : interp) + '</p></div></div></div></div>');
    }
  } else {
    for (var i in comments) {
      var comment = comments[i];

buf.push('<div class="panel panel-default"><div');
buf.push(attrs({ 'data-id':(i), "class": ('panel-body') + ' ' + ('user-comment') }, {"data-id":true}));
buf.push('><div class="row comment-header"><div class="col-xs-3 comment-pic"><img src="http://gravatar.com/avatar/1?d=identicon"/></div><div class="col-xs-9 comment-info"><strong>' + escape((interp = comment.user) == null ? '' : interp) + '</strong><time class="comment-ts">' + escape((interp = comment.timestamp) == null ? '' : interp) + '</time></div></div><div class="row comment-text"><div class="col-xs-12"><p>' + escape((interp = comment.commentText) == null ? '' : interp) + '</p></div></div></div></div>');
   }
  }
}).call(this);

}
return buf.join("");
}