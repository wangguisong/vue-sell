<template>
  <div class="ratingselect">
    <div class="rating-type border-1px">
      <span class="block positive"
            :class="{'active': curSelectType===2}"
            @click="select(2, $event)">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
      <span class="block positive"
            :class="{'active': curSelectType===0}"
            @click="select(0, $event)">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
      <span class="block negative"
            :class="{'active': curSelectType===1}"
            @click="select(1, $event)">{{desc.negative}}<span class="count">7</span></span>
    </div>
    <div class="switch"
         :class="{'on': curOnlyContent}"
         @click="toggleContent">
      <span class="icon-check_circle"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const POSITIVE = 0;
  const NEGATIVE = 1;
  const ALL = 2;

  export default {
    data() {
      return {
        // https://cn.vuejs.org/v2/guide/components.html#单向数据流
        curSelectType: this.selectType,
        curOnlyContent: this.onlyContent
      };
    },
    props: {
      ratings: {
        type: Array,
        default() {
          return [];
        }
      },
      selectType: {
        type: Number,
        default: ALL
      },
      onlyContent: {
        type: Boolean,
        default: false
      },
      desc: {
        type: Object,
        default() {
          return {
            all: '全部',
            positive: '满意',
            negative: '不满意'
          };
        }
      }
    },
    computed: {
      positives() {
        return this.ratings.filter((rating) => {
          return rating.rateType === POSITIVE;
        });
      },
      negatives() {
        return this.ratings.filter((rating) => {
          return rating.rateType === NEGATIVE;
        });
      }
    },
    methods: {
      select(type, event) {
        if (!event._constructed) {
          return;
        }
        this.curSelectType = type;
        console.log('$emit switchSelectType=' + type);
        this.$emit('switch-selecttype', this.curSelectType);
      },
      toggleContent(event) {
        if (!event._constructed) {
          return;
        }
        this.curOnlyContent = !this.curOnlyContent;
        console.log('$emit toggleContent=' + this.curOnlyContent);
        this.$emit('switch-onlycontent', this.curOnlyContent);
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin";

  .ratingselect
    .rating-type
      padding 18px 0
      margin 0 18px
      border-1px(rgba(7, 17, 27, 0.1))
      font-size 0
      .block
        display: inline-block
        line-height 16px
        padding 8px 12px
        margin-right 8px
        border-radius 1px
        font-size 12px
        color rgb(77, 85, 93)
        &.active
          color #ffffff
        .count
          margin-left 2px
          font-size 8px
        &.positive
          background rgba(0, 160, 220, 0.2)
          &.active
            background rgb(0 160, 220)
        &.negative
          background rgba(77, 85, 93, 0.2)
          &.active
            background rgb(77, 85, 93, 0.2)
    .switch
      padding 12px 18px
      line-height 24px
      border-1px(rgba(7, 17, 27, 0.1))
      // border-bottom 1px sold rgba(7, 17, 27, 0.1)
      color rgb(147, 153, 159)
      font-size 0
      &.on
        .icon-check_circle
          color #80c34a
      .icon-check_circle
        display inline-block
        vertical-align top
        line-height 24px
        margin-right 4px
        font-size 24px
      .text
        display inline-block
        vertical-align top
        font-size 12px

</style>
