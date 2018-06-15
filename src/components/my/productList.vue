<template>
	<div class="product-list">
		<div class="product-item" v-for="product in productList" :class="{ 'border-bottom': borderBottom }" @click="clickProductItem(product)">
			<img :src="product.itemPic"/>
			<div class="info">
				<div class="left">
					<span class="product-name" v-text="product.itemName"></span>
					<span class="product-sku" v-text="product.skuProperties"></span>
				</div>
				<div class="right">
					<span class="product-price" v-text="(product.itemPrice.toString().indexOf('.') === -1 ? product.itemPrice + '.00' : product.itemPrice) + product.itemUnit"></span>
					<span class="product-num" v-text="'x' + product.itemNum"></span>
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
    }
  },
  methods: {
    clickProductItem (product) {
      if (this.isClick) {
        this.$router.push({path: '/productDetail', query: {productId: product.itemId}});
      }
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
  	  	.product-price {
  		}
  		.product-num {
  		  text-align: right;
  		}
  	  }
  	}
  }
}
</style>
