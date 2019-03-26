/*
const server = require('http').createServer();
const io = require('socket.io')(server);
io.on('connection', client => {
  client.on('event', data => {  });
  client.on('disconnect', () =>  });

  console.log(client)
});

server.listen(10080);
*/
const WebSocket = require('ws');
const fs = require('fs');
const wss = new WebSocket.Server({ port:7070 });
wss.on('connection', ws => {
  //console.log(ws)
  let $file = '';
  $file = `chat.json`
  if(!fs.existsSync($file)){          
    fs.writeFileSync($file,'[]','utf8')
		console.log('파일생성함')
  }

	ws.on('message', message => {
		const obj = JSON.parse(message)
		
		let data;
		data = fs.readFileSync( $file, 'utf8')
		data = JSON.parse(data);
		if(obj.type == 'welcome'){
			wss.broadcast(JSON.stringify(data));
		}else if(obj.type == 'chat'){
			//console.log($file);
			const msgData = {
				msg : obj.txt,
				time: new Date().getTime(),
				name: obj.user,
				//read: false,
			}
			data.push(msgData)
			console.log('*', data);
			fs.writeFileSync($file, JSON.stringify(data), 'utf8' );

			wss.broadcast(JSON.stringify(data));
		}
		// wss.broadcast
		// wss.clients.forEach(function each(client) {
		// 	console.log("client",client,WebSocket.OPEN)
    //   if (client !== ws && client.readyState === WebSocket.OPEN) {
    //     client.send(data);
    //   }
    // });
	});    
})

wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  };

/*
setInterval(function(){
    if(wss.clients.size > 0){                
        wss.broadcast(JSON.stringify({
        	type:'br',
        	value:cnt++
        }));
    }
},500);
*/