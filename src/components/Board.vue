<template>
  <div style="background-color: rgba(0, 0, 0, .77)">
    <div class="board">
      <transition nmae="slide-fade">
        <div v-if="show"  style="display:inline;">
          <div style="padding:10px 10px;display:flex;">
            <div class="bead-p">P</div>
            <div style="color: white;display:flex;-webkit-box-align: center;-ms-flex-align: center;align-items: center;">{{pWinCnt}}</div>
            <div class="bead-b">B</div>
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
            <div style="position:absolute;right:12px;display: inline-flex;color: white;font-size: 20px;line-height: 28px;">
              <div style="display: inline-flex;" @mouseenter="onMouseEnter('P')" @mouseleave="onMouseLeave('P')">
              P
              <div v-if="prdtPResult.result1" class="bead-border-b"></div>
              <div v-else class="bead-border-p"></div>
              <div v-if="prdtPResult.result2" class="bead-b"></div>
              <div v-else class="bead-p"></div>
              <div v-if="prdtPResult.result3" class="cockroah-true"></div>
              <div v-else class="cockroah-false"></div>
            </div>
            <div style="display: inline-flex;" @mouseenter="onMouseEnter('B')" @mouseleave="onMouseLeave('B')">
              B
              <div v-if="prdtBResult.result1" class="bead-border-b"></div>
              <div v-else class="bead-border-p"></div>
              <div v-if="prdtBResult.result2" class="bead-b"></div>
              <div v-else class="bead-p"></div>
              <div v-if="prdtBResult.result3" class="cockroah-true"></div>
              <div v-else class="cockroah-false"></div>
            </div>
            </div>
          </div>
          <div class="rectanges" style="margin:0 5px;position: relative;width:240px;height:120px;left:0px;bottom:0;background:rgba(255,255,255,0.9);border:1px solid #666;overflow-x: auto;overflow-y: hidden; display:inline;float:left;">
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
        <div v-dragscroll.x='true' class="rectanges" style="cursor: grab;position: relative;width:420px;height:120px;bottom:0;background:rgba(255,255,255,0.9);border:1px solid #666;overflow: hidden;display:inline;float:left;">
          <div class="col" v-for="(count, i) in bigRoad" :style="{
              position:'absolute',
              height:'100%',
              width:'20px',
              top: count.top+'px',
              left: count.left+'px',
            }"
            :key="i">
            <div v-if="count.winner=='P'" :class="count.prdt?'is-p-player blinking':'is-p-player'">
              <div v-if="count.bPair" class="b-pair"></div>
              <div v-if="count.pPair" class="p-pair"></div>
              <div v-if="count.isTie > 1" class="is-tie">
                {{count.isTie}}
              </div>
              <div v-if="count.isTie > 0" class="is-tie-line"></div>
            </div>
            <div v-else-if="count.winner=='B'" :class="count.prdt?'is-b-player blinking':'is-b-player'">
              <div v-if="count.bPair" class="b-pair"></div>
              <div v-if="count.pPair" class="p-pair"></div>
              <div v-if="count.isTie > 1" class="is-tie">
                {{count.isTie}}
              </div>
              <div v-if="count.isTie > 0" class="is-tie-line"></div>
            </div>
						<div v-else-if="count.winner=='T'" class="is-tie is-tie-line">
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
				<div v-dragscroll.x='true' class="rectanges" style="cursor: grab;position: relative;width:600px;height:60px;bottom:1;background:rgba(255,255,255,0.9);border:1px solid #666;overflow: hidden;display:inline;float:left;">
					<div class="col" v-for="(count, i) in bigEyeRoad" :style="{
              position:'absolute',
              height:'100%',
              width:'20px',
              top: count.top+'px',
              left: count.left+'px',
            }"
            :key="i">
            <div v-if="count.result"  :class="count.prdt?'is-eye-true blinking':'is-eye-true'">
            </div>
            <div v-else :class="count.prdt?'is-eye-false blinking':'is-eye-false'">
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
        <div v-dragscroll.x='true' class="rectanges" style="cursor: grab;position: relative;width:300px;height:60px;bottom:1;background:rgba(255,255,255,0.9);border:1px solid #666;overflow: hidden;float:left;">
					<div class="col" v-for="(count, i) in smallRoad" :style="{
              position:'absolute',
              height:'100%',
              width:'20px',
              top: count.top+'px',
              left: count.left+'px',
            }"
            :key="i">
            <div v-if="count.result" :class="count.prdt?'is-small-true blinking':'is-small-true'">
            </div>
            <div v-else  :class="count.prdt?'is-small-false blinking':'is-small-false'">
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
        <div v-dragscroll.x='true' class="rectanges" style="cursor: grab;position: relative;width:300px;height:60px;bottom:1;background:rgba(255,255,255,0.9);border:1px solid #666;overflow: hidden;">
					<div class="col" v-for="(count, i) in cockroahRoad" :style="{
              position:'absolute',
              height:'100%',
              width:'20px',
              top: count.top+'px',
              left: count.left+'px',
            }"
            :key="i">
            <div v-if="count.result" :class="count.prdt?'is-cockroah-true blinking':'is-cockroah-true'">
            </div>
            <div v-else :class="count.prdt?'is-cockroah-false blinking':'is-cockroah-false'">
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
  props: {
    roomId: Number
  },
  data() {
    return {
      round:1,
      show: true,
      winners: [],
      tempBigRoad: [],
      delta:20,
      mouseOverValue: '',
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
    roads: function (){
      let road = []

      this.winners.forEach((data,idx)=> {
        //console.log(data)
        const winner = data.winner
        const winning = data.winning
        const col = data.col
        if(winner!='T'){
          if(winning==1){
            const result = []
            result.push(winner)
            road.push(result)
          }else{
            road[col].push(winner)
          }
        }
      })
      return road
    },
    //Player가 이길 경우
    pPrdtRoad: function () {
      const road = _.cloneDeep(this.roads)
      const lastCol = _.last(road)
      const last = _.last(lastCol)

      let winner = 'P'

      if(last=='B'){
        const result = []
        result.push(winner)
        road.push(result)
      }else{
        lastCol.push(winner)
      }
      return road
    },
    //Banker가 이길 경우
    bPrdtRoad: function () {
      const road = _.cloneDeep(this.roads)
      const lastCol = _.last(road)
      const last = _.last(lastCol)

      let winner = 'B'

      if(last=='P'){
        const result = []
        result.push(winner)
        road.push(result)
      }else{
        lastCol.push(winner)
      }
      return road
    },
    //본매 표시
    bigRoad: function() {
      let road = []
      let bigTop = 0
      let bigLeft = 0

      let winners = _.cloneDeep(this.winners)

      if(this.mouseOverValue!=''){
        const winner = _.last(winners).winner
        let winning = _.last(winners).winning

        if(winner==this.mouseOverValue){
          winning++
        }
        winners.push(
          {
            winner: this.mouseOverValue,
            bPair:false,
            pPair:false,
            winning: winning,
            prdt: true,
          }  
        )
      }

      winners.forEach((data,idx)=> {
        //console.log(data,idx)
        const winner = data.winner
        let winning = 1
        let lastWinner = ''
        const prdt = data.prdt?true:false
        if(winners[idx-1]){
          lastWinner = this.winners[idx-1].lastWinner
          winning = this.winners[idx-1].winning
        }

        
        const bPair = data.bPair
        const pPair = data.pPair

        if(idx==0){
          if(winner=='T'){
            road.push( {
              top: 0,
              left: 0,
              winner: winner,
              bPair:bPair,
              pPair:pPair,
              isTie:1,
              prdt:prdt,
            })
          }
        }else if(winner=='T'){
          const lastRoad = _.last(this.tempBigRoad)
          lastRoad.isTie++
          if(bPair)
            lastRoad.bPair = bPair
          if(pPair)
            lastRoad.pPair = pPair
        }else if(lastWinner == winner){
          if(winning<=5)
            bigTop = bigTop+20
          else
            bigLeft = bigLeft+20
        }else{
          if(lastWinner=='T'){
            const lastRoad = _.last(this.tempBigRoad)
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
              bigLeft = bigLeft-cnt+20
            }else{
              bigLeft = bigLeft+20
              
            }
            bigTop = 0
          }
        }

        if(winner!='T'){
          road.push(
            {
              top: bigTop,
              left: bigLeft,
              winner: winner,
              bPair:bPair,
              pPair:pPair,
              isTie:0,
              prdt:prdt,
            }
          )
        }
        this.tempBigRoad = road
      })
      return road
    },
    //중국점1
    bigEyeRoad: function () {
      const bigEyeRoad = []

      let left = 0
      let top = 0
      let winning = 1
      let last = null
      
      let road = this.roads

      if(this.mouseOverValue=='P'){
        road = this.pPrdtRoad
      }else if(this.mouseOverValue=='B'){
        road = this.bPrdtRoad
      }

      road.forEach((data,idx) => {
        road[idx].forEach((row,j)=>{

          const res = {
            top: 0,
            left: 0,
            result: false,
            prdt: false
          }

          if(idx==1){
            if(data.length >= 2){
              if(j >= 1){
                const cols =road[idx-1]
                if(cols[j] === cols[j-1]){
                  res.result = true
                }
              }
            }
          }else if(idx>1){
            if(j==0){
              if(road[idx-1].length==road[idx-2].length)
                res.result = true
            }else{
              const cols =road[idx-1]
                if(cols[j] === cols[j-1]){
                  res.result = true
                }
            }
          }
          if(idx>1|| (idx==1&&j>=1)){
            if(last== null){
            }else if(last==res.result){
              if(winning >= 6){
                left = left+10
              }else{
                top = top+10
              }
              winning++
            }else{
              if(winning>6){
                let cnt = 0
                cnt = (winning - 6)*10
                if(cnt != 0){
                  left = left-cnt+10
                }else{
                  left = left+10                  
                }
              }else{
                left = left+10
              }
              top = 0
              //this.eyeLeft = this.eyeLeft+10
              winning =1
            }
            res.top = top
            res.left = left

            last = res.result
            
            bigEyeRoad.push(res)
          }
        })
      })

      if(this.mouseOverValue!=''){
        if(bigEyeRoad.length > 0){
          _.last(bigEyeRoad).prdt =true
        }
      }

      return bigEyeRoad
    },
    //중국점2
    smallRoad: function () {
      const smallRoad = []

      let left = 0
      let top = 0
      let winning = 1
      let last = null

      let road = this.roads

      if(this.mouseOverValue=='P'){
        road = this.pPrdtRoad
      }else if(this.mouseOverValue=='B'){
        road = this.bPrdtRoad
      }

      road.forEach((data,idx) => {
        road[idx].forEach((row,j)=>{

          const res = {
            top: 0,
            left: 0,
            result: false,
            prdt: false
          }

          if(idx==2){
            if(data.length >= 2){
              if(j >= 1){
                const cols =road[idx-2]
                if(cols[j] === cols[j-1]){
                  res.result = true
                }
              }
            } 
          }else if(idx>2){
            if(j==0){
              if(road[idx-1].length==road[idx-3].length)
                res.result = true
            }else{
              const cols =road[idx-2]
                if(cols[j] === cols[j-1]){
                  res.result = true
                }
            }
          }
          if(idx>2|| (idx==2&&j>=1)){
            if(last== null){
            }else if(last==res.result){
              if(winning >= 6){
                left = left+10
              }else{
                top = top+10
              }
              winning++
            }else{
              if(winning>6){
                let cnt = 0
                cnt = (winning - 6)*10
                if(cnt != 0){
                  left = left-cnt+10
                }else{
                  left = left+10                  
                }
              }else{
                left = left+10
              }
              top = 0
              //this.eyeLeft = this.eyeLeft+10
              winning =1
            }
            res.top = top
            res.left = left

            last = res.result
            
            smallRoad.push(res)
          }
        })
      })

      if(this.mouseOverValue!=''){
        if(smallRoad.length > 0) {
          _.last(smallRoad).prdt =true
        }
      }

      return smallRoad
    },
    //중국점3
    cockroahRoad: function () {
      const cockroahRoad = []

      let left = 0
      let top = 0
      let winning = 1
      let last = null

      let road = this.roads

      if(this.mouseOverValue=='P'){
        road = this.pPrdtRoad
      }else if(this.mouseOverValue=='B'){
        road = this.bPrdtRoad
      }

      road.forEach((data,idx) => {
        road[idx].forEach((row,j)=>{

          const res = {
            top: 0,
            left: 0,
            result: false,
            prdt: false,
          }

          if(idx==3){
            if(data.length >= 2){
              if(j >= 1){
                const cols =road[idx-3]
                if(cols[j] === cols[j-1]){
                  res.result = true
                }
              }
            } 
          }else if(idx>3){
            if(j==0){
              if(road[idx-1].length==road[idx-4].length)
                res.result = true
            }else{
              const cols =road[idx-3]
                if(cols[j] === cols[j-1]){
                  res.result = true
                }
            }
          }
          if(idx>3|| (idx==3&&j>=1)){
            if(last== null){
            }else if(last==res.result){
              if(winning >= 6){
                left = left+10
              }else{
                top = top+10
              }
              winning++
            }else{
              if(winning>6){
                let cnt = 0
                cnt = (winning - 6)*10
                if(cnt != 0){
                  left = left-cnt+10
                }else{
                  left = left+10                  
                }
              }else{
                left = left+10
              }
              top = 0
              winning =1
            }
            res.top = top
            res.left = left

            last = res.result
            
            cockroahRoad.push(res)
          }
        })
      })

      if(this.mouseOverValue!=''){
        if(cockroahRoad.length > 0) {
          _.last(cockroahRoad).prdt =true
        }
      }

      return cockroahRoad
    },
    //다음 판 Player가 승리할 경우 중국점1,2,3 예상하기
    prdtPResult: function(){

        const road = _.cloneDeep(this.roads)
        const lastCol = _.last(road)
        const last = _.last(lastCol)
  
        let winner = 'P'
  
        if(last=='B'||road.length==0){
          const result = []
          result.push(winner)
          road.push(result)
        }else{
          //console.log(lastCol)
          lastCol.push(winner)
        }
  
        let idx =road.length -1
        const data = _.last(road)
        const j = data.length-1
        let result1 = false
        let result2 = false
        let result3 = false
        
        if(idx==1){
          if(data.length >= 2){
            if(j >= 1){
              const cols =road[idx-1]
              if(cols[j] === cols[j-1]){
                result1 = true
              }
            }
          }
        }else if(idx>1){
          if(j==0){
            if(road[idx-1].length==road[idx-2].length)
              result1 = true
          }else{
            const cols =road[idx-1]
              if(cols[j] === cols[j-1]){
                result1 = true
              }
          }
        }
  
        if(idx==2){
          if(data.length >= 2){
            if(j >= 1){
              const cols =road[idx-2]
              if(cols[j] === cols[j-1]){
                result2 = true
              }
            }
          } 
        }else if(idx>2){
          if(j==0){
            if(road[idx-1].length==road[idx-3].length)
              result2 = true
          }else{
            const cols =road[idx-2]
              if(cols[j] === cols[j-1]){
                result2 = true
              }
          }
        }
  
        if(idx==3){
          if(data.length >= 2){
            if(j >= 1){
              const cols =road[idx-3]
              if(cols[j] === cols[j-1]){
                result3 = true
              }
            }
          } 
        }else if(idx>3){
          if(j==0){
            if(road[idx-1].length==road[idx-4].length)
              result3 = true
          }else{
            const cols =road[idx-3]
              if(cols[j] === cols[j-1]){
                result3 = true
              }
          }
        }
  
        return {result1,result2,result3}
      
    },
    //다음판 Banker가 승리할 경우 중국점1,2,3 예상하기
    prdtBResult: function(){

        const road = _.cloneDeep(this.roads)
        const lastCol = _.last(road)
        const last = _.last(lastCol)
  
        let winner = 'B'
  
        if(last=='P'||road.length==0){
          const result = []
          result.push(winner)
          road.push(result)
        }else{
          lastCol.push(winner)
        }
  
        let idx =road.length -1
        const data = _.last(road)
        const j = data.length-1
        let result1 = false
        let result2 = false
        let result3 = false
        
        if(idx==1){
          if(data.length >= 2){
            if(j >= 1){
              const cols =road[idx-1]
              if(cols[j] === cols[j-1]){
                result1 = true
              }
            }
          }
        }else if(idx>1){
          if(j==0){
            if(road[idx-1].length==road[idx-2].length)
              result1 = true
          }else{
            const cols =road[idx-1]
              if(cols[j] === cols[j-1]){
                result1 = true
              }
          }
        }
  
        if(idx==2){
          if(data.length >= 2){
            if(j >= 1){
              const cols =road[idx-2]
              if(cols[j] === cols[j-1]){
                result2 = true
              }
            }
          } 
        }else if(idx>2){
          if(j==0){
            if(road[idx-1].length==road[idx-3].length)
              result2 = true
          }else{
            const cols =road[idx-2]
              if(cols[j] === cols[j-1]){
                result2 = true
              }
          }
        }
  
        if(idx==3){
          if(data.length >= 2){
            if(j >= 1){
              const cols =road[idx-3]
              if(cols[j] === cols[j-1]){
                result3 = true
              }
            }
          } 
        }else if(idx>3){
          if(j==0){
            if(road[idx-1].length==road[idx-4].length)
              result3 = true
          }else{
            const cols =road[idx-3]
              if(cols[j] === cols[j-1]){
                result3 = true
              }
          }
        }
  
        return {result1,result2,result3}
      
    }
  },
  methods: {
    viewScore(data){
      const rn = this.$_.split(data,',')
        //console.log(rn)

      let tempWinner= '';
      let round = this.winners.length+1

      let lastWinner = ''
      let winning = 1
      let beadTop = 0
      let beadLeft = 0
      let col = 0
      if(this.winners.length !=0){
        lastWinner = _.last(_.cloneDeep(this.winners)).lastWinner
        winning =  _.last(_.cloneDeep(this.winners)).winning
        beadTop =  _.last(_.cloneDeep(this.winners)).top
        beadLeft =  _.last(_.cloneDeep(this.winners)).left
        col =  _.last(_.cloneDeep(this.winners)).col
      }

      const winner = rn[0]
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
      }else if(winner=='T'){
      }else if(lastWinner == winner){
        winning++
      }else{
				if(lastWinner=='T'){
				}else{
					winning = 1
				  col++
				}
      }

      if(round==1){
      }else if((round-1)%6==0){
        beadTop = 0
        beadLeft = beadLeft+20
      }else{
        beadTop = beadTop+20
      }
      //this.round
			this.winners.push(
				{
          round: this.round,
          top: beadTop ,
          left: beadLeft,
					winner: winner,
          bPair:bPair,
          pPair:pPair,
          lastWinner: winner=='T'?lastWinner:winner,
          winning: winning,
          col: col,
        }
      )     
      
    },
    setRound(message) {
      //console.log('setRound',message)
      let minus= -1
      if(message.state=='dealing::chain'){
        minus=0
      }
      console.log("minus",minus)
      message.bead_load.some((data,i) => {
        if(i==message.round+minus){
          return true
        }
        this.viewScore(data)
      })
    },
    nextRound(message) {
      //this.
      //console.log("nextRound",message)
      this.viewScore(message.bead)
    },
    setState(message) {
      //console.log(message)
      if(message.state == 'betting'){
        //this.round++
      }
    },
    onMouseEnter(data) {
      this.mouseOverValue = data
    },
    onMouseLeave(data) {
      this.mouseOverValue = ''
    },
    setInit(){
      this.winners = []
    },
    getWinner(){
      return _.last(this.winners).winner
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

.bead-border-p {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid blue;
}

.bead-border-b {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid red;
}

.cockroah-true {
  width: 28px;
  height: 1px;
  position: relative;
  top: 13px;
  background-color: red;
  transform: rotate(-45deg);
  -ms-transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
}

.cockroah-false {
  width: 28px;
  height: 1px;
  position: relative;
  top: 13px;
  background-color: blue;
  transform: rotate(-45deg);
  -ms-transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
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

.blinking{
	-webkit-animation:blink 1.5s ease-in-out infinite alternate;
  -moz-animation:blink 1.5s ease-in-out infinite alternate;
  animation:blink 1.5s ease-in-out infinite alternate;
}

@-webkit-keyframes blink{
    0% {opacity:1;}
    100% {opacity:0;}
}
@-moz-keyframes blink{
    0% {opacity:1;}
    100% {opacity:0;}
}
@keyframes blink{
    0% {opacity:1;}
    100% {opacity:0;}
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
