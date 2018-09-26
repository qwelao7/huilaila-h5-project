<template>
	<div class="product-list">
		<div class="product-item" v-for="(product, index) in productList" :class="{ 'border-bottom': borderBottom }" @click="clickProductItem(product)">
			<img :src="product.itemPic"/>
			<div class="info">
				<div class="left">
					<span class="product-name" v-text="product.itemName"></span>
					<span class="product-sku" v-text="product.skuProperties"></span>
				</div>
				<div class="right">
          <span>
  					<span class="product-price" v-text="(product.itemPrice.toString().indexOf('.') === -1 ? product.itemPrice + '.00' : product.itemPrice) + product.itemUnit"></span>
  					<span class="product-num" v-text="'x' + product.itemNum"></span>
          </span>
          <span v-if="orderId">
            <span class="btn-after-service" v-if="isAfterService && (product.serviceStatus === 0 || product.serviceStatus === 6)" @click.stop="afterService(product.id, index)">申请售后</span>
            <span class="text-after-service" v-if="product.serviceStatus > 0 && product.serviceStatus !==6" v-text="afterServiceStatus[product.serviceStatus]"></span>
          </span>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
  name: 'product-list',
  props: {
    productList: {
      type: Array,
      default: () => []
    },
    borderBottom: {
      type: Boolean,
      default: () => false
    },
    isClick: {
      type: Boolean,
      default: () => true
    },
    // 商品售后需要传入orderId
    orderId: {
      type: String,
      default: () => ''
    },
    isAfterService: {
      type: Boolean,
      default: () => false
    }
  },
  data () {
    return {
      afterServiceStatus: ['', '等待受理', '寄回商品', '客服收货', '等待退款', '完成退款', '已经取消', '已经关闭']
    }
  },
  methods: {
    clickProductItem (product) {
      if (this.isClick) {
        this.$router.push({ path: '/productDetail', query: { productId: product.itemId, orderId: this.orderId } });
      }
    },
    afterService (detailId, index) {
      this.$router.push({ path: '/cancelOrder/' + this.orderId, query: { type: 2, detailId: detailId, productList: [this.productList[index]] } })
    }
  }
}
</script>
<style type="text/less" lang="less" scoped>
.product-list {
  .product-item {
  	display: flex;
  	padding: 15px 0 20px 0;
  	border-top: 0.5px solid #D8D8D8;
  	&.border-bottom {
	  &:last-child {
	    border-bottom: 0.5px solid #D8D8D8;
	  }
  	}
  	img {
  	  width: 85px;
  	  height: 85px;
  	  margin-right: 10px;
  	}
  	.info {
  	  display: flex;
  	  justify-content: space-between;
  	  width: 100%;
  	  color: #333333;
  	  font-size: 12px;
  	  .left {
  	  	display: flex;
  	  	flex-direction: column;
    	  justify-content: space-between;
  	  	.product-name {
  	  	  max-width: 172px;
  		    font-size: 15px;
  	  	}
  	  	.product-sku {
  	  	  height: 16px;
  		    color: #AAAAAA;
  		  }
  	  }
  	  .right {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
  		  text-align: right;
        .btn-after-service {
          white-space: nowrap;
          padding: 4px 16px;
          background: #FFFFFF;
          border: 1px solid #000000;
          border-radius: 20px;
        }
        .text-after-service {
          color: #FF6648;
        }
  	  }
  	}
  }
}
</style>
