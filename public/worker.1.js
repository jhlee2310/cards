self.onmessage = mes => {
  let data = mes.data
  let type = data.type

  //self.postMessage(data); // echo
  //if(type != 'room_bead') console.log(data)
  switch (type) {
    case "welcome":
      times = data.times;
      break;

    case "room_state":
      switch (data.state) {
        //배팅시작 알림
        case "betting":
          timerSignal(times.betting)
          break;

        case 'betting::chain':
        //배팅종료 알림
        break;        
      }
      break;

    case "deal_info":      
      animationSignal(data)
    break;



  }
}
async function pause(t){
  return new Promise(resolve => {
    setTimeout(resolve,t)
  })
}

async function animationSignal(data){
  let limit = data.deal.banker.cards.length + data.deal.player.cards.length
  const send = index => self.postMessage({
    type: `worker::cards`,
    index: index,    
  })  

  await pause(500)  
  for(let i = 0; i < 4 ; i++){
    self.postMessage({
      type: `worker::cards_drop`,
      index: i,        
    })
    await pause(300)
  }

  await pause(500)
  for(let i of [0,1]){
    self.postMessage({
      type: `worker::cards_open_quick`,
      index: i,        
    })
    await pause(500)
  }
  for(let i of [2,3]){
    self.postMessage({
      type: `worker::cards_open_long`,
      index: i,        
    })
    await pause(700)
  }

  if(limit>4){
    for(let i = 4; i<limit;i++){
      self.postMessage({
        type: `worker::cards_drop`,
        index: i,        
      })
      await pause(650);
      self.postMessage({
        type: `worker::cards_open_long`,
        index: i,        
      })
      await pause(400);
    }
  }
   
  
/*
  for(let i = 0; i < limit ; i++){
    send(i)    
    await pause(700)
  }*/
  //카드철수신호
  setTimeout(()=>{
    self.postMessage({
      type: 'worker::cards_out',
    })
  },7000)

  //위너 노출신호
  setTimeout(()=>{
    self.postMessage({
      type: 'worker::expose_winner',
    })
  },1500) 
  
}

function timerSignal() {
  let timer = times.betting / 1000

  self.postMessage({
    type: 'worker::timer_start',    
  })

  let x = () => {
    self.postMessage({
      type: 'worker::timer',
      value: timer
    })
    timer--;
    if (timer >= 0) setTimeout(x, 1000)
  }
  x();
}