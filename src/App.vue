<template>
  <div>
    <v-header v-bind:seller="seller" ></v-header>
    <div class="tab border-1px">
      <!-- 使用 router-link 组件来导航. -->
      <!-- 通过传入 `to` 属性指定链接. -->
      <!-- <router-link> 默认会被渲染成一个 `<a>` 标签 -->
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <!-- 路由出口 -->
    <!-- 路由匹配到的组件将渲染在这里 -->
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script type="text/ecmascript-6">
  import Header from 'components/header/header.vue';
  import {urlParse} from 'common/js/util';
  const ERR_OK = 0;

  export default {
    data() {
      return {
        seller: {
          id: (() => {
            let queryParam = urlParse();
            return queryParam.id;
          })()
        }
      };
    },
    computed: {
      sellerId() {
        let queryParam = urlParse();
        return queryParam.id;
      }
    },
    created: function () {
      this.getSellerInfo();
    },
    components: {
      'v-header': Header
    },
    methods: {
      getSellerInfo: function () {
        console.log('seller.id=' + this.seller.id);
        this.$http.get('/api/seller?id=' + this.seller.id).then((res) => {
          var response = res.body;
          if (response.errno === ERR_OK) {
            this.seller = Object.assign({}, this.seller, response.data);
            // console.log(this.seller);
          }
        });
      }
    }
  };

</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "common/stylus/mixin.styl"

  .tab
    display: flex
    width: 100%
    height: 40px
    line-height: 40px
    // border-bottom: 1px solid rgba(7, 17, 27, 0.1)
    border-1px(rgba(7, 17, 27, 0.1))
    .tab-item
      flex: 1
      text-align: center
      & > a
        display: block
        font-size: 14px
        color: rgb(77, 85, 93)
        &.active
          color: rgb(240, 20, 20)
</style>
