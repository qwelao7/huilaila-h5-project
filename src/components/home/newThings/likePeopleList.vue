<template>
  <div class="likePeopleList commonHeader no-margin-top">
    <x-header
      :left-options="{backText: ''}"
      :title="title">
    </x-header>
    <group>
      <cell-box class="likePeople" v-for="(item, index) in praiseList" :key="index" @click.native="toPersonPage(item.userId)">
        <div class="peopleInfo">
          <img :src="item.headPicName" alt="">
          <span>{{item.userName}}</span>
        </div>
      </cell-box>
    </group>
    <x-dialog class="delete-wrapper" v-model="deleteModalShow" :dialog-style="deleteDialogStyle" hide-on-blur>
      <span class="delete-info vux-1px-b">您尚未绑定手机号</span>
      <div class="operate-wrapper">
        <span class="text vux-1px-r" @click="deleteModalShow = false">以后再说</span>
        <span class="text" @click="goToBind">前往绑定</span>
      </div>
    </x-dialog>
  </div>
</template>
<script>
  import { XHeader, Group, CellBox, querystring, XDialog } from 'vux'
  export default {
    name: 'likePeopleList',
    components: {
      XHeader,
      Group,
      CellBox,
      XDialog
    },
    data () {
      return {
        praiseList: [],
        title: '',
        deleteModalShow: false,
        deleteDialogStyle: {
          maxWidth: '100%',
          width: '70%',
          padding: '20px 0 0 0',
          borderRadius: '20px'
        },
        token: localStorage.getItem('token')
      }
    },
    created () {
      this.getPraiseList()
    },
    methods: {
      getPraiseList () {
        let id = this.$route.params.id;
        let params = {
          neighborId: id,
          curPage: 1,
          pageSize: 10
        };
        this.$JHttp({
          method: 'get',
          url: window.baseURL + '/neighbor/topic/praiseList?' + querystring.stringify(params)
        }).then(res => {
          if (res.status === 100) {
            this.title = res.data.pageResult.total + '人点赞';
            this.praiseList = res.data.resultList;
          }
        }).catch(e => {
          console.log(e)
        })
      },
      toPersonPage (key) {
        if (!this.token) {
          this.deleteModalShow = true;
        } else {
          this.$router.push('/personPage/' + key)
        }
      },
      goToBind () {
        this.$router.push('/Login')
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .likePeopleList{
    .likePeople{
      .peopleInfo{
        display: flex;
        align-items: center;
        img{
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }
        span{
          margin-left: 10px;
          font-size: 15px;
        }
      }
    }
    .delete-wrapper {
      .delete-info {
        color: #333;
        font-size: 14px;
        font-weight: bold;
        display: inline-block;
        width: 100%;
        padding-bottom: 20px;
      }
      .operate-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 50px;
        .text {
          display: inline-block;
          width: 50%;
          height: 100%;
          line-height: 50px;
          color: #18adfb;
          font-size: 16px;
        }
      }
    }
  }
</style>
