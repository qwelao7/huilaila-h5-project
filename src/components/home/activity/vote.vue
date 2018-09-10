<template>
  <div class="vote commonHeader">
    <x-header
      :left-options="{backText: ''}"
      :right-options="{showMore: true}"
      @on-click-more="showMenus = true"
      title="调查投票">
    </x-header>
    <div class="survey">
      <div class="reason">
        <p class="title">小区音乐播放调查</p>
        <div class="time">
          <span>2017-05-30 15:22</span>
          <div>
            <span>35分钟</span>
            <span>后投票结束</span>
          </div>
        </div>
        <div class="banner">
          <p>尊敬的业主家人，你好！
            为了不断提高物业服务质量，为客户提供更优质的服务，回来啦社区通过“回来啦社区APP”进行此次满意度调研，调研时间约需3-5分钟。此次调研只是针对物业服务工作进行评价，如涉及房产问题，请在建议与意见中另行告知。在调研过程中，我们不会向您索要任何费用或账号密码等，请您注意操作安全。
            请于适当方块内填上“√”号，有意见或建议请填在意见与建议栏内。</p>
        </div>
        <div class="count">
          <i></i>
          <div>
            <span>34</span>
            <span>位业主投票</span>
          </div>
        </div>
      </div>
      <div class="vote-option">
        <voteSelect v-show="isOver"></voteSelect>
        <voteResult v-show="!isOver"></voteResult>
      </div>
    </div>
    <div v-transfer-dom>
      <actionsheet :menus="menus" @on-click-menu-menu="onReport" v-model="showMenus" show-cancel></actionsheet>
    </div>
  </div>
</template>
<script>
  import voteSelect from '../../common/voteSelect'
  import voteResult from '../../common/voteResult'
  import { XHeader, Actionsheet, TransferDom, Previewer, Group, CellBox } from 'vux'
  export default {
    name: 'vote',
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      Actionsheet,
      Previewer,
      Group,
      CellBox,
      voteSelect,
      voteResult
    },
    data () {
      return {
        isOver: false,
        menus: {
          menu: '举报'
        },
        showMenus: false
      }
    },
    methods: {
      onReport () {
        this.$router.push('/onReport')
      },
      show (index) {
        this.$refs.previewer.show(index)
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .vote{
    background-color: #ffffff;
    .survey{
      padding: 10px 15px;
      .reason{
        .title{
          font-size: 24px;font-weight: bolder;
        }
        .time{
          margin-top: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12px;
          color: #aaaaaa;
          div{
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: #0DAB60;
          }
        }
        .banner{
         margin-top: 15px;
          font-size: 15px;
        }
        .count{
          margin-top: 21px;
          display: flex;
          i{
            width: 28px;
            height: 28px;
            background-image: url("../../../assets/images/vote_icon_56green.png");
            background-position: center;
            background-size: contain;
            background-repeat: no-repeat;
          }
          div{
            display: flex;
            align-items: center;
            margin-left: 5px;
            span{
              font-size: 12px;
              color: #aaaaaa;
            }
            span:first-child{
              color: #0DAB60;
            }
          }
        }
      }
      .vote-option{
        margin-top: 30px;
      }
    }
  }
</style>
