<template>
  <div>
    <basic-container>
      <task :parents="parent"></task>
    </basic-container>
  </div>
</template>

<script>
import task from '../../nurse/nurseIndex/taskList'
import { mapGetters } from 'vuex'

export default {
  name: 'matronTask',
  components: {
    task
  },
  data() {
    return {
      parent: {}
    }
  },
  computed: {
  },
  mounted() {
  },
  created() {
    this.parentFunction()
  },
  methods: {
    parentFunction() {
      this.parent.code = 'matronTask'
    }
  }
}
</script>

<style scoped="scoped" lang="scss">
</style>
