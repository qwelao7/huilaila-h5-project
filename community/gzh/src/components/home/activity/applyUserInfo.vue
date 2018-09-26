<template>
  <div class="applyUserInfo commonHeader">
    <x-header
      slot="header"
      :left-options="{backText: ''}" title="修改参与人">
    </x-header>
    <ul class="bannerList">
      <li>
        <span>头像</span>
        <img :src="userInfo.joinUserPhoto" alt="">
      </li>
      <li>
        <span>姓名</span>
        <span>{{userInfo.joinUserName}}</span>
      </li>
      <li>
        <span>手机号</span>
        <span>{{userInfo.joinUserPhone}}</span>
      </li>
      <li>
        <span>性别</span>
        <span v-html="userInfo.joinUserSex === 1 ? '男' : '女'"></span>
      </li>
      <li>
        <span>出生日期</span>
        <span>{{userInfo.joinUserBirthday}}</span>
      </li>
      <li>
        <span>与业主的关系</span>
        <span>{{userRelation}}</span>
      </li>
    </ul>
  </div>
</template>
<script>
  import {XHeader, querystring} from 'vux'
  export default {
    name: 'applyUserInfo',
    components: {
      XHeader
    },
    data () {
      return {
        userInfo: {},
        userRelation: ''
      }
    },
    created () {
      this.getData()
    },
    methods: {
      getData () {
        let _this_ = this;
        let params = {
          userId: this.$route.params.id
        }
        _this_.$JHttp({
          method: 'get',
          url: window.baseURL + '/socialactivity/activParticipantDetail?' + querystring.stringify(params)
        }).then(res => {
          if (res.status === 100) {
            _this_.userInfo = res.data;
            switch (_this_.userInfo.joinRelation) {
              case 1:
                _this_.userRelation = '本人';
                break
              case 2:
                _this_.userRelation = '子女';
                break;
              case 3:
                _this_.userRelation = '父母';
                break
              case 4:
                _this_.userRelation = '配偶';
                break
              case 5:
                _this_.userRelation = '（外）祖父母';
                break
              case 6:
                _this_.userRelation = '（外）孙子女';
                break
              case 7:
                _this_.userRelation = '其他';
                break
            }
          }
        }).catch(e => {
          console.log(e)
        })
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .applyUserInfo{
    height: 100%;
    .bannerList{
      height: 100%;
      padding: 0 15px;
      li{
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 0.5px solid #D8D8D8;
        height: 55px;
        line-height: 55px;
        span{
          font-size: 15px;
          color: #333333;
        }
        img{
          width: 35px;
          height: 35px;
          border-radius: 50%;
        }
      }
    }
  }
</style>
