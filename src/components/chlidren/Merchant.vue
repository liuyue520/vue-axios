<template>
    <div class="Merchant">
      <!-- 标题 -->
        <div class="Title">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>分类</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <el-row style="margin-top:15px;">
            <el-col :span="8" :push="1">
                <el-form ref="form" :model="form" label-width="100px" :disabled="formState">
                    <el-form-item label="厂家名称：">
                        <el-input v-model="form.receiver_name"></el-input>
                    </el-form-item>
                    <el-form-item label="厂家电话：">
                        <el-input v-model="form.receiver_phone"></el-input>
                    </el-form-item>
                    <el-form-item label="厂家地址：">
                        <el-input v-model="form.receiver_area"></el-input>
                    </el-form-item>
                    <el-form-item label="详细地址：">
                        <el-input type="textarea" v-model="form.address_details"></el-input>
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
  name: "Merchant",
  data(){
    return {
    form: {
        receiver_area: '',
        address_details:'',
        receiver_name: '',
        id: 0,
        receiver_phone:'',
        cust_id: 0
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
      let url = '/api/oms/v1/address/biz' 
      that.$axios.get(url,{
          headers: {
            "Content-Type": "application/json;charset=utf-8",
            Timestamp: timestamp,
            SignInfo: that.$md5(timestamp + "jewelry")
          }
      }).then(res=>{
          if(res.data.mark == '0'){
              that.form = res.data.obj
              console.log(that.form)
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
        let url = '/api/oms/v1/address/biz' 
        that.$axios.put(url,that.form,{
          headers: {
            "Content-Type": "application/json;charset=utf-8",
            Timestamp: timestamp,
            SignInfo: that.$md5(timestamp + "jewelry")
          }
      }).then(res=>{
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
.Merchant {
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
