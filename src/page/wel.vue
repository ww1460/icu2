<template>
  <div>
      <nurseIndex v-if="roleCodes == 'ROLE_NURSE'"></nurseIndex>
      <matronIndex v-else-if ="roleCodes == 'ROLE_MATRON'"></matronIndex>
      <AdminIndex v-else-if ="roleCodes=='ROLE_ADMIN'" ></AdminIndex>

  
  </div>
</template>

<script>
import AdminIndex from './AdminIndex'
import matronIndex from './matronIndex'
import nurseIndex from './nurseIndex'
import { mapGetters,mapState } from 'vuex'

export default {
  name: 'Wel',
  components:{
    AdminIndex,
    matronIndex,
    nurseIndex,
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
