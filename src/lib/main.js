'use strict';

var {ToggleButton} = require('sdk/ui/button/toggle');
var panels = require('sdk/panel');
var self = require('sdk/self');
var sp = require('sdk/simple-prefs');
var timers = require('sdk/timers');
var tabs = require('sdk/tabs');

var button, panel;

button = new ToggleButton({
  id: 'performance',
  label: 'Performance Reporter',
  icon: {
    '16': './icons/16.png',
    '18': './icons/18.png',
    '32': './icons/32.png',
    '36': './icons/36.png',
    '64': './icons/64.png'
  },
  onChange: function handleChange (state) {
    if (state.checked) {
      panel.contentURL = 'about:performance';
      panel.show({
        position: button
      });
    }
  }
});

panel = panels.Panel({
  contentURL: 'about:blank',
  contentStyleFile: self.data.url('panel/index.css'),
  onHide: function () {
    button.state('window', {checked: false});
    panel.contentURL = 'about:blank';
  },
  width: sp.prefs.width,
  height: sp.prefs.height
});

sp.on('width', function () {
  if (sp.prefs.width < 300) {
    sp.prefs.width = 300;
    return;
  }
  panel.width = 300;
});
sp.on('height', function () {
  if (sp.prefs.height < 300) {
    sp.prefs.height = 300;
    return;
  }
  panel.height = 300;
});

exports.main = function (options) {
  if (options.loadReason === 'install' || options.loadReason === 'startup') {
    var version = sp.prefs.version;
    if (self.version !== version) {
      if (sp.prefs.welcome) {
        timers.setTimeout(function () {
          tabs.open(
            'http://firefox.add0n.com/performance-reporter.html?v=' + self.version +
            (version ? '&p=' + version + '&type=upgrade' : '&type=install')
          );
        }, 3000);
      }
      sp.prefs.version = self.version;
    }
  }
};
