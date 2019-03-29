self.name = 'worker'
self.welcome = {};
self.handleTimeout = {
  timer1: null,
  timer2: null,
};

importScripts('/test.js')
self.onmessage = abc;