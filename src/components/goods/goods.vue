<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li class="menu-item"
          v-for="(item, index) in goods"
          :class="{'current' : currentIndex === index}"
          @click="selectMenu(index, $event)">
          <span class="text">
            <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>
            {{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li v-for="item in goods" class="food-list food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li @click="selectFood(food, $event)"
              v-for="food in item.foods" class="food-item border-1px">
              <div class="icon">
                <img :src="food.icon" width="57" height="57" alt="">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span>
                  <span>评分{{food.rating}}分</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span>
                  <span class="old" v-if="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <!--加减组件-->
                <div class="cartcontrol-wrapper">
                  <!--给福组件绑定子组件派发的事件-->
                  <cartcontrol :food="food"
                    @add="addFood"></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart ref="shopcart"
      :select-foods="selectFoods"
      :delivery-price="seller.deliveryPrice"
      :min-price="seller.minPrice">
    </shopcart>
    <!--调用兄弟组件的事件与父子组件通信一样-->
    <!--<food :food="selectedFood" ref="food" v-on:eventCartadd="_drop"></food>-->
    <food :food="selectedFood" ref="food" @add="addFood"></food>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';
  import cartcontrol from '../cartcontrol/cartcontrol.vue';
  import shopcart from '../shopcart/shopcart.vue';
  import food from '../food/food.vue';

  const ERR_OK = 0;

  export default {
    // 写成props 导致没拿到seller对象
    props: {
      seller: {
        type: Object
      }
    },
    data () {
      return {
        goods: [],
        listHeight: [],
        scrollY: 0,
        // 接收选择的食物对象
        selectedFood: {}
      };
    },
    created () {
      this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special'];
      // DOM更新完成后利用VueResource请求goods数据
      this.$http.get('api/goods').then((response) => {
        response = response.body;
        // console.log(response);
        if (response.errno === ERR_OK) {
          this.goods = response.data;
          // DOM更新后计算出事高度和初始化BScroll
          this.$nextTick(() => {
            this._initScroll();
            this._calculateHeight();
            // console.log(this.listHeight);
            // 计算属性不能这样使用？
            // this.currentIndex();
          });
        }
      });
      // console.log(this.seller);
    },
    computed: {
      // 计算左侧应该对应哪一个列表
      currentIndex () {
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i + 1];
          // || 写成 && 导致出问题  不加=点击上去，刚到临界值就把current class 删除了
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i;
          }
        }
        return 0;
      },
      selectFoods () {
        let foods = [];
        // 遍历goods数组 如果有count属性就添加到foods中 (为何要传递food做参数)
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food);
            }
          });
        });
        return foods;
      }
    },
    methods: {
      _initScroll () {
        // 初始化 获取DOM操作 ref
        this.menuScroll = new BScroll(this.$refs.menuWrapper, {
          click: true
        });
        this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
          // 不加这个点击不了这个区域内的控件
          click: true,
          // 加上这个属性才能获得scroll方法
          probeType: 3
        });
        // 获取scrollY
        this.foodsScroll.on('scroll', (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y));
          // console.log(this.scrollY);
        });
      },
      // 计算foodlist总高度
      _calculateHeight () {
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i];
          height += item.clientHeight;
          // 返回一个递增数组
          this.listHeight.push(height);
        }
      },
      selectMenu (index, event) {
        // console.log(index);
        // this.currentIndex = index;
        if (!event._constructed) {
          return;
        }
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
        let el = foodList[index];
        // 调用BScroll的方法
        this.foodsScroll.scrollToElement(el, 300);
      },
      selectFood (food, event) {
        if (!event._constructed) {
          return;
        }
        // console.log('点击了food列表');
        this.selectedFood = food;
        // console.log(this.selectedFood);
        // 调用子组件的show方法
        this.$refs.food.show();
      },
      // 定义addFood事件
      addFood (target) {
        this._drop(target);
      },
      /* 引用子组件的drop方法 */
      _drop (target) {
        // 体验优化，异步执行下落动画
        this.$nextTick(() => {
          // 在父组件中调用子组件的DOM,获得点击的+号的DOM及位置
          this.$refs.shopcart.drop(target);
        });
      }
    },
    components: {
      cartcontrol,
      shopcart,
      food
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl';

  .goods
    display: flex
    position: absolute
    top: 174px
    bottom: 46px
    width: 100%
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        display: table
        width: 56px
        height: 54px
        line-height: 14px
        padding: 0 12px
        &.current
          position: relative
          z-index: 10
          margin-top: -1px
          background: #fff
          font-weight: 700
          .text
            border-none()
        .text
          display: table-cell
          vertical-align: middle
          font-size: 12px
          width: 56px
          border-1px(rgba(7, 17, 27, 0.1))
          .icon
            display: inline-block
            width: 12px
            height: 12px
            vertical-align: top
            margin-right: 2px
            background-size: 12px 12px
            background-repeat: no-repeat
            &.decrease
              bg-image('decrease_3')
            &.discount
              bg-image('discount_3')
            &.guarantee
              bg-image('guarantee_3')
            &.invoice
              bg-image('invoice_3')
            &.special
              bg-image('special_3')
    .foods-wrapper
      flex: 1
      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color:rgb(147, 153, 159)
        background: #f3f5f7
      .food-item
        display: flex
        margin: 18px
        padding-bottom:18px
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          margin-bottom: 0
        .icon
          flex:0 0 57px
          width:57px
          margin-right:10px
        .content
          flex:1
          .name
            margin: 2px 0 8px 0
            height: 14px
            line-height: 14px
            color: rgb(7, 17, 27)
          .desc,.extra
            font-size: 10px
            color:rgb(147, 153, 159)
            line-height: 10px;
          .desc
            margin-bottom: 8px
            line-height:10px
          .extra
            .count
              margin-right:12px
          .price
            font-weight: 700
            line-height:24px
            .now
              margin-right: 8px
              font-size: 14px
              color:rgb(240, 20, 20)
            .old
              text-decoration line-through
              font-size: 10px
          .cartcontrol-wrapper
            position: absolute
            right:0
            bottom:12px
</style>


