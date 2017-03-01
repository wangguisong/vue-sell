<template>
  <transition name="move">
    <div class="food" v-show="showFlag" ref="food">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image">
          <div class="back" @click="hidden">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span><span class="rating">好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="now">¥{{food.price}}</span><span class="old" v-show="food.oldPrice">¥{{food.oldPrice}}</span>
          </div>
          <div class="cartcontrol-wrapper">
            <cartcontrol :food="food"></cartcontrol>
          </div>
          <transition name="fade">
            <div class="buy"
                 v-show="!food.count || food.count===0"
                 @click.stop.prevent="addFirst($event)">
              加入购物车
            </div>
          </transition>
        </div>
        <split v-show="food.info"></split>
        <div class="info" v-show="food.info">
          <h1 class="title">商品介绍</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <split v-show="food.ratings"></split>
        <div class="ratings" v-show="food.ratings">
          <h1 class="title">商品评价</h1>
          <ratingselect :select-type="selectType"
                        v-on:switch-selecttype="switchSelectType"
                        :only-content="onlyContent"
                        v-on:switch-onlycontent="switchOnlyContent"
                        :ratings="food.ratings"
                        :desc="desc"></ratingselect>
          <div class="rating-wrapper">
            <ul v-show="food.ratings && food.ratings.length">
              <li class="rating-item"
                  v-for="rating in food.ratings"
                  v-show="needShow(rating.rateType, rating.text)">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img class="avatar" width="12" height="12" :src="rating.avatar">
                </div>
                <div class="time">{{rating.rateTime | formatDate}}</div>
                <p class="text">
                  <i :class="{'icon-thumb_up': rating.rateType===0, 'icon-thumb_down': rating.rateType===1}"></i>
                  {{rating.text}}
                </p>
              </li>
            </ul>
            <div class="no-rating" v-show="!food.ratings || !food.ratings.length">
              暂无评价
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import VueBus from 'common/js/vuebus';
  import {formatDate} from 'common/js/date';
  import cartcontrol from 'components/cartcontrol/cartcontrol';
  import ratingselect from 'components/ratingselect/ratingselect';
  import split from 'components/split/split';

  //  const POSITIVE = 0;
  //  const NEGATIVE = 1;
  const ALL = 2;

  export default {
    props: {
      food: {
        type: Object
      }
    },
    data() {
      return {
        showFlag: false,
        selectType: ALL,
        onlyContent: false,
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
      };
    },
    methods: {
      show() {
        console.log('show');
        this.showFlag = true;
        this.selectType = ALL;
        this.onlyContent = false;
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.food, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      hidden() {
        this.showFlag = false;
      },
      switchSelectType(type) {
        this.selectType = type;
        console.log('receive switchSelectType=' + type);
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      switchOnlyContent(isOnly) {
        this.onlyContent = isOnly;
        console.log('receive switchOnlyContent=' + isOnly);
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      addFirst(event) {
        if (!event._constructed) {
          return;
        }
        if (!this.food.count) {
          this.$set(this.food, 'count', 1);
        } else {
          this.food.count++;
        }
        VueBus.$emit('add-cart', event.target);
      },
      needShow(type, text) {
        if (this.onlyContent && !text) {
          return false;
        }
        if (this.selectType === ALL) {
          return true;
        } else {
          return type === this.selectType;
        }
      }
    },
    filters: {
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyy-MM-dd hh:mm');
      }
    },
    components: {
      cartcontrol,
      ratingselect,
      split
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin";

  .food
    position fixed
    top 0
    left 0
    bottom 48px
    z-index 5
    width 100%
    background #ffffff
    &.move-enter-active, &.move-leave-active
      transition opacity .5s linear
      transform translate3d(0, 0, 0)
    &.move-enter, &.move-leave-active
      opacity 0
    // transform translate3d(100%, 0, 0)
    .image-header
      position relative
      width 100%
      height 0
      padding-top 100%
      img
        position: absolute
        top 0
        left 0
        width 100%
        height 100%
      .back
        position: absolute
        top 10px
        left 0
        .icon-arrow_lift
          display block
          padding 18px
          font-size 20px
          color #ffffff
    .content
      position: relative
      padding 18px
      .title
        line-height 14px
        margin-bottom 8px
        font-size 14px
        font-weight 700
        color rgb(7, 17, 27)
      .detail
        margin-bottom 18px
        line-height 10px
        color rgb(147, 153, 159)
        font-size 10px
        .sell-count
          margin-right 6px
      .price
        foot-weight 700
        line-height 24px
        .now
          margin-right 18px
          font-size 14px
          color rgb(240, 20, 20)
        .old
          text-decoration line-through
          font-size 10px
          color rgb(147, 153, 159)
      .cartcontrol-wrapper
        position absolute
        right 12px
        bottom 12px
      .buy
        position absolute
        right 18px
        bottom 18px
        z-index 10
        height 24px
        line-height 24px
        padding 0 12px
        box-sizing border-box
        border-radius 12px
        font-size 10px
        color #ffffff
        background rgb(0, 160, 220)
        &.fade-enter-active, &.fade-leave-active
          transition all 0.6s
          opacity 1
        &.fade-enter, &.fade-leave-active
          opacity 0
    .info
      padding 18px
      .title
        line-height 14px
        margin-bottom 6px
        font-size 14px
        color rgb(7, 17, 27)
      .text
        line-height 24px
        padding 0 8px
        font-size 12px
        color rgb(77, 85, 93)

    .ratings
      padding-top 18px
      .title
        line-height 14px
        margin-left 18px
        font-size 14px
        color rgb(7, 17, 27)
      .rating-wrapper
        padding 0 18px
        .rating-item
          position relative
          padding 16px 0
          border-1px(rgba(7, 17, 27, 0.1))
          .user
            position absolute
            right 0
            top 16px
            line-height 12px
            font-size 0
            .name
              display: inline-block
              vertical-align top
              margin-right 6px
              font-size 10px
              color rgb(147, 153, 159)
            .avatar
              border-radius 50%
          .time
            margin-bottom 6px
            line-height 12px
            font-size 10px
            color rgb(147, 153, 159)
          .text
            line-height 16px
            font-size 12px
            color rgb(7, 17, 27)
            .icon-thumb_up, .icon-thumb_down
              margin-right 4px
              line-hieght 24px
              font-size 12px
            .icon-thumb_up
              color rgb(0, 160, 220)
            .icon-thumb_down
              color rgb(147, 153, 159)
        .no-rating
          padding 16px 0
          font-size 12px
          color rgb(147, 153, 159)
</style>
