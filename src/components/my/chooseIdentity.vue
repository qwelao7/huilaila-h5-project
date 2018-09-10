<template>
  <div class="commonHeader identity">
    <x-header
      slot="header"
      :left-options="{backText: ''}"
      title="请选择身份">
    </x-header>
    <!--<div class="role-list" v-for="role in roleList">-->
      <!--<div class="role-item" v-text="role.name" @click="choose(role)"></div>-->
    <!--</div>-->
    <div class="list">
      <checker
        v-model="selectedRole"
        selected-item-class="selected" class="identities">
        <checker-item
          v-for="role in roleList"
          :key="role.id"
          class="li"
          :value="{id: role.id, name: role.name}"
          @on-item-click="choose">
          <div class="block">
            <span v-text="role.name"></span>
          </div>
        </checker-item>
      </checker>
    </div>
    <span class="remark">注: 请准确选择你的身份</span>
  </div>
</template>
<script>
  import { XHeader, Checker, CheckerItem } from 'vux'
  export default {
    components: {
      XHeader,
      Checker,
      CheckerItem
    },
    data () {
      return {
        roleList: [{
          id: '1',
          name: '业主'
        }, {
          id: '2',
          name: '家属'
        }, {
          id: '3',
          name: '租客'
        }, {
          id: '4',
          name: '伙伴'
        }, {
          id: '5',
          name: '嘉宾'
        }],
        selectedRole: {}
      }
    },
    created () {
      this.getSelectedRole();
    },
    methods: {
      getSelectedRole () {
        let address = this.$store.state.address;
        if (!address) {
          let address = localStorage.getItem('address');
          address = JSON.parse(address);
        }
        if (address) {
          let role = address.role;
          if (role) {
            this.selectedRole = role;
          }
        }
      },
      choose (role) {
        let address = this.$store.state.address;
        if (!address || !address.community || !address.community.id) {
          address = JSON.parse(localStorage.getItem('address'));
        }
        this.$store.commit('updateAddress', {
          ...address,
          ...{
            role: role
          }
        });
        localStorage.setItem('address', JSON.stringify({
          ...address,
          ...{
            role: role
          }
        }));
        this.$router.go(-1);
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  .list{
    padding: 0 15px;
  }
  .identities {
    display: flex;
    flex-direction: column;
    .li{
      display: flex;
      align-items: center;
      padding: 12px 0;
      border-bottom: 0.5px solid #D8D8D8;
      font-size: 16px;
      .block {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
    .selected{
      background: url("../../assets/images/check_icon_orange32.png") right no-repeat ;
      background-size: 16px 16px;
    }
  }
  .remark {
    padding: 15px;
    font-size: 14px;
  }
</style>
