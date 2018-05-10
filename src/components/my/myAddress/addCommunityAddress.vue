<template>
  <div class="commonHeader addNewCommunityAddress">
    <x-header
      slot="header"
      :left-options="{backText: ''}"
      title="新增小区地址">
    </x-header>
    <div class="addressSelect">
      <p>请选择正确的小区地址，你可安全、便捷地使用快递代收和各类生活服务</p>
      <group>
        <group title-color="#aaaaaa">
          <group-title slot="title" v-show="community.id">所居住的小区</group-title>
          <x-input placeholder="所居住的小区" v-model="community.name" readonly :show-clear="false" @click.native="goChoose">
            <img slot="right" src="../../../assets/images/arrow_icon_grey32.png" alt="" style="width: .32rem;height: .32rem;margin-top: .1rem">
          </x-input>
        </group>
      </group>
      <group v-show="community.id">
        <group title-color="#aaaaaa">
          <group-title slot="title">苑、幢、单元室</group-title>
          <x-input placeholder="苑、幢、单元室" v-model="addressStr" readonly :show-clear="false" @click.native="goChooseGarden">
            <img slot="right" src="../../../assets/images/arrow_icon_grey32.png" alt="" style="width: .32rem;height: .32rem;margin-top: .1rem">
          </x-input>
        </group>
      </group>
      <group v-show="addressStr">
        <group title-color="#aaaaaa">
          <group-title slot="title" v-show="role">身份</group-title>
          <x-input placeholder="请选择你的身份" v-model="role.name" readonly :show-clear="false" @click.native="chooseIdentity">
            <img slot="right" src="../../../assets/images/arrow_icon_grey32.png" alt="" style="width: .32rem;height: .32rem;margin-top: .1rem">
          </x-input>
        </group>
      </group>
      <group v-if="isNeedName && addressStr">
        <group title-color="#aaaaaa">
          <group-title slot="title" v-show="realName">姓名</group-title>
          <x-input placeholder="输入您的真实姓名" v-model="realName" :show-clear="false"></x-input>
        </group>
      </group>
      <group class="submit">
        <div><x-button type="primary" action-type="button" @click.native="addAddress">确认提交</x-button></div>
      </group>
      <div class="remark">提交小区地址之后,我们会在一个工作日内核实你的申请</div>
    </div>
  </div>
</template>
<script>
  import { XHeader, Group, GroupTitle, Cell, XInput, XTextarea, XButton, querystring } from 'vux'
  export default {
    name: 'addNewCommunityAddress',
    components: {
      XHeader,
      Group,
      GroupTitle,
      Cell,
      XInput,
      XTextarea,
      XButton
    },
    data () {
      return {
        community: {},
        address: {},
        addressStr: '',
        role: {},
        realName: '',
        isNeedName: false
      }
    },
    created () {
      this.bindData()
    },
    methods: {
      goChoose () {
        this.$router.push('/chooseCommunity')
      },
      goChooseGarden () {
        this.$router.push({
          name: 'chooseGarden',
          params: {
            source: -1
          }
        })
      },
      chooseIdentity () {
        this.$router.push('/chooseIdentity');
      },
      bindData () {
        let _this_ = this;
        _this_.$JHttp({
          method: 'get',
          url: window.baseURL + '/home/getUserInfoAndAsset',
          headers: {
            defCommunityId: localStorage.getItem('communityId')
          }
        }).then(res => {
          let status = res.status;
          if (status === 100) {
            let data = res.data;
            let realName = data.userName;
            if (!realName) {
              _this_.isNeedName = true;
            } else {
              _this_.isNeedName = false;
            }
          } else {
            _this_.$vux.toast.show({
              type: 'error',
              text: res.msg
            });
          }
        }).catch(error => {
          console.error(error);
        })
        let localAddress = this.$store.state.address;
        // 刷新则清空
//        if (!localAddress || !localAddress.community || !localAddress.community.id) {
//          localAddress = localStorage.getItem('address');
//          localAddress = JSON.parse(localAddress);
//        }
        let zhuang;
        let roomInfo;
        let community;
        if (localAddress) {
          zhuang = localAddress.zhuang;
          roomInfo = localAddress.roomInfo;
          // 幢为必填项,如果为空,则清空当前选择房产树
          if (!zhuang) {
            this.$store.commit('updateAddress', {});
            localStorage.setItem('address', JSON.stringify({}));
            return;
          }
          community = localAddress.community;
          if (community) {
            this.community = community;
          }
          this.address = localAddress;
          if (roomInfo) {
            if (localAddress.yuan) {
              this.addressStr += localAddress.yuan + '-';
            }
            // 幢必然存在
            this.addressStr += localAddress.zhuang;
            if (roomInfo.unit) {
              this.addressStr += ('-' + roomInfo.unit);
            }
            if (roomInfo.room) {
              this.addressStr += ('-' + roomInfo.room)
            }
          }
          if (localAddress.role) {
            this.role = localAddress.role;
          }
        }
      },
      addAddress () {
        let address = this.$store.state.address;
        if (!address || !address.community || !address.community.id) {
          address = localStorage.getItem('address');
          address = JSON.parse(address);
          this.$vux.toast.show({
            type: 'cancel',
            text: '请选择小区地址'
          });
          return;
        }
        let bindAddress = {};
        let roomInfo = address.roomInfo;
        if (!roomInfo || !roomInfo.id) {
          let community = address.community;
          if (!community || !address.zhuang) {
            this.$vux.toast.show({
              type: 'cancel',
              text: '请选择小区地址'
            });
            return;
          } else {
            // 没有具体房号
            bindAddress.communityId = community.id;
            bindAddress.regAddress = address.yuan;
            bindAddress.regBuild = address.zhuang;
          }
        } else {
          bindAddress.roomId = roomInfo.id;
        }
        let role = address.role;
        if (!role || !role.id) {
          this.$vux.toast.show({
            type: 'cancel',
            text: '请选择你的身份信息'
          });
          return;
        }
        bindAddress.role = role.id;
        // 验证真实姓名
        if (this.isNeedName && !this.realName) {
          this.$vux.toast.show({
            type: 'cancel',
            text: '请完善你的姓名'
          });
          return;
        }
        bindAddress.realName = this.isNeedName ? this.realName : undefined;
        let _this_ = this;
        this.$JHttp({
          url: window.baseURL + '/ownerAsset/addAddress?' + querystring.stringify(bindAddress),
          method: 'post'
        }).then(res => {
          if (res.status === 100) {
            // 添加完成,清空选中的房产地址信息
            _this_.$store.commit('updateAddress', {});
            localStorage.setItem('address', JSON.stringify({}));
            _this_.$router.go(-1);
          } else {
            _this_.$vux.toast.show({
              type: 'cancel',
              text: res.msg
            })
          }
        }).catch(e => {
          console.error(e);
        });
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .addNewCommunityAddress{
    .addressSelect{
      padding: .4rem .3rem;
    }
    .submit{
      margin-top: 20px;
      margin-bottom: 15px;
      .weui-cells:after{
        border: none;
      }
    }
    .remark {
      margin-top: .2rem;
      color: #333;
      font-size: 14px;
    }
    .weui-btn_primary{
      background: #0DAB60!important;
    }
  }
</style>


