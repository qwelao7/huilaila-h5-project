<template>
  <div class="pay-keyboard-wrapper">
    <div class="header-wrapper vux-1px-b">
      <span class="icon" @click="closeKeyboard"></span>
      <span class="title">请输入支付密码</span>
    </div>
    <div class="password-wrapper">
      <div class="rect-password">
        <div class="password-item" v-for="pass in passwords">
          <span class="pass" v-show="pass"></span>
        </div>
      </div>
      <div class="forget-password" v-if="false">忘记密码</div>
    </div>
    <div class="keyboard-wrapper vux-1px-t">
      <div class="line-one">
        <div class="container" v-for="line in datas.lineOne" @click="typePassword(line.num)">
          <span class="top" v-text="line.num"></span>
          <span class="bottom" :class="line.letters" v-text="line.letters"></span>
        </div>
      </div>
      <div class="line-two">
        <div class="container" v-for="line in datas.lineTwo" @click="typePassword(line.num)">
          <span class="top" v-text="line.num"></span>
          <span class="bottom" v-text="line.letters"></span>
        </div>
      </div>
      <div class="line-three">
        <div class="container" v-for="line in datas.lineThree" @click="typePassword(line.num)">
          <span class="top" v-text="line.num"></span>
          <span class="bottom" v-text="line.letters"></span>
        </div>
      </div>
      <div class="line-four">
        <div class="container left">
        </div>
        <div class="container middle" @click="typePassword('0')">
          <span class="text">0</span>
        </div>
        <div class="container right" @click="deletePassword">
          <span class="icon"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {lineOne, lineTwo, lineThree} from './data';
  export default {
    name: 'hello',
    created: function () {
      this.datas.lineOne = lineOne;
      this.datas.lineTwo = lineTwo;
      this.datas.lineThree = lineThree;
    },
    data () {
      return {
        passwords: ['', '', '', '', '', ''],
        datas: {
          lineOne: [],
          lineTwo: [],
          lineThree: []
        }
      }
    },
    methods: {
      // 关闭键盘
      closeKeyboard: function () {
        this.$emit('closeKeyboard');
        this.passwords = ['', '', '', '', '', ''];
      },
      // 输入密码
      typePassword: function (password) {
        let passwords = this.passwords;
        for (var i = 0; i < passwords.length; i++) {
          var pass = passwords[i];
          if (!pass) { // 遇到第一个空字符串,就插入
            // this.passwords[i] = password;
            // 上面的写法不会更新视图
            this.$set(this.passwords, i, password);
            if (i === passwords.length - 1) { // 表示已经输到最后一位密码
              let targetPassword = this.passwords.join('');
              this.$emit('balancePay', targetPassword);
            }
            return;
          }
        }
      },
      // 删除密码
      deletePassword: function () {
        let passwords = this.passwords;
        if (!passwords[0]) { // 表示所有密码均清空了
          return;
        }
        for (var i = passwords.length - 1; i >= 0; i--) {
          var pass = passwords[i];
          if (pass) { // 找到最后一位密码,并删除之
            this.$set(passwords, i, '');
            return;
          }
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .pay-keyboard-wrapper {
    width: 100%;
    height: 100%;
    background-color: #fff;
    .header-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 1.173333rem;
      .icon {
        position: absolute;
        left: 0.4rem;
        top: 0.373333rem;
        display: inline-block;
        width: 0.426667rem;
        height: 0.426667rem;
        background-size: 100%;
        background-repeat: no-repeat;
        background-image: url("../../../assets/img/@2x/close.png");
      }
      .title {
        color: #333;
        font-size: 18px;
        line-height: 18px;
      }
    }
    .password-wrapper {
      padding: 0.533333rem 0.4rem 0.613333rem 0.4rem;
      .rect-password {
        border-radius: 0.2rem;
        border: 1px solid #c4c4c4;
        display: flex;
        height: 1.413333rem;
        width: 100%;
        .password-item {
          border-right: 1px solid #c4c4c4;
          height: 100%;
          width: 16.666666%;
          display: flex;
          align-items: center;
          justify-content: center;
          .pass {
            display: inline-block;
            width: 0.24rem;
            height: 0.24rem;
            border-radius: 50%;
            background-color: #000;
          }
        }
      }
      .rect-password div:last-child {
        border-right: none;
      }
      .forget-password {
        margin-top: 0.4rem;
        text-align: right;
        color: #18adfb;
        font-size: 14px;
      }
    }
    .keyboard-wrapper {
      .line-one, .line-two, .line-three, .line-four {
        display: flex;
        .container {
          width: 33.333333%;
          height: 1.733333rem;
          background-color: #fff;
          border-right: 1px solid #eaeaea;
          border-bottom: 1px solid #eaeaea;
          display: flex;
          flex-direction: column;
          justify-content: center;
          color: #333;
          .top, .bottom {
            text-align: center;
          }
          .top {
            font-size: 28px;
            line-height: 28px;
          }
          .bottom {
            font-size: 12px;
          }
        }
        .container:active {
          background-color: #D1D6DC;
        }
      }
      .line-one div:last-child, .line-two div:last-child,
      .line-three div:last-child, .line-four div:last-child  {
        border-right: none;
      }
      .line-one {
        .container {
          .none {
            opacity: 0;
          }
        }
      }
      .line-four {
        .left {
          background-color: #D1D6DC;
        }
        .middle, .right {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .middle {
          font-size: 28px;
          line-height: 28px;
        }
        .right {
          background-color: #D1D6DC;
          .icon {
            display: flex;
            width: 0.613333rem;
            height: 0.453333rem;
            background-size: 100%;
            background-repeat: no-repeat;
            background-image: url("../../../assets/img/@2x/keyboard_del.png");
          }
        }
        .right:active {
          background-color: #fff;
          .icon {
            background-image: url("../../../assets/img/@2x/keyboard_del-active.png");
          }
        }
      }
    }
  }
  [data-dpr="2"]
  .pay-keyboard-wrapper {
    .header-wrapper {
      .title {
        font-size: 36px;
        line-height: 36px;
      }
    }
    .password-wrapper {
      .forget-password {
        font-size: 30px;
      }
    }
    .keyboard-wrapper {
      .line-one, .line-two, .line-three {
        .container {
          .top {
            font-size: 54px;
            line-height: 54px;
          }
          .bottom {
            font-size: 24px;
          }
        }
      }
      .line-four {
        .middle {
          font-size: 54px;
          line-height: 54px;
        }
      }
    }
  }
  [data-dpr="3"]
  .pay-keyboard-wrapper {
    .header-wrapper {
      .icon {
        background-image: url("../../../assets/img/@3x/close@3x.png");
      }
      .title {
        font-size: 60px;
        line-height: 60px;
      }
    }
    .password-wrapper {
      .forget-password {
        font-size: 54px;
      }
    }
    .keyboard-wrapper {
      .line-one, .line-two, .line-three {
        .container {
          .top {
            font-size: 82px;
            line-height: 82px;
          }
          .bottom {
            font-size: 42px;
          }
        }
      }
      .line-four {
        .middle {
          font-size: 82px;
          line-height: 82px;
        }
        .right {
          .icon {
            background-image: url("../../../assets/img/@3x/keyboard_del@3x.png");
          }
        }
        .right:active {
          .icon {
            background-image: url("../../../assets/img/@3x/keyboard_del-active@3x.png");
          }
        }
      }
    }
  }
</style>
