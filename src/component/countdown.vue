<template>
  <div id="countDown" class="countdown">
    <div class="timer">
      <li class="minute">{{min}}</li>
      <span>:</span>
      <li class="second">{{second}}</li>
      <span>:</span>
      <li class="msecond">{{msecond}}</li>
    </div>
  </div>
</template>
<script type='text/ecmascript-6'>
export default {
  name: "countdown",
  props: {
    time: {
      type: [String, Number],
      default: 0
    },
    appCondition: {
      type: [Boolean],
      default: true
    }
  },
  data() {
    return {
      min: 0,
      sec: 0,
      msec: 0,
      timer: null,
      speed: 10,
      sign: true,
    };
  },
  created() {
    this.sign = false;
    this.AppNative.getIosDownTime('',()=>{

    }, (res)=>{
        console.log(res)
    });
    this.downTime();
  },
  mounted() {},
  methods: {
    downTime() {
      this.initTimer();
      this.timer = setInterval(() => {
        this.loadTimer();
      }, this.speed);
    },
    initTimer() {
      if (this.time <= 0) return;
      if (!this.sign && this.appCondition) {
            this.AppNative.getIosDownTime('', ()=>{}, res => {
               if(res && Number(res) < 300) {
                res = Number(res);
                this.min = parseInt(res/60);
                this.sec = res - parseInt(res/60) * 60;
               }else{
                 this.min = this.time - 1;
                 this.sec = 59;
               }
            });
        this.sign = true;
      }
    },
    loadTimer() {
      if (this.sec <= 0 && this.min == 0) {
         this.msec = 0;
         window.localStorage.setItem(
          "time",
          `${this.min},${this.sec},0`
         );
         return
      }

      if (this.sec <= 0 && this.min > 0) {
        this.sec = 59;
        this.min--;
      }

      if (this.msec >= 1000 && this.sec > 0) {
        this.msec = 0;
        this.sec--;
      }

      this.msec = Number(this.msec) + Number(this.speed);
      window.localStorage.setItem(
        "time",
        `${this.min},${this.sec},${this.msec}`
      );
    },
    pauseTimer() {
      clearInterval(this.timer);
      this.timer = null;
    },
    resumeTimer() {
      if (!this.timer) {
        this.downTime();
      }
    },
    stopTomer() {
      this.pauseTimer();
      this.sign = false;
      [this.min, this.sec, this.msec] = [0, 0, 0];
      window.localStorage.setItem(
        "time",
        `${this.min},${this.sec},${this.msec}`
      );
    }
  },
  computed: {
    msecond() {
      if (this.msec === 0) {
        return "00";
      }
      return this.msec.toString().substr(0, 2);
    },
    second() {
      if (this.sec < 10) {
        return `0${this.sec}`;
      }
      return this.sec;
    }
  },
  destroyed() {}
};
</script>
<style lang='scss' scoped>
.countdown {
  text-align: center;
  -webkit-font-smoothing: antialiased;
  .timer {
    li {
      display: inline-block;
      background-color: #eceef4;
      border-radius: 20px;
      height: 121px;
      line-height: 121px;
      text-align: center;
      font-size: 86px;
      font-weight:bold;
      font-family:PingFang SC;
      color: #000;
      &.minute {
        width: 82px;
        transition: all 0.3s;
      }
      &.second {
        width: 133px;
        transition: all 0.3s;
      }
      &.msecond {
        width: 133px;
        transition: all 0.3s;
      }
    }
    span {
      display: inline-block;
      height: 120px;
      line-height: 120px;
      font-size: 100px;
      font-weight: 700;
      color: #94949D;
    }
  }
  .option {
    width: 100vw;
    background: #fff;
    height: 100px;
    line-height: 100px;
    margin-top: 20px;
    button {
      width: 150px;
      height: 80px;
      display: inline-block;
      margin-right: 10px;
      text-align: center;
      line-height: 80px;
      font-size: 20px;
      color: antiquewhite;
      background-color: orange;
      border: 0;
      border-radius: 10px;
    }
  }
}
</style>
