const abc = function(mes, vue){
  let data;
  let isWorker = false;
  let $send;
  let $times;
  let handleTimeout1 = null;
  let handleTimeout2 = null;

  if (mes.type == 'message'){
    data = mes.data;
    isWorker = true;
  }else data = mes;
  
  if(isWorker){
    $send = (mes)=>{ self.postMessage(mes) };
    $times = self.welcome;
  }else{
    $send = (mes) => { vue.eBus.$emit('worker', mes) }
    $times = vue.welcome
  }
  /*
    worker process
  */
  console.log(data)
  switch(data.type){
    case "welcome":
      self.welcome = data.data
    break;
    case "start_bet_timer":
    timerSignal(data.time, $send)
      //$send($times)      
    break;
  }

  function timerSignal(time) {
    clearTimeout(handleTimeout1)
    clearTimeout(handleTimeout2)
    let timer = ($times.betting - time)
    let extra = timer % 1000;
    timer = (timer - extra) / 1000;

    let x = () => {
      $send({
        type: 'worker::timer',
        value: timer
      })
      timer--;
      if (timer >= 0) {
        handleTimeout2 = setTimeout(x, 1000)
      }
    }    
    handleTimeout1 = setTimeout(x,extra);
  }
};



if( typeof module != 'undefined' ) module.exports = abc;