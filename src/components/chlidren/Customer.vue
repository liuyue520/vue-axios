<template>
  <div class="Customer">
    <!-- 标题 -->
    <div class="Title">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>分类</el-breadcrumb-item>
        <el-breadcrumb-item>客户列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 搜索框 -->
    <el-row style="margin-top:10px;">
      <el-col :span="1" :push="4">
        <div style="margin-top:15px">
          <el-button @click="Reset()">
            <i class="el-icon-refresh"></i>重置
          </el-button>
        </div>
      </el-col>
      <el-col :span="5" :push="5">
        <div class="grid-content bg-purple-dark">
          <div style="margin-top: 15px;">
            <el-input placeholder="请输入用户名字" v-model="cust_name" class="input-with-select">
              <el-button slot="append" icon="el-icon-search" @click="CustName()"></el-button>
            </el-input>
          </div>
        </div>
      </el-col>
      <el-col :span="5" :push="6">
        <div class="grid-content bg-purple-dark">
          <div style="margin-top: 15px;">
            <el-input placeholder="请输入手机号码" v-model="cust_phone" class="input-with-select">
              <el-button slot="append" icon="el-icon-search" @click="CustPhone"></el-button>
            </el-input>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 客户列表 -->
    <el-row style="margin-top:10px;">
      <el-col :span="15" :push="4">
        <el-table
          :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
          border
          style="width: 100%"
        >
          <el-table-column prop="cust_id" label="客户ID" width="50"></el-table-column>
          <el-table-column prop="cust_name" label="姓名" width="90"></el-table-column>
          <el-table-column prop="level_name" label="等级" width="60"></el-table-column>
          <el-table-column prop="cust_phone" label="手机号码" width="120"></el-table-column>
          <el-table-column prop="gender" label="性别" :formatter="formatSex" width="50"></el-table-column>
          <el-table-column prop="city" label="地址" width="300"></el-table-column>
          <el-table-column prop="nickName" label="微信名" width="120"></el-table-column>
          <el-table-column prop="cust_growth" label="成长值" width="120"></el-table-column>
          <el-table-column prop="imgUrl" label="头像" width="120">
            <!-- 图片的显示 -->
            <template slot-scope="scope">
              <img
                v-for="item in scope.row.imgUrl"
                :src="item"
                min-width="30"
                height="30"
                class="CommodityImg"
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="block" style="margin-top:15px;">
          <el-pagination
            class="fy"
            layout="prev, pager, next"
            @current-change="current_change"
            :total="total"
            background
          ></el-pagination>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "Customer",
  data() {
    return {
      tableData: [],
      total: 1000, //默认数据总数
      pagesize: 10, //每页的数据条数
      currentPage: 1, //默认开始页面
      cust_name: "", //名字搜索
      cust_phone: "" //手机号码搜索
    };
  },
  created() {
    let that = this;
    that.Customer();
  },
  methods: {
    Customer() {
      let that = this;
      let url = "/api/oms/v1/customer/list";
      let timestamp = Date.parse(new Date());
      that.$axios
        .get(url, {
          headers: {
            "Content-Type": "application/json;charset=utf-8",
            Timestamp: timestamp,
            SignInfo: that.$md5(timestamp + "jewelry")
          }
        })
        .then(res => {
          if (res.data.mark == "0") {
            that.total = res.data.obj.totalPage * that.pagesize
            that.tableData = res.data.obj.data;
            for (var i in res.data.obj.data) {
              var image = [];
              image.push(res.data.obj.data[i].cust_avatar_url);
              that.tableData[i].imgUrl = image;
            }
          } else if(res.data.mark == "100"){
            that.$message.error(res.data.tip);
            setInterval(() => { 
              that.$router.push({ path: '/' });
            }, 1000)
          }
        })
        .catch(res => {
          console.log(res);
        });
    },
    Reset() {
      let that = this;
      that.Customer();
    },
    CustName() {
      let that = this;
      let timestamp = Date.parse(new Date());
      let url = "/api/oms/v1/customer/list?cust_name=" + that.cust_name;
      if (that.cust_name) {
        that.$axios
          .get(url, {
            headers: {
              "Content-Type": "application/json;charset=utf-8",
              Timestamp: timestamp,
              SignInfo: that.$md5(timestamp + "jewelry")
            }
          })
          .then(res => {
            console.log(res.data.obj, "数据");
            if (res.data.mark == "0") {
              that.tableData = res.data.obj.data;
            }
          })
          .catch(res => {
            console.log(res, "错误");
          });
      }
    },
    CustPhone() {
      console.log(1);
      let that = this;
      let timestamp = Date.parse(new Date());
      let url = "/api/oms/v1/customer/list?cust_phone=" + that.cust_phone;
      if (that.cust_phone) {
        that.$axios
          .get(url, {
            headers: {
              "Content-Type": "application/json;charset=utf-8",
              Timestamp: timestamp,
              SignInfo: that.$md5(timestamp + "jewelry")
            }
          })
          .then(res => {
            console.log(res.data.obj, "手机搜索");
            if (res.data.mark == "0") {
              that.tableData = res.data.obj.data;
            }
          })
          .catch(res => {
            console.log(res, "错误");
          });
      }
    },
    // 翻页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    switchChange() {
      this.istag = !this.istag;
    },
    created: function() {
      this.total = this.tableData.length;
    },
    current_change: function(currentPage) {
      let that = this;
      console.log(currentPage, "页数");
      let url =
        "/api/oms/v1/customer/list?currentPage=" +
        currentPage +
        "&pageSize=" +
        that.pagesize;
      let timestamp = Date.parse(new Date());
      that.$axios
        .get(url, {
          headers: {
            "Content-Type": "multipart/form-data",
            Timestamp: timestamp,
            SignInfo: that.$md5(timestamp + "jewelry")
          }
        })
        .then(res => {
          that.tableData = [];
          for (let i = 0; i < res.data.obj.data.length; i++) {
            let obj = res.data.obj.data;
            that.tableData.push(obj[i]);
          }
          for (var i in res.data.obj.data) {
            var image = [];
            image.push(res.data.obj.data[i].cust_avatar_url);
            that.tableData[i].imgUrl = image;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    formatSex(row, column, cellValue) {
      if (cellValue === 1) {
        return "男";
      } else {
        return "女";
      }
    }
  }
};
</script>

<style lang="css" scoped>
.Customer {
  width: 100%;
  height: 100%;
  background: white;
}
.Title {
  padding: 15px;
}
</style>
