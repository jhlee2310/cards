<template>
  <div style="background-color: rgba(0, 0, 0, .77); height:300px">
    <div class="board">
      <transition nmae="slide-fade">
        <div v-if="show"  style="display:inline;">
          <div style="padding:10px 10px;display:flex;">
            <div class="bead-p" @mouseenter="onMouseEnter('P')" @mouseleave="onMouseLeave('P')">P</div>
            <div style="color: white;display:flex;-webkit-box-align: center;-ms-flex-align: center;align-items: center;">{{pWinCnt}}</div>
            <div class="bead-b" @mouseenter="onMouseEnter('B')" @mouseleave="onMouseLeave('B')">B</div>
            <div style="color: white;display:flex;-webkit-box-align: center;-ms-flex-align: center;align-items: center;">{{bWinCnt}}</div>
            <div class="bead-t">T</div>
            <div style="color: white;display:flex;-webkit-box-align: center;-ms-flex-align: center;align-items: center;">{{tWinCnt}}</div>
            <div class="bead-other">
              <div class="small_red"></div>
            </div>
            <div style="color: white;display:flex;-webkit-box-align: center;-ms-flex-align: center;align-items: center;">{{bPairCnt}}</div>
            <div class="bead-other">
              <div class="small_blue"></div>
            </div>
            <div style="color: white;display:flex;-webkit-box-align: center;-ms-flex-align: center;align-items: center;">{{pPairCnt}}</div>
          </div>
          <div class="rectanges" style="margin:0 5px;position: relative;width:240px;height:139px;left:0px;bottom:0;background:rgba(255,255,255,0.9);border:1px solid #666;overflow-x: auto;overflow-y: hidden; display:inline;float:left;">
          <div class="col" v-for="(count, i) in winners" :style="{
              position:'absolute',
              height:'100%',
              width:'20px',
              top: count.top+'px',
              left: count.left+'px',
            }"
            :key="i">
            <div v-if="count.winner=='P'" class="beadRoad-p">
              P
              <div v-if="count.bPair" class="b-pair"></div>
              <div v-if="count.pPair" class="p-pair"></div>
            </div>
            <div v-if="count.winner=='B'" class="beadRoad-b">
              B
              <div v-if="count.bPair" class="b-pair"></div>
              <div v-if="count.pPair" class="p-pair"></div>
            </div>
						<div v-if="count.winner=='T'" class="beadRoad-t">
              T
              <div v-if="count.bPair" class="b-pair"></div>
              <div v-if="count.pPair" class="p-pair"></div>
            </div>
            <!-- <img src="@/assets/logo.png"> -->
          </div>
          <svg height="121" width="240">
            <line v-for="i in 6" x1="0" :y1="i*20" x2="240" :y2="i*20" :style="{
              'stroke':'rgb(0,0,0)',
              //'stroke-width':i==6?'2':'1'
              'stroke-width':'1'
            }" :key="`row${i}`"/>
            <line v-for="i in 12" :x1="i*20" y1="0" :x2="i*20" y2="121" :style="{
              'stroke':'rgb(0,0,0)',
              //'stroke-width':i%2==0?'2':'1'
              'stroke-width':'1'
              }" :key="`col${i}`"/>
          </svg>
        </div>
        <div class="rectanges" style="position: relative;width:420px;height:139px;bottom:0;background:rgba(255,255,255,0.9);border:1px solid #666;overflow-x: auto;overflow-y: hidden;display:inline;float:left;">
          <div class="col" v-for="(count, i) in bigRoad" :style="{
              position:'absolute',
              height:'100%',
              width:'20px',
              top: count.top+'px',
              left: count.left+'px',
            }"
            :key="i">
            <div v-if="count.winner=='P'" class="is-p-player">
              <div v-if="count.bPair" class="b-pair"></div>
              <div v-if="count.pPair" class="p-pair"></div>
              <div v-if="count.isTie > 0" class="is-tie">
                {{count.isTie}}
              </div>
              <div v-if="count.isTie > 0" class="is-tie-line"></div>
            </div>
            <div v-if="count.winner=='B'" class="is-b-player">
              <div v-if="count.bPair" class="b-pair"></div>
              <div v-if="count.pPair" class="p-pair"></div>
              <div v-if="count.isTie > 0" class="is-tie">
                {{count.isTie}}
              </div>
              <div v-if="count.isTie > 0" class="is-tie-line"></div>
            </div>
						<div v-if="count.winner=='T'" class="is-tie is-tie-line">
                {{count.isTie}}
            </div>
            <!-- <img src="@/assets/logo.png"> -->
          </div>
          <svg height="121" width="800">
            <line v-for="i in 6" x1="0" :y1="i*delta" x2="800" :y2="i*delta" :style="{
              'stroke':'rgb(0,0,0,0.5)',
              'stroke-width':i==6?'2':'0.5'
              //'stroke-width':'1'
            }" :key="`row${i}`"/>
            <line v-for="i in 40" :x1="i*delta" y1="0" :x2="i*delta" y2="121" :style="{
              'stroke':'rgb(0,0,0,0.5)',
              //'stroke-width':i%2==0?'2':'1'
              'stroke-width':'1'
              }" :key="`col${i}`"/>
          </svg>
        </div>
				<div class="rectanges" style="position: relative;width:600px;height:78px;bottom:1;background:rgba(255,255,255,0.9);border:1px solid #666;overflow-x: auto;overflow-y: hidden;display:inline;float:left;">
					<div class="col" v-for="(count, i) in bigEyeRoad" :style="{
              position:'absolute',
              height:'100%',
              width:'20px',
              top: count.top+'px',
              left: count.left+'px',
            }"
            :key="i">
            <div v-if="count.result" class="is-eye-true">
            </div>
            <div v-else class="is-eye-false">
            </div>
            <!-- <img src="@/assets/logo.png"> -->
          </div>
          <svg height="61" width="800">
            <line v-for="i in 3" x1="0" :y1="i*delta" x2="800" :y2="i*delta" :style="{
              'stroke':'rgb(0,0,0,0.5)',
              'stroke-width':i==3|| i==0?'2':'0.5'
              //'stroke-width':'1'
            }" :key="`row${i}`"/>
            <line v-for="i in 40" :x1="i*delta" y1="0" :x2="i*delta" y2="61" :style="{
              'stroke':'rgb(0,0,0,0.5)',
              //'stroke-width':i==30?'2':'1'
              'stroke-width':'1'
              }" :key="`col${i}`"/>
          </svg>
        </div>
        <div class="rectanges" style="position: relative;width:300px;height:78px;bottom:1;background:rgba(255,255,255,0.9);border:1px solid #666;overflow-x: auto;overflow-y: hidden;float:left;">
					<div class="col" v-for="(count, i) in smallRoad" :style="{
              position:'absolute',
              height:'100%',
              width:'20px',
              top: count.top+'px',
              left: count.left+'px',
            }"
            :key="i">
            <div v-if="count.result" class="is-small-true">
            </div>
            <div v-else class="is-small-false">
            </div>
            <!-- <img src="@/assets/logo.png"> -->
          </div>
          <svg height="61" width="800">
            <line v-for="i in 3" x1="0" :y1="i*delta" x2="800" :y2="i*delta" :style="{
              'stroke':'rgb(0,0,0,0.5)',
              'stroke-width':i==3|| i==0?'2':'0.5'
              //'stroke-width':'1'
            }" :key="`row${i}`"/>
            <line v-for="i in 40" :x1="i*delta" y1="0" :x2="i*delta" y2="61" :style="{
              'stroke':'rgb(0,0,0,0.5)',
              //'stroke-width':i==30?'2':'1'
              //'stroke-width':'1'
              }" :key="`col${i}`"/>
          </svg>
        </div>
        <div class="rectanges" style="position: relative;width:300px;height:78px;bottom:1;background:rgba(255,255,255,0.9);border:1px solid #666;overflow-x: auto;overflow-y: hidden;">
					<div class="col" v-for="(count, i) in cockroahRoad" :style="{
              position:'absolute',
              height:'100%',
              width:'20px',
              top: count.top+'px',
              left: count.left+'px',
            }"
            :key="i">
            <div v-if="count.result" class="is-cockroah-true">
            </div>
            <div v-else class="is-cockroah-false">
            </div>
            <!-- <img src="@/assets/logo.png"> -->
          </div>
          <svg height="61" width="800">
            <line v-for="i in 3" x1="0" :y1="i*delta" x2="800" :y2="i*delta" :style="{
              'stroke':'rgb(0,0,0,0.5)',
              //'stroke-width':i==3|| i==0?'2':'1'
              'stroke-width':'0.5'
            }" :key="`row${i}`"/>
            <line v-for="i in 40" :x1="i*delta" y1="0" :x2="i*delta" y2="61" :style="{
              'stroke':i==40?'rgb(0,0,0)':'rgb(0,0,0,0.5)',
              'stroke-width':i==40?'2':'1'
              //'stroke-width':'1'
              }" :key="`col${i}`"/>
          </svg>
        </div>
        </div>
      </transition>
      </div>
    <div class="control">
      <!-- <button @click="click">click</button> -->
      <button @click="show = !show">
        toggle
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Board',
  // props: {
  //   round: Number
  // },
  data() {
    return {
      round:1,
      show: true,
      winners: [],
			bigRoad: [],
      bigEyeRoad: [],
      smallRoad: [],
      cockroahRoad: [],
			road:[],
      lastEye: false, 
      lastSmall: false,
      lastCockroah:false,
      left: 0,
			top: 0,
			eyeLeft: 0,
      eyeTop: 0,
			smallLeft: 0,
      smallTop: 0,
      cockroahLeft: 0,
      cockroahTop: 0,
      eyeWinning:1,
      smallWinning:1,
      cockroahWinning:1,
      col: 0,
      delta:20,
      mouseFlg: false,
      tempData: '',
    }
  },
  computed: {
    pWinCnt: function (){
      const result = this.winners.filter(data=>{
        return data.winner == 'P'
      })
      return result.length
    },
    bWinCnt: function (){
      const result = this.winners.filter(data=>{
        return data.winner == 'B'
      })
      return result.length
    },
    tWinCnt: function (){
      const result = this.winners.filter(data=>{
        return data.winner == 'T'
      })
      return result.length
    },
    bPairCnt: function (){
      const result = this.winners.filter(data=>{
        return data.bPair == true
      })
      return result.length
    },
    pPairCnt: function (){
      const result = this.winners.filter(data=>{
        return data.pPair == true
      })
      return result.length
    },
  },
  methods: {
    viewScore(data){
      let prdt = false
      
      const rn = this.$_.split(data,',')
        //console.log(rn)
      const lastData ="";
      if(rn[2]==99){
        this.winners
        prdt = true
      }else if(rn[2]== -99){
        this.winners = _.dropRight(this.winners)
      }else if(this.mouseFlg){
        this.winners = _.dropRight(this.winners)
      }

      let lastWinner = ''
      let winning = 1
      let beadTop = 0
      let beadLeft = 0
      let col = 0
      if(this.winners.length !=0){
        lastWinner = _.last(_.clone(this.winners)).lastWinner
        winning =  _.last(_.clone(this.winners)).winning
        beadTop =  _.last(_.clone(this.winners)).top
        beadLeft =  _.last(_.clone(this.winners)).left
        col =  _.last(_.clone(this.winners)).col
      }

      const winner = rn[0]
      //let cnt = this.winners.lengh -1

      const pair = rn[1]

      let bPair = false
      let pPair = false

      if(pair == 2){
        bPair = true
      }else if(pair ==1){
        pPair = true
      }else if(pair ==3){
        bPair = true
        pPair = true
      }

      if(lastWinner==''){
				lastWinner = winner
				if(winner=='T'){
						this.bigRoad.push(
						{
							top: 0,
							left: 0,
							winner: winner,
							bPair:bPair,
							pPair:pPair,
							isTie:1,
						}
					)
				}
      }else if(winner=='T'){
				const lastRoad = _.last(this.bigRoad)
				lastRoad.isTie++
				if(bPair)
					lastRoad.bPair = bPair
				if(pPair)
					lastRoad.pPair = pPair

      }else if(lastWinner == winner){
        winning++
        if(winning<=6)
          this.top = this.top+20
        else
					this.left = this.left+20
      }else{
				if(lastWinner=='T'){
					const lastRoad = _.last(this.bigRoad)
					lastRoad.winner = winner
					if(bPair)
						lastRoad.bPair = bPair
					if(pPair)
						lastRoad.pPair = pPair
				}else{
					let cnt = 0
					if(winning>6){
						cnt = (winning - 6)*20
					}
					if(cnt != 0){
						this.left = this.left-cnt+20
					}else{
						this.left = this.left+20
						
					}
					winning = 1
					this.top = 0
				}
				col++
      }

      if(this.round==1){
      }else if((this.round-1)%6==0){
        beadTop = 0
        beadLeft = beadLeft+20
      }else{
        beadTop = beadTop+20
      }
      //this.round
			this.winners.push(
				{
          top: beadTop,
          left: beadLeft,
					winner: winner,
          bPair:bPair,
          pPair:pPair,
          prdt: prdt,
          lastWinner: winner=='T'?lastWinner:winner,
          winning:winning,
          col: col
        }
      )

      if(winner!='T'){
				this.bigRoad.push(
					{
						top: this.top,
						left: this.left,
						winner: winner,
						bPair:bPair,
						pPair:pPair,
						isTie:0,
					}
				)
				if(winning==1){
					const result = []
					result.push(winner)
					this.road.push(result)
				}else{
					//console.log(col)
					this.road[col].push(winner)
				}
				if((this.road[1]&&this.road[1].length >= 2) || this.road[2]){
					const data = {
						top: 0,
						left: 0,
						result: false
					}
					//console.log(lastWinner,winner)
					if(lastWinner == winner){
            const lenght = this.road[col].length
						const cols =this.road[col-1]
						if(cols[lenght-1] === cols[lenght-2])
							data.result=true
						//console.log(col, cols,data.result)
					}else{
            if(this.road[col-1].length==this.road[col-2].length)
							data.result=true
					}
          //console.log("this.lastEye",this.lastEye,this.road.length)
          if(!((this.road.length==2 && this.road[1].length == 2)||(this.road.length == 3 && this.road[2].length == 1 && this.road[1].length == 1))){
						if(this.lastEye==data.result){
              if(this.eyeWinning >= 6){
                this.eyeLeft = this.eyeLeft+10
              }else{
                this.eyeTop = this.eyeTop+10
              }
							this.eyeWinning++
						}else{
              if(this.eyeWinning>6){
                let cnt = 0
                cnt = (this.eyeWinning - 6)*10
                if(cnt != 0){
                  this.eyeLeft = this.eyeLeft-cnt+10
                }else{
                  this.eyeLeft = this.eyeLeft+10                  
                }
              }else{
                this.eyeLeft = this.eyeLeft+10
              }
							this.eyeTop = 0
							//this.eyeLeft = this.eyeLeft+10
							this.eyeWinning =1
						}
          }
          data.top = this.eyeTop
          data.left = this.eyeLeft


          this.lastEye = data.result
          

					this.bigEyeRoad.push(data)
        }
        if((this.road[2] && this.road[2].length >= 2) || this.road[3]){
					const data = {
						top: 0,
						left: 0,
						result: false
					}
					if(lastWinner == winner){
            const length = this.road[col].length
						const cols =this.road[col-2]
						if(cols[length-1] === cols[length-2])
							data.result=true
						//console.log(col, cols,data.result)
					}else{
            if(this.road[col-1].length==this.road[col-3].length)
							data.result=true
					}
          //console.log("this.lastSmall",this.lastSmall,this.road.length)
          if(!((this.road.length==3 && this.road[2].length == 2) || (this.road.length == 4 && this.road[3].length == 1 && this.road[2].length == 1))){
						if(this.lastSmall==data.result){
              if(this.smallWinning >= 6){
                this.smallLeft = this.smallLeft+10
              }else{
                this.smallTop = this.smallTop+10
              }
							this.smallWinning++
						}else{
              if(this.smallWinning > 6){
                let cnt = 0
                cnt = (this.smallWinning - 6)*10
                if(cnt != 0){
                  this.smallLeft = this.smallLeft-cnt+10
                }else{
                  this.smallLeft = this.smallLeft+10                  
                }
              }else{
                this.smallLeft = this.smallLeft+10
              }
							this.smallTop = 0
							//this.eyeLeft = this.eyeLeft+10
							this.smallWinning =1
						}
          }
          data.top = this.smallTop
          data.left = this.smallLeft

          this.lastSmall = data.result
          

					this.smallRoad.push(data)
				}
        if((this.road[3] && this.road[3].length >= 2) || this.road[4]){
					const data = {
						top: 0,
						left: 0,
						result: false
					}
					if(lastWinner == winner){
            const length = this.road[col].length
						const cols =this.road[col-3]
						if(cols[length-1] === cols[length-2])
							data.result=true
						//console.log(col, cols,data.result)
					}else{
            if(this.road[col-1].length==this.road[col-4].length)
							data.result=true
					}
          //console.log("this.lastCockroah",this.lastCockroah,this.road.length)
          if(!((this.road.length==4 && this.road[3].length == 2) || (this.road.length == 5 && this.road[4].length == 1 && this.road[3].length == 1))){
						if(this.lastCockroah==data.result){
              if(this.cockroahWinning >= 6){
                this.cockroahLeft = this.cockroahLeft+10
              }else{
                this.cockroahTop = this.cockroahTop+10
              }
							this.cockroahWinning++
						}else{
              if(this.cockroahWinning > 6){
                let cnt = 0
                cnt = (this.cockroahWinning - 6)*10
                if(cnt != 0){
                  this.cockroahLeft = this.cockroahLeft-cnt+10
                }else{
                  this.cockroahLeft = this.cockroahLeft+10                  
                }
              }else{
                this.cockroahLeft = this.cockroahLeft+10
              }
							this.cockroahTop = 0
							//this.eyeLeft = this.eyeLeft+10
							this.cockroahWinning =1
						}
          }
          data.top = this.cockroahTop
          data.left = this.cockroahLeft

          this.lastCockroah = data.result

					this.cockroahRoad.push(data)
				}
        //lastWinner = winner
      }
      this.round++
    },
    setRound(message) {
      console.log('setRound',message)
      // this.viewScore('T,0,9')
      // this.viewScore('T,0,9')
      message.bead_load.some((data,i) => {
        if(i==message.round-1){
          return true
        }
        this.viewScore(data)
      })
    },
    nextRound(message) {
      //this.
      //console.log(message)
      //this.viewScore(message.bead)
    },
    setState(message) {
      //console.log(message)
      if(message.state == 'betting'){
        //this.round++
      }
    },
    onMouseEnter(data) {
      this.mouseFlg = true
      this.tempData = data+",0" 
      this.viewScore(this.tempData+",99")
    },
    onMouseLeave(data) {
      //console.log("onMouseLeave")
      this.mouseFlg = false
      this.tempData = data+",0" 
      this.viewScore(this.tempData+",-99")
    },
    writeBoard(data) {
      const gun =data.gun

      if((this.road[gun]&&this.road[gun].length >= 2) || this.road[gun+1]){
        const data = {
          top: 0,
          left: 0,
          result: false
        }
        //console.log(lastWinner,winner)
        if(lastWinner == winner){
          const lenght = this.road[col].length
          const cols =this.road[col-1]
          if(cols[lenght-1] === cols[lenght-2])
            data.result=true
          //console.log(col, cols,data.result)
        }else{
          if(this.road[col-1].length==this.road[col-2].length)
            data.result=true
        }
        //console.log("this.lastEye",this.lastEye,this.road.length)
        if(!((this.road.length==2 && this.road[1].length == 2)||(this.road.length == 3 && this.road[2].length == 1 && this.road[1].length == 1))){
          if(this.lastEye==data.result){
            if(this.eyeWinning >= 6){
              this.eyeLeft = this.eyeLeft+10
            }else{
              this.eyeTop = this.eyeTop+10
            }
            this.eyeWinning++
          }else{
            if(this.eyeWinning>6){
              let cnt = 0
              cnt = (this.eyeWinning - 6)*10
              if(cnt != 0){
                this.eyeLeft = this.eyeLeft-cnt+10
              }else{
                this.eyeLeft = this.eyeLeft+10                  
              }
            }else{
              this.eyeLeft = this.eyeLeft+10
            }
            this.eyeTop = 0
            //this.eyeLeft = this.eyeLeft+10
            this.eyeWinning =1
          }
        }
        data.top = this.eyeTop
        data.left = this.eyeLeft


        this.lastEye = data.result
        

        this.bigEyeRoad.push(data)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
/**
  ①6매(BEAD ROAD)
  ②원매(BIG ROAD)
  ③중국점1군(BIG EYE ROAD)
  ④중국점2군(SMALL ROAD)
  ⑤중국점3군(COCKROAH ROAD)
**/
/* 애니메이션 진입 및 진출은 다른 지속 시간 및  */
/* 타이밍 기능을 사용할 수 있습니다. */
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}

.beadRoad-b {
  width: 17px;
  height: 17px;
  border-radius: 50%;
  display: inline-flex;
  background-color: red;
  color:white;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  position: relative;
  //margin: 1px;
  //font-size:10px;
}
.beadRoad-p {
  width: 17px;
  height: 17px;
  border-radius: 50%;
  display: inline-flex;
  background-color: blue;
  color: white;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  position: relative;
  //font-size: 13px;
}
.beadRoad-t {
  width: 17px;
  height: 17px;
  border-radius: 50%;
  display: inline-flex;
  background-color: green;
  color:white;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  position: relative;
  //margin: 1px;
  //font-size:10px;
}

.is-b-player {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  margin: 1px;
  border: 1px solid red;
  position: absolute;
}
.is-p-player {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  margin: 1px;
  border: 1px solid blue;
  position: absolute;
}
.is-eye-true {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  /* margin: 1px; */
  border: 1px solid red;
  position: absolute;
}
.is-eye-false {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  /* margin: 1px; */
  border: 1px solid blue;
  position: absolute;
}

.is-small-true {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  /* margin: 1px; */
  background-color: red;
  position: absolute;
}
.is-small-false {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  /* margin: 1px; */
  background-color: blue;
  position: absolute;
}


.b-pair {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  position: absolute;
  top: -1px;
  left: -1px;
  bottom: initial;
  right: initial;
  background-color: #ad1632;
}

.p-pair {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  position: absolute;
  bottom: -1px;
  right: -1px;
  background-color: blue;
}

.is-tie {
  color: #09f974;
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  font-size: 12px;
  font-weight: 600;
}

.is-tie-line {
  position: absolute;
  width: 16px;
  height: 1px;
  top: 11px;
  left: 2px;
  background-color: green;
  transform: rotate(-45deg);
  -ms-transform: rotate(-45deg); /* IE 9 */
  -webkit-transform: rotate(-45deg); /* Safari and Chrome */
}

.bead-p {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  color: white;
  display: inline-flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  position: relative;
  font-size: 13px;
  background: blue;
}

.bead-b {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  color: white;
  display: inline-flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  position: relative;
  font-size: 13px;
  background: red;
}

.bead-other {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    color: white;
     display: inline-flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  position: relative;
    background: #cccccc;
}

.small_blue {
    width: 8px;
    height: 8px;
    position: absolute;
    right: -1px;
    bottom: -1px;
    border-radius: 50%;
    background: blue;
    //border: 1px solid #ab9859;
}

.small_red {
    width: 8px;
    height: 8px;
    position: absolute;
    left: -1px;
    top: -1px;
    border-radius: 50%;
    background: red;
    //border: 1px solid #ab9859;
}

.bead-p-pair {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  position: absolute;
  bottom: 0px;
  right: 2px;
  background-color: blue;
}

.bead-b-pair {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  position: absolute;
  top: 0px;
  left: 2px;
  background-color: #b61010;
}

.bead-t {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  color: white;
  display: inline-flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  position: relative;
  font-size: 13px;
  background: green;
}

.is-cockroah-true {
  position: absolute;
  /* left: -61px; */
  width: 9px;
  height: 1px;
  top:4px;
  background-color: red;
  transform: rotate(-45deg);
  -ms-transform: rotate(-45deg); /* IE 9 */
  -webkit-transform: rotate(-45deg); /* Safari and Chrome */
}

.is-cockroah-false {
  position: absolute;
  /* left: -61px; */
  width: 9px;
  height: 1px;
  top:4px;
  background-color: blue;
  transform: rotate(-45deg);
  -ms-transform: rotate(-45deg); /* IE 9 */
  -webkit-transform: rotate(-45deg); /* Safari and Chrome */
}

::-webkit-scrollbar-thumb:hover {
  background: #555; 
}
::-webkit-scrollbar-track:hover {
  box-shadow: inset 0 0 5px grey;
}
::-webkit-scrollbar-track {
  display:hidden;
}

::-webkit-scrollbar {
  width: 20px;
}

/* Track */
// ::-webkit-scrollbar-track {
//   box-shadow: inset 0 0 5px grey; 
//   border-radius: 10px;
// }
 
// /* Handle */
// ::-webkit-scrollbar-thumb {
//   background: red; 
//   border-radius: 10px;
// }

// /* Handle on hover */
// ::-webkit-scrollbar-thumb:hover {
//   background: #b30000; 
// }
</style>
