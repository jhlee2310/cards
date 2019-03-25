<template>
  <div>
    <canvas class="wave_canvas" width="200" height="200" ref="wave_canvas"/>
  </div>
</template>

<script>
export default { 
  props: ['value'],
  data(){
    
    return{
      wave: null,
    }
  },
  methods:{

  },
  beforeDestroy(){
    if(this.handle_interval){
      clearInterval(this.handle_interval)
    }
  },
  watch:{
    value(newV){
      this.wave.setValue(200 - 200 * newV / 100)
    }
  },
  mounted(){
    const that = this;
    this.wave = new ( function(s,w,h,p){
      const canvas = this.canvas = that.$refs.wave_canvas;
      const ctx = this.ctx = canvas.getContext('2d')      
      let start;
      let width;
      let height;
      let speed;

      this.init = (s, w, h, p) => {
        s = 200 - 200 * s / 100
        start = s;
        width = w;
        height = h;
        speed = p;        
      }

      this.setValue = (s) => {
        start = s
      }
      
      this.animate = (delta) => {        
        ctx.beginPath()
        ctx.clearRect(0,0,200,200);
        let offset = delta * speed
        ctx.moveTo( 0, start + height * Math.sin(0 / width+ offset)  )
        for(let i=1;i<=200;i++){
          ctx.lineTo(i, start + height * Math.sin(i/width+ offset ) )
        }
        ctx.lineTo(200,200)
        ctx.lineTo(0,200)
        ctx.closePath()
        ctx.stroke();
        ctx.fillStyle = "#0088ff"
        ctx.fill();
      }

      this.start = ( speed )=>{
        let delta = 0;
        that.handle_interval = setInterval( ()=>{
          this.animate(delta++);          
        }, 30)
      }
      this.init(s,w,h,p); // (start, width, height)
      this.start();
    })(+this.value, 40, 10, 0.2);
  }

}
</script>

<style>
  .wave_canvas{
    border:2px solid #0088ff;
    border-radius:50%;
    width:100px;height:100px;
    overflow:hidden;
    box-sizing:border-box;
  }
</style>
