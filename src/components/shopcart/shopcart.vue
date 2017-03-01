<template>
  <div class="shopcart">
    <div class="content" @click="toggleList">
      <div class="content-left">
        <div class="logo-wrapper">
          <div class="logo" :class="{'highlight': totalCount > 0}">
            <i class="icon-shopping_cart" :class="{'highlight': totalCount > 0}"/>
          </div>
          <div class="num" v-show="totalCount > 0">{{totalCount}}</div>
        </div>
        <div class="price" :class="{'highlight': totalPrice > 0}">¥{{totalPrice}}</div>
        <div class="desc">另需配送费¥{{deliveryPrice}}元</div>
      </div>
      <div class="content-right" @click.stop.prevent="pay">
        <div class="pay" :class="payClass">{{payDesc}}</div>
      </div>
    </div>
    <div class="ball-container">
      <transition-group
        name="drop"
        tag="div"
        v-on:before-enter="beforeEnter"
        v-on:enter="enter"
        v-on:afterEnter="afterEnter">
        <div class="ball" v-for="ball in balls" :key="ball" v-if="ball.show">
          <div class="inner inner-hook"></div>
        </div>
      </transition-group>
    </div>
    <transition name="fold">
      <div class="shopcart-list" v-show="listShow">
        <div class="list-header">
          <h1 class="title">购物车</h1>
          <span class="empty" @click="empty">清空</span>
        </div>
        <div class="list-content" ref="listContent">
          <ul>
            <li class="food" v-for="food in selectFoods">
              <span class="name">{{food.name}}</span>
              <div class="price">
                <span>¥{{food.price*food.count}}</span>
              </div>
              <div class="cartcontrol-wrapper">
                <cartcontrol :food="food"></cartcontrol>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div class="list-mask" v-show="listShow" @click="hiddenList"></div>
    </transition>
  </div>

</template>

