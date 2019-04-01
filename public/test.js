self.abc = function(mes, vue){
  let data;
  let isWorker = false;
  let $send;
  let $times;
  let handleTimeout;
  let handleReject;

  if (mes.type == 'message'){
    data = mes.data;
    isWorker = true;
  }else data = mes;
  
  if(isWorker){
    $send = (mes)=>{ self.postMessage(mes) };
    $times = self.welcome;
    handleTimeout = self.handleTimeout;
    handleReject = self.handleReject;
  }else{
    $send = (mes) => { vue.eBus.$emit('worker', mes) }
    $times = vue.welcome    
    handleTimeout = this.handleTimeout
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
      clearTimeout(handleTimeout.timer1)
      clearTimeout(handleTimeout.timer2)      
      timerSignal(data.time)          
    break;
    case "start_cards_animation":      
      animationSignal(data.data);
    break;
    case "stop_animation":
      stopAnimation();
    break;
  }

  function stopAnimation(){
    if (handleReject.card_animation != null){
      handleReject.card_animation('stop');
      handleReject.card_animation = null;
    }
  }

  function timerSignal(time) {
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
        handleTimeout.timer2 = setTimeout(x, 1000)
      }
    }    
    handleTimeout.timer1 = setTimeout(x,extra);
  }

  function pause(t){
    return new Promise ( (resolve, reject) => {
      handleReject.card_animation = reject;      
      setTimeout(resolve,t)
    })
  }

  function animationSignal(data){    
    let limit = data.banker.cards.length + data.player.cards.length; 

    (async()=>{
      try{
        await pause(500)  
        for(let i = 0; i < 4 ; i++){
          $send({
            type: `worker::cards_drop`,
            index: i,        
          })
          await pause(300)
        }  
        await pause(500)
        for(let i of [0,1]){
          $send({
            type: `worker::cards_open_quick`,
            index: i,        
          })
          await pause(500)
        }
        for(let i of [2,3]){
          $send({
            type: `worker::cards_open_long`,
            index: i,        
          })
          await pause(700)
        }
      
        if(limit>4){
          for(let i = 4; i<limit;i++){
            $send({
              type: `worker::cards_drop`,
              index: i,        
            })
            await pause(650);
            $send({
              type: `worker::cards_open_long`,
              index: i,        
            })
            await pause(400);
          }
        }
        /*
        setTimeout(()=>{
          $send({
            type: 'worker::cards_out',
          })
        },7000)
      */
        //위너 노출신호
        setTimeout(()=>{
          $send({
            type: 'worker::expose_winner',
          })
        },1500)
      }catch(error){
        if(error == 'stop'){
          
        }
      }
    })()
  }
};