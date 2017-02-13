<template>
  <div class="cartcontrol">
    <transition name="move">
      <div class="cart-decrease"
        v-show="food.count>0"
        @click.stop.prevent="decreaseCart">
        <i class="icon-remove_circle_outline"></i>
      </div>
    </transition>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
  </div>
</template>

<script>
  import Vue from 'vue';

  export default {
    props: {
      food: {
        type: Object
      }
    },
    methods: {
      addCart (event) {
        // console.log('111111');
        if (!event._constructed) {
          return;
        }
        if (!this.food.count) {
          Vue.set(this.food, 'count', 1);
          this.food.count = 1;
        } else {
          this.food.count ++;
        }
        /* 在这统一派发add事件 */
        this.$emit('add', event.target);
      },
      decreaseCart (event) {
        if (!event._constructed) {
          return;
        }
        if (this.food.count) {
          this.food.count --;
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
    .cartcontrol
      font-size: 0
      .cart-decrease
        display: inline-block
        padding: 6px
        line-height: 24px
        font-size: 24px
        color: rgb(0, 160, 220)
        transition: all 0.4s linear
        &.move-enter-active
          display: inline-block
          opacity: 1
          transform: translate3D(0, 0, 0) rotate(0deg)
        &.move-enter, &.move-leave-active
          opacity: 0
          transform: translate3D(24px, 0, 0) rotate(180deg)
      .cart-count
        display: inline-block
        vertical-align: top
        width:12px
        text-align: center
        padding-top:6px
        line-height:24px
        font-size :10px
        color:rgb(147, 153, 159)
      .cart-add
        display: inline-block
        padding:6px
        line-height:24px
        font-size :24px
        color:rgb(0, 160, 220)
</style>

