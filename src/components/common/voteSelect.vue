 <template>
  <div class="voteSelect no-margin-top commonHeader">
    <view-box ref="viewBox" body-padding-top="1.253333rem" body-padding-bottom="0">
      <x-header
        slot="header"
        :left-options="{backText: ''}" title="调查投票"
        style="width:100%;position:absolute;left:0;top:0;z-index:100">
      </x-header>
      <!--<div v-if="detailObj !== {}"><detailBanner :pageData="detailObj"></detailBanner></div>-->
      <div class="detailBanner">
        <p class="tit">{{detailObj.title}}</p>
        <div class="pubTime">
          <span>{{detailObj.endTime}}</span>
        </div>
        <div class="bannerImg">
          <!--<img :src="detailObj.ico" alt="">-->
          <div class="activityReq">
            <p v-html="detailObj.introduce"></p>
          </div>
        </div>
      </div>
      <div v-for="(item,i) in radioData" class="vote_select">
        <p class="tit">{{item.des}}</p>
        <div class="max">
          <span>最多选1个</span>
        </div>
        <!--<checklist label-position="left" :options="datas" v-model="select" @on-change="change"></checklist>-->
        <checker
          :type="item.typeName"
          radio-required
          class="checker"
          :max="1"
          default-item-class="default-item-class"
          selected-item-class="selected-item-class1">
          <checker-item :value="data" v-for="(data, index) in item.options" :key="index" class="checkItem" @click.native="onClick(item, data)">
            <span>{{data.des}}</span>
          </checker-item>
        </checker>
      </div>
      <div v-for="item in checkBoxData" class="vote_select">
        <p class="tit">{{item.des}}</p>
        <div class="max">
          <span>最多选{{item.maxSCnt}}个</span>
        </div>
        <checker
          :type="item.typeName"
          class="checker"
          :max="item.maxSCnt"
          default-item-class="default-item-class"
          selected-item-class="selected-item-class1">
          <checker-item :value="data" v-for="(data, index) in item.options" :key="index" class="checkItem" @click.native="onClick1(item, data)">
            <span>{{data.des}}</span>
            <!--<i :class="{choose:choosed === data.id}"></i>-->
          </checker-item>
        </checker>
      </div>
      <div class="submit" @click="joinUs">确认提交</div>
    </view-box>
  </div>
