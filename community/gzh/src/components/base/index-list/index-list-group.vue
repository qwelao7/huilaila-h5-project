<template>
  <li class="cube-index-list-group">
    <h2 class="cube-index-list-anchor" v-html="group.name"></h2>
    <ul>
      <slot>
        <cube-index-list-item v-for="(item, index) in group.items" :key="index" :item="item" :value="value" @select="selectItem"></cube-index-list-item>
      </slot>
    </ul>
  </li>
</template>

<script>
  import CubeIndexListItem from './index-list-item.vue'
  const COMPONENT_NAME = 'cube-index-list-group'
  const EVENT_SELECT = 'select'
  export default {
    name: COMPONENT_NAME,
    props: {
      value: {
        type: String,
        default () {
          return ''
        }
      },
      group: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    methods: {
      selectItem (item) {
        this.$emit(EVENT_SELECT, item)
      }
    },
    components: {
      CubeIndexListItem
    }
  }
</script>
