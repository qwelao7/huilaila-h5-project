<template>
  <div>
    <rule v-if="curStep === 0" @finish="finishRule"></rule>
    <step1 v-if="curStep === 1" @finish="finishStep1" :initName="workRoomName" :title="title"></step1>
    <step2 v-if="curStep === 2" @finish="finishStep2" @on-back="step2Back" :workRoomId="workRoomId" :bg-icon="bgPath" :title="title"></step2>
    <step3 v-if="curStep === 3" @finish="finishStep3" :init-introduce="introduce" :bg-icon="bgPath" @on-back="step3Back" :title="title"></step3>
  </div>

</template>
<script>
  import step1 from './applyStep1';
  import step2 from './applyStep2';
  import step3 from './applyStep3';
  import rule from './rule';
  import { querystring } from 'vux'
  export default {
    name: 'darenApply',
    components: {
      step1,
      step2,
      step3,
      rule
    },
    data () {
      return {
        curStep: -1,
        workRoomId: '',
        workRoomName: '',
        headPic: '',
        selectedLabel: [],
        introduce: '',
        bgPath: ''
      }
    },
    props: ['id', 'title'],
    created () {
      if (this.id) {
        this.curStep = 1;
      } else {
        // 申请要先看规则
        this.curStep = 0;
      }
      this.initData();
    },
    methods: {
      // 看完规则
      finishRule () {
        this.curStep = 1;
      },
      // 完成第一步
      finishStep1 (name) {
        this.workRoomName = name;
        this.curStep = 2;
      },
      // 完成第二步
      finishStep2 (data) {
        const { selectedLabel, bgPath } = data;
        this.selectedLabel = selectedLabel;
        this.bgPath = bgPath;
        this.curStep = 3;
      },
      // 完成第三步
      finishStep3 (data) {
        const { introduce } = data;
        const { selectedLabel, workRoomName } = this;
        let params = {
          workRoomName,
          groupTag: selectedLabel.map(item => item.label).join(','),
          groupIcon: this.bgPath,
          groupIntro: introduce
        }
        if (this.workRoomId) params.roomId = this.workRoomId;
        let url = `${window.baseURL}/neighbor/neighborInteraction/openWorkRoom?${querystring.stringify(params)}`;
        this.$JHttp({
          method: 'GET',
          url: url
        }).then(res => {
          if (res.status === 100) {
            this.$router.push('/life/daren');
          } else {
            this.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            })
          }
        }).catch(e => {
          console.log(e)
        });
      },
      step2Back () {
        this.curStep = 1;
      },
      step3Back () {
        this.curStep = 2;
      },
      initData () {
        let url = `${window.oldBaseURL}/scNeighborGroupActionV36!workRoomDetail.action`;
        let params = {};
        if (this.workRoomId) {
          params.workRoomId = this.workRoomId;
        }
        this.fetchFormData(url, params, data => {
          const { shopName, from, headPic, workroomPic, introduce, label, workRoomId } = data;
          this.introduce = introduce;
          this.headPic = headPic || '../../../assets/images/default_avatar.png';
          this.selectedLabel = label.split(',');
          this.workRoomId = workRoomId;
          this.workRoomName = shopName;
          this.bgPath = workroomPic;
        });
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>

</style>
