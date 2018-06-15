<template>
  <div class="onReport commonHeader no-margin-top">
    <x-header
      :left-options="{backText: ''}"
      title="举报">
    </x-header>
    <div class="reportBanner">
      <div class="reportTit">
        <p>举报<span class="reportUser">{{complainUser.userName}}</span>的帖子</p>
      </div>
      <div class="post">
        <p>{{complainUser.topicName}}</p>
      </div>
      <div class="postOption">
          <checklist ref="demoObject" :options="commonList" :max="1" v-model="objectListValue" @on-change="change"></checklist>
      </div>
      <x-button type="primary" @click.native="complainTopic">确认提交</x-button>
    </div>
  </div>
</template>
<script>
  import { XHeader, Checklist, XButton, querystring } from 'vux'
  export default {
    name: 'onReport',
    components: {
      XHeader,
      Checklist,
      XButton
    },
    data () {
      return {
        complainUser: {},
        objectListValue: [1],
        fullValues: [],
        reportOption: '',
        commonList: [
          {
            value: '垃圾营销',
            key: 1
          },
          {
            value: '不实信息',
            key: 2
          },
          {
            value: '有害信息',
            key: 3
          },
          {
            value: '违法信息',
            key: 4
          },
          {
            value: '淫秽色情',
            key: 5
          },
          {
            value: '人身攻击我',
            key: 6
          },
          {
            value: '抄袭',
            key: 7
          },
          {
            value: '违规有奖活动',
            key: 8
          }
        ]
      }
    },
    created () {
      this.getData();
      console.log(this.$route.params)
    },
    methods: {
      getData () {
        this.$vux.loading.show({
          text: '加载中'
        });
        let neighborId = this.$route.params.id;
        let params = {
          neighborId: neighborId
        };
        let _this = this;
        this.$JHttp({
          method: 'get',
          url: window.baseURL + '/neighbor/topic/detail?' + querystring.stringify(params)
        }).then(res => {
          if (res.status === 100) {
            console.log(222, res.data);
            _this.$vux.loading.hide();
            _this.complainUser = {
              userName: res.data.userName,
              topicName: res.data.topicContent
            }
          } else {
            _this.$vux.loading.hide();
            _this.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            })
          }
        }).catch(e => {
          console.log(e);
          this.$vux.loading.hide();
        })
      },
      change (val, label) {
        console.log('change', val, label);
        this.reportOption = label;
      },
      complainTopic () {
        // todo 举报
        let neighborId = this.$route.params.id;
        if (this.objectListValue || this.objectListValue.length < 1) {
          alert('请选择举报类型')
          return
        }
        let reportType = this.objectListValue[0];
        let params = {
          neighborId: neighborId,
          type: reportType
        };
        let _this = this;
        this.$JHttp({
          method: 'post',
          url: window.baseURL + '/neighbor/topic/complain?' + querystring.stringify(params)
        }).then(res => {
          if (res.status === 100) {
            this.submit()
          } else {
            _this.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            })
          }
        })
      },
      submit () {
        const _this = this;
        this.fullValues = this.$refs.demoObject.getFullValue();
        console.log('您举报的原因是：', this.reportOption);
        _this.$vux.alert.show({
          content: '提交成功，我们将尽快处理你的举报',
          onHide () {
            _this.$router.go(-1);
          }
        });
        setTimeout(() => {
          this.$vux.alert.hide()
        }, 2000);
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .onReport{
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    .reportBanner{
      padding: 20px 15px;
      .reportTit{
        .reportUser{
          font-size: 15px;
          color: #0bb20c;
        }
        p{
          display: flex;
          font-size: 15px;
        }
      }
      .post{
        margin-top: 15px;
        background-color: #f8f8f8;
        padding: 10px;
        p{
          width: 100%;
          font-size: 14px;
          color: #aaaaaa;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .postOption{
        .weui-cells{
          display: flex;
        }
      }

    }
  }
</style>

