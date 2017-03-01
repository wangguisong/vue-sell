<template>
  <div class="cartcontrol">
    <transition name="slide-fade">
      <div class="cart-decrease icon-remove_circle_outline"
           v-show="food.count > 0"
           @click.stop.prevent="decreaseCart"></div>
    </transition>
    <div class="cart-count" v-show="food.count > 0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  // import Vue from 'vue';
  import VueBus from 'common/js/vuebus';
  export default {
    props: {
      food: {
        type: Object
      }
    },
    created() {
      // console.log(this.food);
    },
    methods: {
      addCart(event) {
        if (!event._constructed) {
          return;
        }
        // console.log('click addcart');
        if (!this.food.count) {
          this.$set(this.food, 'count', 1);
        } else {
          this.food.count++;
        }
        // console.log('$emit');
        VueBus.$emit('add-cart', event.target);
      },
      decreaseCart(event) {
        if (!event._constructed) {
          return;
        }
        if (this.food.count) {
          this.food.count--;
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .cartcontrol
    font-size 0
    .cart-decrease
      display inline-block
      padding 6px
      line-height 24px
      font-size 24px
      color rgb(0, 160, 220)
      /* 可以设置不同的进入和离开动画 */
      /* 设置持续时间和动画函数 */
      &.slide-fade-enter-active {
        transition: all .3s ease;
      }
      &.slide-fade-leave-active {
        transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
      }
      &.slide-fade-enter, &.slide-fade-leave-active {
        transform: translateX(15px);
        opacity: 0;
      }
    .cart-count
      display inline-block
      vertical-align top
      width 12px
      padding-top 6px
      line-height 24px
      text-align center
      font-size 10px
      color rgb(147, 153, 159)
    .cart-add
      display inline-block
      padding 6px
      line-height 24px
      font-size 24px
      color rgb(0, 160, 220)
</style>
