<template>
  <div class="container-fluid">
      <div class="container">
          <div class="container-nav nav-left">
              <img class="nav-logo" src="../assets/logo.png">
          </div>
          <div class="container-nav nav-conter">
          </div>
          <div class="container-nav nav-right">
              <div class="UserMassage">
                  <div class="UserImg">
                    <img src="../assets/User.jpg" >
                  </div>
                  <div class="UserName">
                      <el-dropdown trigger="click">
                        <span class="el-dropdown-link UName">
                          {{UserName}}<i class="el-icon-setting el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item class="clearfix" @click.native="Remove">
                              退出
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                  </div>
              </div>
          </div>
      </div>
      <router-view></router-view>
  </div>
</template>
<script>

export default {
  name: 'HelloWorld',
  data () {
    return {
      UserName:''
    }
  },
  created() {
    this.GetUserName()
  },
  methods:{
    GetUserName(){
      let that = this
      let UserName = that.$cookies.get("CookieName")
      that.UserName = UserName.username
    },
    Remove(){
      let that = this
      let timestamp = Date.parse(new Date());
      
      let url = '/api/logout'
      that.$axios.get(url,{
            headers: {
              'Content-Type': 'multipart/form-data',
          }
      })
      .then(res => {
          if(res.data.mark == '0'){
            that.$cookies.remove("CookieName")
            that.$router.push('/')
          }
      })
      .catch(error => {
          console.log(error);
      });
      
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="css">
.container-fluid{
  width: 100%;
  height: 100%;
  background: rgb(169, 218, 224);
}
.container{
  width: 100%;
  height: 80px;
  margin: 0 auto;
  }
  .container-nav{
    height: 100%;
    float: left;
  }
  .nav-left{
    width: 15%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
 .nav-logo{
   width: 50%;
  }
  .nav-conter{
    width: 60%;
    padding: 10px;
  }
  .item {
    margin-top: 10px;
    margin-right: 40px;
  }
  .nav-right{
    width: 20%;
  }
  .right-content{
    list-style: none;
    line-height: 80px;
  }
  .UserMassage{
    display: flex;
    align-items: center;
    height: 100%;
    justify-content: center;
  } 
  .UserImg{
    width: 40px;
    height: 40px;
  }
  .UserImg img{
    width: 40px;
    height: 40px;
  }
  .UserName{
    margin-left: 10px;
    height: 40px;
    position: relative;
    top:15px;
  }
  .UName{
    font-size: 18px;
  }
</style>
