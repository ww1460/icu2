<template>
   <div class="quickMenu">
      <quick-menu
         :menu-count="count"
         :icon-class="icons"
         :menu-url-list="list"
         :position="position"
         :backgroundColor="theme"
         :color="color"
         style="z-index:2000"
      ></quick-menu>
   </div>
</template>

<script>
import { mapGetters } from "vuex";
import quickMenu from "vue-quick-menu";
import { searchQuickMenu } from "@/api/admin/menu";
export default {
   name: "quickMenuIndex",
   components: {
      quickMenu
   },
   data() {
      return {
         count: 0,
         position: "bottom-right",
         color: "#eee",
         icons: [
            // "icon-zhexiantu",
            // "icon-navicon-zdgl",
            // "icon-quanxianguanli",
            // "icon-erji-zuhushouye"
         ],
         list: [
            // { isLink: true, url: "/icu/process/entryDepartment/index" },
            // { isLink: true, url: "/icu/assessment/assRecords" },
            // { isLink: true, url: "/icu/patient/info/index" },
            // { isLink: true, url: "/wel" }
         ]
      };
   },
   created() {
      this.getList();
   },
   computed: {
      ...mapGetters(["theme"])
   },
   methods: {
      getList() {
         searchQuickMenu().then(res => {
            var data = res.data.data.slice(0, 4);
            this.count = data.length;
            data.forEach(i => {
               this.icons.push(i.icon);
               this.list.push({ isLink: true, url: i.path});
            });
         });
      }
   }
};
</script>


<style lang="scss">
.quickMenu {
   .menu {
      margin: 0;
      padding: 0;
      border: 0;
   }
   .sub-menu:hover {
      opacity: 0.8;
   }
}
</style>
