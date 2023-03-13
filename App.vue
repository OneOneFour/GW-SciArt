<template>
  <div>
    <div class="control-panel">
      <h1>Wavelike</h1>
      <label for="speed">Speed</label>
      <input type="range" name="speed">
    </div>
    <canvas ref="maincanvas" :width="width" :height="height"></canvas>
  </div>
</template>

<script>
export default{
  name:'App',
  data:()=>({
    loading:false,
    width:undefined,
    height:undefined
  }),
  mounted(){
    this.ctx = this.$refs.maincanvas.getContext('2d');
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  }
}
</script>
<style>
.control-panel{
  display: block;
  width:20%;
  background:white;
  margin-left:2.5rem;
  margin-top:2.5rem;
  padding: 0.5rem 0.6rem;
}
.control-panel h1{
  margin:0;
}
</style>