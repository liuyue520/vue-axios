<template>
    <div class="OrderExplain">
      <!-- 标题 -->
        <div class="Title">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>分类</el-breadcrumb-item>
            <el-breadcrumb-item>订单说明</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <!-- 添加用户 -->
        <!-- <el-row>
          <el-col :push="2">
              <div style="margin-top:15px">
                  <el-button type="primary" @click="dialogVisible = true">添加</el-button>
              </div>
          </el-col>
        </el-row> -->
        <!-- 用户列表 -->
        <el-row style="margin-top:15px">
          <el-col :span='10' :push="1">
            <el-form ref="form" :model="form" label-width="80px" :disabled="formState">
              <el-form-item label="活动形式">
                <el-input type="textarea" v-model="form.desc" :rows="15" ></el-input>
              </el-form-item>
            </el-form>
              <el-button type="primary" @click="OpenEdit()" v-show="Edit" class="Edit">
                  修 改
              </el-button>
              <el-button type="primary" @click="OpenRevision()" v-show="Revision" class="Edit">
                  确认修改
              </el-button>
          </el-col>
        </el-row>
    </div>
</template>
<script>
export default {
  name: "OrderExplain",
  data() {
    return {
      form:{
        desc:''
      },
      formState:true,
      Edit:true,
      Revision:false
    };
  },
  created: function() {
    let that = this
    that.LoadAdmin()

  },
  methods: {
    LoadAdmin(){
      let that = this
      let timestamp = Date.parse(new Date());
      let url = '/api/oms/v1/biz/order/description' 
      that.$axios.get(url,{
          headers: {
            "Content-Type": "application/json;charset=utf-8",
            Timestamp: timestamp,
            SignInfo: that.$md5(timestamp + "jewelry")
          }
      }).then(res=>{
        if(res.data.mark == '0'){
          console.log(res)
         that.form.desc = res.data.obj.content
        }else if(res.data.mark == "100"){
            that.$message.error(res.data.tip);
            setInterval(() => { 
              that.$router.push({ path: '/' });
            }, 1000)
          }
      }).catch(res=>{

      })
    },
    OpenEdit(){
        let that = this
        that.formState = false
        that.Edit = false
        that.Revision = true
    },
    OpenRevision(){
        let that = this
        let timestamp = Date.parse(new Date());
        let url = '/api/oms/v1/biz/order/description' 
        // if(that.form.desc != ''){
        let MyDesc = {"content":that.form.desc}
        // }
        console.log(MyDesc)
      that.$axios.put(url,MyDesc,{
          headers: {
            "Content-Type": "application/json;charset=utf-8",
            Timestamp: timestamp,
            SignInfo: that.$md5(timestamp + "jewelry")
          }
      }).then(res=>{
        console.log(res)
          if(res.data.mark == '0'){
            that.formState = true
            that.Edit = true
            that.Revision = false
            that.LoadAdmin
            that.$message({
                  message:"修改成功！",
                  type: "success"
              })
          }else if(res.data.mark == '100'){
              that.$message({
                  message:"登录超时，请从新登录！",
                  type: "warning"
              })
            setInterval(() => {
              that.$router.push({ path: "/" });
            }, 1000);
          }else{
            that.$message.error(res.data.tip);
          }
      }).catch(res=>{
        console.log(res)
      })
    }
  }
};
</script>
<style lang="css" scoped>
.OrderExplain {
  background: white;
  width: 100%;
  height: 100%;
}
.Title {
  padding: 15px;
}
.Edit{
    float: right;
}
</style>
