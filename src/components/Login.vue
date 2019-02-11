<template>
    <div class="context" >
      
       <el-card class="box-card">
        <div slot="header" class="clearfix">
          <div class="PojName">Masterpiece名铸珠宝管理系统</div>
            <!-- <span class="LoginTitle">登录</span> -->
        </div>
        <div class="text item">
          <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
            <el-form-item prop="account">
              <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"></el-input>
            </el-form-item>
            <el-form-item prop="checkPass">
              <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码"></el-input>
            </el-form-item>
            <!-- <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox> -->
            <el-form-item style="width:100%;">
              <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
              <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
            </el-form-item>
          </el-form>
        </div>
        </el-card>
        <!-- <div class="modue">
          <Modular :NameText='ruleForm2.account' />
        </div> -->
    </div>
</template>

<script>
export default {
    data() {
      return {
        logining: false,
        ruleForm2: {
          account: '',
          checkPass: ''
        },
        rules2: {
          account: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            //{ validator: validaePass }
          ],
          checkPass: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            //{ validator: validaePass2 }
          ]
        },
        checked: true
      };
    },
    components:{
      // Modular
    },
    created(){
      var that = this;
      document.onkeydown = function(e) {
        var key = window.event.keyCode;
          if (key == 13) {
            that.handleSubmit2()
        }
      }
    },
    methods: {
      handleReset2() {
        this.$refs.ruleForm2.resetFields();
      },
      handleSubmit2(ev) {
        var that = this
        // _this.$router.replace('/Ctable');
        that.$refs.ruleForm2.validate((valid) => {
          console.log(valid)
          if (valid) {
            //_this.$router.replace('/table');
            that.logining = true;
            //NProgress.start();
          let url = '/api/tologin'
          let timestamp = Date.parse(new Date());
          that.$axios.post(url,
          {
           username: that.ruleForm2.account,
           password: that.ruleForm2.checkPass
          },{
              headers: {
                  'Content-Type': 'application/json;charset=utf-8',
                  'Timestamp':timestamp,
                  'SignInfo':that.$md5(timestamp + 'jewelry')
              }
          })
          .then(res => {
            if (res.data.mark == "0") {
              that.$cookies.set("CookieName",res.data.obj)
              that.$message({
                  message: '登录成功！',
                  type: 'success'
                });
              that.$router.push({ path: '/Consultation' });
            }else{
              that.$message.error(res.data.tip);
              that.logining = false;
            }
          })
          .catch(error => {
            console.log(error);
          });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
};
</script>

<style lang="css" scoped>
  .context {
    width: 100%;
    height: 100%;
    background: url('../assets/Login.jpg');
    background-repeat: no-repeat;
    background-size: cover;
  }
  .PojName{
    font-size: 20px;
    font-weight: bold;
    color: white; 
    text-align: center;
  }
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 400px;
    height: 300px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    background: none;
    border: none;
    box-shadow: 0px 0px 2px 2px lightgrey;
  }
  .LoginTitle{
    font-size: 20px;
    font-weight: bold;
    color: white;
  }
  .remember {
      margin: 0px 0px 10px 0px;
    }
</style>
