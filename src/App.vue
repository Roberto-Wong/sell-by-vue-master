<template>
  <div class="container">
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评价</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <!--keep-alive: 保证组件在切换时候状态被保留， 生命周期不会重新被加载，请求不会重新被发送，原理：把组件状态保存在内存中-->
    <keep-alive>
      <!--这里忘记传seller给goods组件-->
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script>
  import { urlParse } from './common/js/util';
  import header from './components/header/header.vue';

  const ERR_OK = 0;

  export default {
    data () {
      return {
        seller: {
          id: (() => {
            let queryParam = urlParse();
            // console.log(queryParam);
            return queryParam.id;
          })()
        }
      };
    },
    created() {
      this.$nextTick(function () {
        // this.$http.get('/api/seller?id=' + this.seller.id).then((response) => {
        // VueResource API
        this.$http.get('/api/seller?id=' + this.seller.id).then((response) => {
          response = response.body;
          // 获得的响应消息
          // console.log(response.data);
          if (response.errno === ERR_OK) {
            // Object.assign的作用：给对象扩展新属性，不会抹掉原有属性
            this.seller = Object.assign({}, this.seller, response.data);
          }
          // console.log(this.seller);
        });
      });
    },
    components: {
      // 需要哪个变量接住
      'v-header': header
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "./common/stylus/mixin.styl"

  .tab
    display: flex
    width: 100%
    height: 40px
    line-height: 40px
    border-1px(rgba(7, 17, 21, 0.1))
    .tab-item
      flex: 1
      text-align: center
      & > a
        display: block
        font-size: 14px
        color: rgb(77, 85, 93)
        &.active
          height: 38px
          line-height: 40px
          color:rgb(240, 20, 20)
          border-bottom: 2px solid rgb(240, 20, 20)
</style>
