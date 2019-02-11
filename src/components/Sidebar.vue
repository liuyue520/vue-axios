<template>
  <div class="container-Sidebar">
    <el-row class="tac">
      <el-col :span="24">
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
        >
              <router-link to="/Consultation"><el-menu-item index="1-1">资讯</el-menu-item></router-link>
              <router-link to="/Ctable"><el-menu-item index="1-2">商品</el-menu-item></router-link>
              <router-link to="/Order"><el-menu-item index="1-3">订单</el-menu-item></router-link>
              <router-link to="/Category"><el-menu-item index="1-4">类别列表</el-menu-item></router-link>
              <router-link to="/Customer"><el-menu-item index="1-5">客户列表</el-menu-item></router-link>
              <router-link to="/Administrators"><el-menu-item index="1-6">用户列表</el-menu-item></router-link>
              <router-link to="/Gemstone"><el-menu-item index="1-7">宝石列表</el-menu-item></router-link>
              <router-link to="/Payment"><el-menu-item index="1-8">支付列表</el-menu-item></router-link>
              <router-link to="/Merchant"><el-menu-item index="1-9">商家地址</el-menu-item></router-link>
              <router-link to="/OrderExplain"><el-menu-item index="1-10">订单说明</el-menu-item></router-link>
        </el-menu>
      </el-col>
    </el-row>
    <div class="rigth">
        <router-view :key="key"></router-view>
    </div>
  </div>
</template>
<script>
export default {
    name: 'Sidebar',
  data() {
    return {

    };
  },
  computed:{
    // 加入key只，在页面加载的时候实现刷新
	    key(){
	        return this.$route.path + Math.random();
	    }
	}
};
</script>
<style lang="css">
.container-Sidebar {
  height: 100%;
  width: 15%;
  border-right: 1px solid lightgray;
  box-sizing: border-box;
  background: white;
}
.left {
  width: 15%;
  border: 1px solid black;
  height: 100%;
}
.rigth {
  width: 85%;
  height: 100%;
  position: absolute;
  right: 0;
  top: 80px;
}
.el-menu{
  border: none;
}
</style>