<script type="text/ecmascript-6">
  import VueBus from 'common/js/vuebus';
  import BScroll from 'better-scroll';
  import cartcontrol from 'components/cartcontrol/cartcontrol';
  export default{
    data() {
      return {
        balls: [
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          }
        ],
        dropBalls: [],
        fold: true
      };
    },
    props: {
      selectFoods: {
        type: Array,
        default() {
          return [
            {
              price: 20,
              count: 1
            }
          ];
        }
      },
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      }
    },
    computed: {
      totalPrice() {
        let total = 0;
        this.selectFoods.forEach((food) => {
          total += food.price * food.count;
        });
        return total;
      },
      totalCount() {
        let count = 0;
        this.selectFoods.forEach((food) => {
          count += food.count;
        });
        return count;
      },
      payDesc() {
        let totalPrice = this.totalPrice;
        if (totalPrice === 0) {
          return `¥${this.minPrice}元起送`;
        } else if (totalPrice < this.minPrice) {
          let diff = this.minPrice - totalPrice;
          return `还差¥${diff}元配送`;
        } else {
          return `去结算`;
        }
      },
      payClass() {
        if (this.totalPrice < this.minPrice) {
          return 'not-enough';
        } else {
          return 'enough';
        }
      },
      listShow() {
        if (!this.totalCount) {
          this.fold = true;
          return false;
        }
        let show = !this.fold;
        if (show) {
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.listContent, {
                click: true
              });
            } else {
              this.scroll.refresh();
            }
          });
        }
        return show;
      }
    },
    created() {
      VueBus.$on('add-cart', this.addCartListener);
    },
    beforeDestroy() {
      // this.$off('add-cart', this.....);
    },
    methods: {
      addCartListener(el) {
        console.log(el);
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (!ball.show) {
            ball.show = true;
            ball.el = el;
            this.dropBalls.push(ball);
            return;
          }
        }
      },

      beforeEnter(el) {
        console.log('beforeEnter');
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
            // 获取cartcontrol控件触发点的坐标.
            let rect = ball.el.getBoundingClientRect();
            // 将rect减去小球的宽高, 即小球的左下角的坐标.
            let x = rect.left - 32;
            let y = -(window.innerHeight - rect.top - 32);
            el.style.display = '';
            el.style.webkitTransform = `translate3d(0, ${y}px, 0)`;
            el.style.transform = `translate3d(0, ${y}px, 0)`;
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`;
            inner.style.transform = `translate3d(${x}px, 0, 0)`;
          }
        }
      },
      enter(el) {
        /* eslint-disable no-unused-vars */
        console.log('enter');
        let rf = el.offsetHeight; // 手动触发浏览器重绘
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0, 0, 0)';
          el.style.transform = 'translate3d(0, 0, 0)';
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = 'translate3d(0, 0, 0)';
          inner.style.transform = 'translate3d(0, 0, 0)';
        });
      },
      afterEnter(el) {
        console.log('afterEnter');
        let ball = this.dropBalls.shift();
        if (ball) {
          ball.show = false;
          el.style.display = 'none';
        }
      },
      toggleList() {
        if (!this.totalCount) {
          return;
        }
        this.fold = !this.fold;
      },
      empty() {
        this.selectFoods.forEach((food) => {
          food.count = 0;
        });
      },
      hiddenList() {
        this.fold = true;
      },
      pay() {
        if (this.totalPrice < this.minPrice) {
          return;
        }
        window.alert(`支付${this.totalPrice}元`);
      }
    },
    components: {
      cartcontrol
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin";

  .shopcart
    position fixed
    left: 0
    bottom 0
    z-index 10
    width 100%
    height 48px
    .content
      position: relative
      z-index: 10
      display flex
      font-size 0
      background #141d27
      .content-left
        flex 1
        .logo-wrapper
          display inline-block
          position relative
          top -10px
          margin 0 12px
          padding 6px
          width 56px
          height 56px
          box-sizing border-box
          border-radius 50%
          vertical-align top
          background #141d27
          .logo
            width 100%
            height 100%
            border-radius 50%
            text-align center
            background: #2b343c
            &.highlight
              background rgb(0, 160, 220)
            .icon-shopping_cart
              line-height 44px
              font-size 24px
              color #80858a
              &.highlight
                color #ffffff
          .num
            position absolute
            top 0
            right 0
            width 24px
            height 16px
            line-height 16px
            text-align center
            border-radius 16px
            font-size 9px
            font-weight 700
            color #ffffff
            background rgb(240, 20, 20)
            box-shadow 0 4px 8px 0 rgba(0, 0, 0, 0.4)
        .price
          display inline-block
          vertical-align top
          margin-top 12px
          line-height 24px
          padding-right 12px
          box-sizing border-box
          border-right 1px solid rgba(255, 255, 255, 0.1)
          font-size 16px
          color rgba(255, 255, 255, 0.4)
          font-weight 700
          &.highlight
            color #ffffff
        .desc
          display inline-block
          vertical-align top
          margin 12px 0 0 12px
          line-height 24px
          font-size 12px
          color rgba(255, 255, 255, 0.4)
      .content-right
        flex 0 0 105px
        width 105px
        .pay
          height 48px
          line-height 48px
          text-align center
          font-size 12px
          color rgba(255, 255, 255, 0.4)
          font-weight 700
          background #2b333b
          &.not-enough
            background #2b333b
          &.enough
            background #00b43c
            color #ffffff
    .ball-container
      .ball
        position fixed
        left 32px
        bottom 22px
        z-index 200
        /* 可以设置不同的进入和离开动画 */
        /* 设置持续时间和动画函数 */
        &.drop-enter-active {
          transition: all .4s cubic-bezier(.49, -0.29, .75, .41);
        }
        .inner
          width 16px
          height 16px
          border-radius 50%
          background rgb(0, 160, 220)
          transition all .4s linear
    .shopcart-list
      position absolute
      left 0
      bottom 48px
      z-index 5
      width 100%
      &.fold-enter-active, &.fold-leave-active {
        transition: all .5s ease-out;
      }
      &.fold-enter, &.fold-leave-active {
        transform: translate3d(0, 100%, 0);
      }
      .list-header
        height 40px
        line-height 40px
        padding 0 18px
        background: #f3f5f7
        border-bottom 1px sold rgba(7, 17, 27, 0.1)
        .title
          float: left
          font-size 14px
          color rgb(7, 17, 27)
        .empty
          float right
          font-size 12px
          color rgb(0, 160, 220)
      .list-content
        padding 0 18px
        max-height 217px
        background #ffffff
        overflow: hidden
        .food
          position relative
          padding 12px 0
          box-sizing border-box
          border-1px(rgba(7, 17, 27, 0.1))
          .name
            line-height 24px
            font-size 14px
            color rgb(7, 17, 27)
          .price
            position absolute
            right 90px
            bottom 12px
            line-height 24px
            font-size 14px
            color rgb(240, 20, 20)
            font-weight 700
          .cartcontrol-wrapper
            position absolute
            right 0
            bottom 6px

    .list-mask
      position fixed
      left 0
      top 0
      width 100%
      height 100%
      z-index 4
      background rgba(7, 17, 27, 0.6)
      backdrop-filter blur(10px) // IOS的模糊效果
      &.fade-enter-active, &.fade-leave-active
        transition opacity .5s ease
      &.fade-enter, &.fade-leave-active
        opacity 0


</style>
