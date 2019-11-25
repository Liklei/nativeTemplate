
<template>
  <div id="Tips" v-if="tips">
       <div class="tips">
         <img src="../assets/image/create.gif" alt="">
       </div>   
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "Tips",
  computed: {
    ...mapState("Pay", ["tips"])
  },
  methods: {
      ...mapMutations("Pay", ["SET_TIPS"]),
  },
  watch: {
      tips(newval, oldVal) {
          let _that = this;
          if(newval) {
            //  setTimeout(function(){
            //     _that.SET_TIPS();
            //  }, 2000)
          }
      }
  },
};
</script>
<style lang="scss" scoped>
   #Tips{
       transition: all .8s;
       width: 100%;
       height: 100%;
       position: absolute;
       left:0;
       top: 0;
       background-color: rgba(0,0,0,.4);
   }
   .tips{
     img{
       display: inline-block;
       width: 438px;
       height: 302px;
       text-align: center;
       color: #fff;
       position: absolute;
       top: 50%;
       margin-left: 50%;
       transform: translate(-219px,-151px);
       z-index: 100;
     }
    }
</style>