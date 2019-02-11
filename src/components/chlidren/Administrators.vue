<template>
    <div class="Administrators">
      <!-- 标题 -->
        <div class="Title">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>分类</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <!-- 添加用户 -->
        <el-row>
          <el-col :push="2">
              <div style="margin-top:15px">
                  <el-button type="primary" @click="dialogVisible = true">添加</el-button>
              </div>
          </el-col>
        </el-row>
        <!-- 用户列表 -->
        <el-row>
          <el-col :span='12' :push="2">
              <el-table
              :data="tableData"
              stripe
              style="width: 100%">
              <el-table-column
                prop="user_id"
                label="用户id"
                width="180">
              </el-table-column>
              <el-table-column
                prop="username"
                label="用户姓名"
                width="180">
              </el-table-column>
              <el-table-column
                prop="wechat"
                label="使用的微信客服">
              </el-table-column>
              <el-table-column>
                <template slot-scope="scope">
                  <el-button @click="Edit(scope.$index,tableData)" type="text" size="small">修改</el-button>
                  <el-button type="text" size="small" @click="UserDelete(scope.$index,tableData)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>

        <!-- 添加框 -->
        <el-dialog
        title="添加用户"
        :visible.sync="dialogVisible"
        width="30%"
        >
        <el-form :model="ruleForm"  label-width="100px" class="demo-ruleForm">
            <el-form-item label="用户名" prop="name">
              <el-input v-model="ruleForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码：" prop="name">
              <el-input v-model="ruleForm.password" type="password"></el-input>
            </el-form-item>
            <el-form-item label="客服微信号：" prop="name">
              <el-input v-model="ruleForm.wechat"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="AddUser()">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改 -->
      <el-dialog
        title="修改密码"
        :visible.sync="EditVisible"
        width="30%"
        >
        <el-form :model="EditForom"  label-width="100px" class="demo-ruleForm">
            <el-form-item label="用户名" prop="name">
              <el-input v-model="EditForom.username"></el-input>
            </el-form-item>
            <el-form-item label="密码：" prop="name">
              <el-input v-model="EditForom.oldPassword" type="password"></el-input>
            </el-form-item>
            <el-form-item label="新密码：" prop="name">
              <el-input v-model="EditForom.newPassword"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="EditVisible = false">取 消</el-button>
          <el-button type="primary" @click="EditVPass()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>
<script>
export default {
  name: "Administrators",
  data() {
    return {
      tableData:[],
      dialogVisible: false,
      EditVisible:false,
      ruleForm:{
        username:'',
        password:'',
        wechat:''
      },
      EditForom:{
          username: '',
          oldPassword:'',
          newPassword:''
      },
      EditName:""
    };
  },
  created: function() {
    let that = this
    that.LoadAdmin()
   if(that.$cookies.get("CookieName") == null){
       that.$router.push({ path: '/' });
    }
  },
  methods: {
    LoadAdmin(){
      let that = this
      let timestamp = Date.parse(new Date());
      let url = '/api/user/list' 
      that.$axios.get(url,{
          headers: {
            "Content-Type": "application/json;charset=utf-8",
            Timestamp: timestamp,
            SignInfo: that.$md5(timestamp + "jewelry")
          }
      }).then(res=>{
        if(res.data.mark == '0'){
         that.tableData = res.data.obj
        }else if(res.data.mark == "100"){
            that.$message.error(res.data.tip);
            setInterval(() => { 
              that.$router.push({ path: '/' });
            }, 1000)
          }
      }).catch(res=>{

      })
    },
    AddUser(){
      let that = this;
      that.dialogVisible = true;
      let timestamp = Date.parse(new Date());
      let url = '/api/user';
      let SubForm = {
            "username":that.ruleForm.username,
            "password":that.ruleForm.password,
            "wechat":that.ruleForm.wechat
      }
      if(that.ruleForm.username != '' && that.ruleForm.password != '' && that.ruleForm.wechat !=''){
        that.$axios.post(url,SubForm,{
            headers: {
              "Content-Type": "application/json;charset=utf-8",
              Timestamp: timestamp,
              SignInfo: that.$md5(timestamp + "jewelry")
            }
        }).then(res=>{
          // console.log(res,'用户列表');
          if(res.data.mark == '0'){
           that.tableData = res.data.obj
           that.LoadAdmin()
           that.ruleForm.username = ''
           that.ruleForm.password = ''
           that.ruleForm.wechat = ''
           that.dialogVisible = false
          }
        }).catch(res=>{

        })
      }else{
        that.$message({
          message:'请输入账号密码和微信号！',
          type: 'warning'
        })
      }
    },
    Edit(index,item){
      let that = this
      that.EditVisible = true;
      that.EditForom.username = item[index].username
    },
    EditVPass(){
      let that = this
      let url = '/api/user/password'
      let timestamp = Date.parse(new Date())
      let NewForm = {
          "username": that.EditForom.username,
          "oldPassword": that.EditForom.oldPassword,
          "newPassword":that.EditForom.newPassword
      }
      if(that.EditForom.username != '' &&  that.EditForom.oldPassword != '' && that.EditForom.newPassword != ''){
          that.$axios.put(url,NewForm,{
              headers: {
                  "Content-Type": "application/json;charset=utf-8",
                  Timestamp: timestamp,
                  SignInfo: that.$md5(timestamp + "jewelry")
              }
          }).then(res=>{
              if(res.data.mark == '0'){
                  that.$message({
                      message:'修改成功！',
                      type:'success'
                  })
                  that.that.EditForom.username = ''
                  that.EditForom.oldPassword = ''
                  that.EditForom.newPassword = ''
                  that.EditVisible = false
              }else{
                if(res.data.mark == '100'){
                    that.$message({
                      message:res.data.tip,
                      type:'warning'
                    }) 
                  setInterval(() => {
                      that.$router.push({ path: "/" });
                    }, 1000);
                }
                  that.$message({
                      message:res.data.tip,
                      type:'warning'
                  })  
              }
          }).catch(res=>{
              console.log(res)
          })
      }else{
        that.$message({
              message:'输入你的新密码',
              type: "warning"
        })
      }
    },
    UserDelete(index,item){
      let that = this
      let timestamp = Date.parse(new Date())
      let url = '/api/user/' + item[index].username
      that.$axios.delete(url,{
          headers: {
            "Content-Type": "application/json;charset=utf-8",
            Timestamp: timestamp,
            SignInfo: that.$md5(timestamp + "jewelry")
          }
      }).then(res=>{
          console.log(res)
          if(res.data.mark == 0){
            item.splice(index, 1);
            that.LoadAdmin() 
            that.$message({
              message:'删除成功',
              type:'success'
            }) 
          }else{
            that.$message({
              message:res.data.tip,
              type:'warning'
            })
          }
      }).catch(res=>{
        console.log(res)
      })
    }
  }
};
</script>
<style lang="css" scoped>
.Administrators {
  background: white;
  width: 100%;
  height: 100%;
}
.Title {
  padding: 15px;
}
</style>
