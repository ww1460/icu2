<template>
  <div>
      <nurseTask v-if="roleCodes == 'ROLE_NURSE'"></nurseTask>
      <matronTask v-else-if ="roleCodes == 'ROLE_MATRON'"></matronTask>
      <AdminIndex v-else-if ="roleCodes=='ROLE_ADMIN'" ></AdminIndex>

  
  </div>
</template>

<script>
import matronTask from './task/matronTask'
import nurseTask from './task/nurseTask'
import { mapGetters,mapState } from 'vuex'

export default {
  name: 'Wel',
  components:{
    matronTask,
    nurseTask
  },
  data() {
    return {
      // roleCodes:'',
    }
  },
    computed:{
    ...mapState({
      roleCodes: state => state.user.roleCodes
    })
  },
  mounted(){
  },
  methods: {
  }
}
</script>

<style scoped="scoped" lang="scss">
</style>
