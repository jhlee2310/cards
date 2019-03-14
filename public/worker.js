let times = {
  betting: 10000,
  deal_base: 2000,
  deal_each: 500,
  post_game: 1000,
  prepare_game: 0,
  prepare_round: 0,
}

self.onmessage = mes => {
  let data = mes.data
  let type = data.type
  self.postMessage(data); // echo
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
  for(let i = 0; i < limit ; i++){
    send(i)    
    await pause(700)
  }
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