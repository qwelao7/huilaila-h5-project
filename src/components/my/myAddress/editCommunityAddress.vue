<template>
  <div class="commonHeader addNewCommunityAddress">
    <x-header
      slot="header"
      :left-options="{backText: ''}"
      title="修改小区地址">
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
      <group>
        <div class="submit"><x-button type="primary" action-type="button" @click.native="editAddress">保存</x-button></div>
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
        title1: '所居住的小区',
        title2: '苑、幢、单元室',
        title3: '身份',
        community: {},
        address: {},
        addressStr: '',
        role: {}
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
        let assetId = this.$route.params.assetId;
        this.assetId = assetId;
        let localAddress = this.$store.state.address;
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
      editAddress () {
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
        let assetId = this.$store.state.assetId;
        if (!assetId) {
          assetId = localStorage.setItem('assetId', assetId);
        }
        bindAddress.assetId = assetId;
        this.$JHttp({
          url: window.baseURL + '/ownerAsset/updateAddress?' + querystring.stringify(bindAddress),
          method: 'put'
        }).then(res => {
          if (res.status === 100) {
            // 修改完成,清空选中的房产地址信息
            this.$store.commit('updateAddress', {});
            localStorage.setItem('address', JSON.stringify({}));
            this.$router.go(-1);
          } else {
            this.$vux.toast.show({
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
    .remark {
      margin-top: .2rem;
      color: #333;
      font-size: 14px;
    }
  }
</style>


