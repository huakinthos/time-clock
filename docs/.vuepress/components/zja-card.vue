<template>
  <div class="card">
    <div class="card-content">
      <slot></slot>
      <div v-if="codeVisible"><slot name="code"></slot></div>
    </div>
    <div class="card-tool" @click="toggle">{{msg}}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: '展开代码',
      codeVisible: false
    }
  },
  methods: {
    toggle() {
      this.codeVisible = !this.codeVisible
      this.msg = this.codeVisible ? '收起代码' : '展开代码'
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  border:1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 0 3px 0 #ccc;
  .card-content {
    padding:14px;
    border-bottom:1px solid #ccc;
  }
  .card-tool {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
  }
}
</style>