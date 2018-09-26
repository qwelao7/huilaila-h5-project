import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

const state = {
  token: '',
  communityId: '',
  userInfo: {},
  address: {
    community: {},
    yuan: '',
    zhuang: '',
    roomInfo: {},
    role: {}
  },
  assetId: '',
  isOnlyWorld: true,
  confirmOrdersData: {}
};
const mutations = {
  updateUserInfo (state, openInfo) {
    state.userInfo = openInfo;
  },
  updateToken (state, token) {
    state.token = token;
  },
  updateCommunityId (state, community) {
    state.communityId = community.communityId
  },
  updateAddress (state, address) {
    state.address.community = address.community;
    state.address.yuan = address.yuan;
    state.address.zhuang = address.zhuang;
    state.address.roomInfo = address.roomInfo;
    state.address.role = address.role;
  },
  updateAssetId (state, assetId) {
    state.assetId = assetId;
  },
  updateIsOnlyWorld (state, isOnlyWorld) {
    state.isOnlyWorld = isOnlyWorld;
  },
  updateConfirmOrdersData (state, confirmOrdersData) {
    state.confirmOrdersData = confirmOrdersData
  }
};

const actions = {};
export default new Vuex.Store({
  state,
  mutations,
  actions
})