</template>
<script>
  import {Checklist, XHeader, ViewBox, Checker, CheckerItem, querystring} from 'vux'
  export default {
    name: 'voteSelect',
    components: {
      Checklist,
      ViewBox,
      Checker,
      XHeader,
      CheckerItem
    },
    data () {
      return {
        detailObj: {},
        typeName: '',
        radioData: [],
        checkBoxData: [],
        commonList: [],
        commonList1: [],
        commonList2: []
      }
    },
    created () {
      this.getVoteInformation();
    },
    methods: {
      getVoteInformation () {
        this.$vux.loading.show({
          text: '加载中'
        });
        let params = {
          voteId: this.$route.params.id,
          defCommunityId: localStorage.getItem('communityId'),
          companyCode: window.commonConfig.companyCode
        };
        let _this = this;
        this.$JHttp({
          method: 'get',
          url: window.oldBaseURL + '/scVoteAction!getPaper.action?' + querystring.stringify(params)
        }).then(res => {
          if (res.status === '100') {
            this.$vux.loading.hide();
            _this.detailObj = res.data;
            let question = _this.detailObj.questions;
            question.forEach(function (v, i) {
              if (v.type === 1) {
                v.typeName = 'radio';
                _this.radioData.push(v)
              } else if (v.type === 2) {
                v.typeName = 'checkbox';
                v.options.forEach(res => {
                  res.isExit = false
                });
                _this.checkBoxData.push(v)
              }
            });
            _this.detailObj.type = 'survey';
          } else {
            this.$vux.loading.hide();
            this.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            })
          }
        }).catch(err => {
          console.log(err);
        })
      },
      joinUs () {
        let selectedCount = this.commonList.length;
        let totalCount = this.detailObj.questions.length;
        if (selectedCount !== totalCount) {
          this.$vux.toast.show({
            type: 'cancel',
            text: '每个问题至少选择一项'
          });
          return;
        }
        let params = {
          voteId: this.$route.params.id,
          companyCode: window.commonConfig.companyCode,
          questions: JSON.stringify(this.commonList),
          token: localStorage.getItem('token'),
          type: 1
        };
        console.log(params);
        let _this = this;
        _this.$JHttp({
          method: 'get',
          url: window.oldBaseURL + '/scVoteAction!saveResult.action?' + querystring.stringify(params)
        }).then(res => {
          console.log(res, '提交结果');
          if (res.status === '100') {
            _this.$vux.toast.show({
              type: 'success',
              text: '投票成功'
            });
            this.$router.go(-1)
          } else {
            _this.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            })
//            _this.$vux.confirm.show({
//              title: '您未绑定房号，暂时不能进行投票',
//              content: '是否前往绑定？',
//              onConfirm () {
//                _this.$router.push('/addCommunityAddress')
//              }
//            })
          }
        })
      },
      onClick (data, item) {
        console.log(item);
        let obj = {
          qid: data.id,
          options: [
            {
              oid: item.id
            }
          ]
        };
        if (this.commonList1.length > 0) {
          for (let i = 0; i < this.commonList1.length; i++) {
            if (data.id === this.commonList1[i].qid) {
              this.commonList1[i].options[0].oid = item.id;
              break;
            } else {
              if (i === this.commonList1.length - 1) {
                this.commonList1.push(obj);
              } else {
                continue;
              }
            }
          }
        } else {
          this.commonList1.push(obj);
        }
        this.commonList = this.commonList1.concat(this.commonList2);
      },
      onClick1 (data, item) {
        /* eslint-disable no-labels */
        let obj = {
          qid: data.id,
          options: [{oid: item.id}]
        };
        if (this.commonList2.length <= 0) {
          this.commonList2.push(obj);
          item.isExit = true;
        } else {
          // 先拷贝一份
          let tmpCommonList2 = JSON.parse(JSON.stringify(this.commonList2));
          outer:
          for (let i = 0; i < this.commonList2.length; i++) {
            let questions = this.commonList2[i];
            let tmpQuestions = tmpCommonList2[i];
            if (data.id !== questions.qid) {
              if (i === this.commonList2.length - 1) {
                tmpCommonList2.push(obj);
                item.isExit = true;
              } else {
                continue;
              }
            } else {
              if (questions.options.length < data.maxSCnt) {
                if (item.isExit === false) {
                  console.log(1);
                  tmpQuestions.options.push({oid: item.id});
                  item.isExit = true;
                  break;
                } else {
                  console.log(2);
                  if (questions.options.length <= 1) {
                    tmpCommonList2.pop();
                    item.isExit = false;
                    break;
                  } else {
                    for (let k = 0; k < questions.options.length; k++) {
                      let answerId = questions.options[k];
                      if (item.id === answerId.oid) {
                        tmpQuestions.options.splice(k, 1);
                        item.isExit = false;
                        break outer;
                      }
                    }
                  }
                }
              } else {
                for (let j = 0; j < questions.options.length; j++) {
                  let answerIds = questions.options[j];
                  if (item.id === answerIds.oid) {
                    tmpQuestions.options.splice(j, 1);
                    item.isExit = false;
                    break outer;
                  }
                }
              }
            }
          }
          this.commonList2 = tmpCommonList2;
        }
        console.log(999, this.commonList2);
        this.commonList = this.commonList1.concat(this.commonList2);
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .voteSelect{
    height: 100%;
    .tit{
      font-size: 18px;
      font-weight: bold;
    }
    .vote_select{
      padding: 15px;
    }
    .max{
      display: flex;
      align-items: center;
      justify-content: flex-end;
      span{
        font-size: 15px;
        color: #0DAB60;
      }
    }
    .checker{
      width: 100%;
      margin-top: 10px;
      overflow: auto;
      border: 0.5px solid #d8d8d8;
      background-color: #f8f8f8;
      .checkItem:last-child{
        border-bottom: none;
      }
      .checkItem{
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        width: 100%;
        padding: 15px 15px 15px 10px;
        border-bottom: 0.5px solid #d8d8d8;
        position: relative;
        span{
          flex: 1;
          font-size: 18px;
          margin-right: 30px;
          word-break: break-all;
          /*padding-left: .2rem;*/
        }
        i{
          position: absolute;
          left:95%;
          top: 17px;
          width: 22px;
          height: 22px;
          background-image: url("../../assets/images/unchecked_icon_grey.png");
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }
        .choose{
          background-image: url("../../assets/images/checked_icon_green.png");
        }
      }
    }
    .default-item-class{
      background: url("../../assets/images/unchecked_icon_grey.png") no-repeat 95% 17px / contain;
      background-size: 22px 22px;
    }
    .selected-item-class{
      background-color: rgba(13,171,96,0.20);
    }
    .selected-item-class1{
      background: url("../../assets/images/checked_icon_green.png") no-repeat 95% 17px / contain;
      background-size: 22px 22px;
      background-color: rgba(13,171,96,0.20);
      border: none;
    }
    .detailBanner{
      background-color: #ffffff;
      padding: 10px 0;
      .tit{
        font-size: 24px;
        color: #333333;
        padding: 0 15px;
      }
      .pubTime{
        margin-top: 10px;
        padding: 0 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        span{
          font-size: 12px;
          color: #aaaaaa;
        }
      }
      .bannerImg{
        margin-top: 15px;
        .imgList{
          margin-top: 12px;
          padding: 0 15px;
          ul{
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            .onePic{
              width: 100%;
            }
            .twoPic{
              width: 50%;
            }
            li{
              width: 32%;
              margin-bottom: 5px;
              margin-left: 5px;
            }
            li:nth-child(3n+1){
              margin-left: 0;
            }
          }
          img{
            width: 100%;
            height: 100%;
          }
        }
        .activityReq{
          margin-top: 15px;
          padding: 0 15px;
          p{
            font-size: 18px;
            color: #333333;
          }
        }
      }
      .banner{
        background-color: #0DAB60 ;
        justify-content: center;
        color: #ffffff;
        padding: 16px 15px;
        i{
          width: 28px;
          height: 28px;
          background-position: center;
          background-size: contain;
          background-repeat: no-repeat;
        }
        span{
          font-size: 15px;
          color: #ffffff;
          margin-left: 10px;
        }
      }
      .signUp i{
        background-image: url("../../assets/images/enroll_icon_56white.png");
      }
      .voted{
        background-color: #aaaaaa;
      }
      .vote i{
        background-image: url("../../assets/images/vote_icon_56white.png");
      }
    }
    .submit{
      width:90%;
      height: 44px;
      background: #0DAB60;
      text-align: center;
      line-height: 44px;
      color: #ffffff;
      font-size: 18px;
      margin: 20px auto;
      border-radius: 8px;
    }
    .vote_input{
      width:100%;
      height: 55px;
      line-height: 55px;
      border:0.5px solid #D8D8D8;
      border-bottom: none;
      font-size: 16px;
      padding-left: 10px;
    }
    .vote_input label{
      vertical-align: middle;
    }
    .vote_input input{
      float: right;
      margin-right: 10px;
      margin-top: 15px;
      vertical-align: middle;
    }
    .vote_input:nth-last-child(1){
      border-bottom: 0.5px solid #D8D8D8;
    }
    input[type=checkbox] {
      visibility: hidden;
    }
    input[type=radio] {
      visibility: hidden;
    }
    .checkboxFourInput{
      position: absolute;
      top: -10px;
      left: 10px;
      z-index:2;
    }
    .checkboxFour {
      margin-top: 15px;
      margin-right: 10px;
      display: inline-block;
      width: 20px;
      height: 20px;
      float: right;
      border-radius: 100%;
      position: relative;
      border:solid 0.5px #D8D8D8;
    }
    .checkboxFour label {
      display: block;
      width: 20px;
      height: 20px;
      border-radius: 100px;
      -webkit-transition: all .5s ease;
      -moz-transition: all .5s ease;
      -o-transition: all .5s ease;
      -ms-transition: all .5s ease;
      transition: all .5s ease;
      cursor: pointer;
      position: absolute;
      top: 0;
      left: 0;
      /*z-index: 1;*/
      background: #fff;
    }
    /**
 * Create the checked state
 */
    .checkboxFour input[type=checkbox]:checked + label {
      background: url("../../assets/images/checked_icon_green.png") center;
      background-size: cover;
    }
    .checkboxFour input[type=radio]:checked + label {
      background: url("../../assets/images/checked_icon_green.png") center;
      background-size: cover;
    }
  }
</style>
