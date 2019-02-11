<template>
  <div class="Consultation">
    <div class="Title">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>分类</el-breadcrumb-item>
        <el-breadcrumb-item>资讯</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-row>
      <el-col class="addBtn" :span="1" :push="1">
        <div style="margin-top:15px">
          <el-button type="primary" @click="OpenAdd()">
            <i class="el-icon-plus"></i>添加
          </el-button>
        </div>
      </el-col>
      <el-col :span="6" :push="16">
        <div class="grid-content bg-purple-dark">
          <div style="margin-top: 15px;">
            <el-input placeholder="请输入咨讯ID" v-model="search" class="input-with-select">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 咨讯 -->
    <el-row style="margin-top: 15px;">
      <el-col :span="22" :push="1">
        <el-table
          :data="tables.slice((currentPage-1)*pagesize,currentPage*pagesize)"
          border
          max-height="600"
          style="width: 100%"
        >
          <el-table-column fixed prop="create_date" label="创建时间" width="235"></el-table-column>
          <el-table-column prop="news_title" label="资讯标题" width="120"></el-table-column>
          <el-table-column prop="id" label="ID" width="50"></el-table-column>
          <el-table-column prop="view_date" label="时间" width="110"></el-table-column>
          <el-table-column prop="news_state" label="状态" :formatter="formatSex" width="110"></el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click="Edit(scope.$index,tableData)" type="text" size="small">修改</el-button>
              <el-button type="text" size="small" @click="ConsultaRemove(scope.$index,tableData)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="fy"
          layout="prev, pager, next"
          @current-change="current_change"
          :total="total"
          background
        ></el-pagination>
      </el-col>
    </el-row>

    <!-- 添加 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="40%" @close='closeDialog'>
      <el-form :model="form">
        <el-form-item label="资讯标题：" :label-width="formLabelWidth">
          <el-input v-model="form.news_title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="时间：" :label-width="formLabelWidth">
          <div class="block">
            <el-date-picker
              v-model="value15"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="咨讯状态：" :label-width="formLabelWidth">
          <!-- <el-input v-model="form.news_state" autocomplete="off"></el-input> -->
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="咨讯内容：" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.news_content" ></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth">
          <el-upload
            :multiple="multiple"
            action="/api/oms/v1/uploadPic"
            list-type="picture-card"
            :auto-upload="false"
            :http-request="uploadFile"
            ref="upload"
            v-show="panelShow"
            :limit="1"
            :file-list="fileList2"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-button type="primary" style="margin-top:15px;" @click="subPicForm()">上传图片</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="AddC()" v-show="AddCShow">确 定</el-button>
        <el-button type="primary" @click="Modify()" v-show="ModifyShow">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "Consultation",
  data() {
    return {
      title: "",
      tableData: [],
      dialogFormVisible: false,
      AddCShow: false,
      ModifyShow: false,
      form: {
        news_title: "",
        news_state: "",
        news_content: "",
        view_date: "",
        news_pic: ""
      },
      formLabelWidth: "100px",
      value15: "",
      multiple: false,
      IngName: [],
      search: "",
      panelShow: true,
      Uping: "",
      options: [
        {
          value: "1",
          label: "显示"
        },
        {
          value: "2",
          label: "不显示"
        }
      ],
      value: "",
      Immobility: false,
      dialogVisible: false,
      total: 0, //默认数据总数
      pagesize: 10, //每页的数据条数
      currentPage: 1, //默认开始页面
      Namesearch: "",
      ModifyIndex: "",
      fileList2:[],
      SeeImg:''
    };
  },
  created: function() {
    let that = this;
    that.Consultation();
  },
  computed: {
    // 模糊搜索
    tables() {
      // 搜索
      const search = this.search;
      // let url = "oms/v1/news/";
      if (search) {
        // filter() 方法创建一个新的数组，新数组中的元素是通过检查指定数组中符合条件的所有元素。
        // 注意： filter() 不会对空数组进行检测。
        // 注意： filter() 不会改变原始数组。
        return this.tableData.filter(data => {
          // some() 方法用于检测数组中的元素是否满足指定条件;
          // some() 方法会依次执行数组的每个元素：
          // 如果有一个元素满足条件，则表达式返回true , 剩余的元素不会再执行检测;
          // 如果没有满足条件的元素，则返回false。
          // 注意： some() 不会对空数组进行检测。
          // 注意： some() 不会改变原始数组。
          return Object.keys(data).some(key => {
            // indexOf() 返回某个指定的字符在某个字符串中首次出现的位置，如果没有找到就返回-1；
            // 该方法对大小写敏感！所以之前需要toLowerCase()方法将所有查询到内容变为小写。
            return (
              String(data[key])
                .toLowerCase()
                .indexOf(search) > -1
            );
          });
        });
      }
      return this.tableData;
      if (dialogVisible == true) {
        this.Immobility == false;
      }
    }
  },
  methods: {
    Consultation: function() {
      let that = this;
      let timestamp = Date.parse(new Date());
      let url = "/api/oms/v1/news/list";
      that.$axios
        .get(url, {
          headers: {
            "Content-Type": "application/json;charset=utf-8",
            Timestamp: timestamp,
            SignInfo: that.$md5(timestamp + "jewelry")
          }
        })
        .then(res => {
          console.log(res)
          if (res.data.mark == "0") {
            that.tableData = res.data.obj.data;
            that.total = res.data.obj.totalPage * that.pagesize;
          } else if (res.data.mark == "100") {
            that.$message.error(res.data.tip);
            setInterval(() => {
              that.$router.push({ path: "/" });
            }, 1000);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    closeDialog(){
     let that = this
      that.$refs.upload.clearFiles();
      that.form.news_title = "";
      that.form.news_state = "";
      that.form.news_content = "";
      that.value15 = "";
      that.value = ''
    },
    OpenAdd() {
      let that = this;
      that.dialogFormVisible = true;
      that.AddCShow = true;
      that.title = "添加资讯";
    },
    handleClick(row) {
      console.log(row);
    },
    // 上传
    uploadFile(file) {
      let that = this;
      that.formDate.append("picfile", file.file);
    },
    // 上传图片
    subPicForm() {
      let that = this;
      let timestamp = Date.parse(new Date());
      let url = "/api/oms/v1/uploadPic";
      that.formDate = new FormData();
      that.$refs.upload.submit();
      that.formDate.append("WS_CODE", "12133");
      that.$axios
        .post(url, that.formDate, {
          headers: {
            "Content-Type": "multipart/form-data",
            Timestamp: timestamp,
            SignInfo: that.$md5(timestamp + "jewelry")
          }
        })
        .then(res => {
          if (res.data.mark == "0") {
            that.Uping = res.data.obj;
            that.$message({
              message: "图片上传成功",
              type: "success"
            });
            console.log(res.data.obj);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 添加
    AddC() {
      let that = this;
      let timestamp = Date.parse(new Date());
      let myurl = "/api/oms/v1/news";
      if (that.Uping != "") {
        var mynews_pic = that.Uping.join();
      }
      let myDate = {
        news_title: that.form.news_title, //资讯标题
        news_pic: mynews_pic, //资讯图片
        news_content: that.form.news_content, //资讯内容
        news_state: that.value, //1：显示 0：不显示
        view_date: that.value15 //显示的日期
      };
      console.log(myDate)
      if (
        that.form.news_title != "" ||
        mynews_pic != undefined ||
        that.form.news_content != ""
      ) {
        that.$axios
          .post(myurl, myDate, {
            headers: {
              "Content-Type": "application/json;charset=utf-8",
              Timestamp: timestamp,
              SignInfo: that.$md5(timestamp + "jewelry")
            }
          })
          .then(res => {
            if (res.data.mark == "0") {
              that.Consultation();
              that.dialogFormVisible = false;
              that.AddCShow = false;
              that.$refs.upload.clearFiles();
              that.form.news_title = "";
              that.form.news_state = "";
              that.form.news_content = "";
              that.value15 = "";
            }
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        that.$message({
          message: "请填写你的内容",
          type: "warning"
        });
      }
    },
    // 删除
    ConsultaRemove(index, rows) {
      let that = this;
      let News_ID = that.tableData[index].id;
      let url = "/api/oms/v1/news/" + News_ID;
      let timestamp = Date.parse(new Date());
      that.$axios
        .delete(url, {
          headers: {
            "Content-Type": "multipart/form-data",
            Timestamp: timestamp,
            SignInfo: that.$md5(timestamp + "jewelry")
          }
        })
        .then(res => {
          if (res.data.mark == "0") {
            rows.splice(index, 1);
            that.$message({
              message: "删除成功！",
              type: "success"
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    formatSex(row, column, cellValue) {
      if (cellValue === "1") {
        return "显示";
      } else {
        return "不显示";
      }
    },
    // 编辑
    Edit(index, rows) {
      let that = this;
      that.title = "修改资讯";
      that.dialogFormVisible = true;
      that.index = index;
      that.AddCShow = false;
      that.ModifyShow = true;
      let timestamp = Date.parse(new Date());
      let url = "/api/oms/v1/news/" + rows[index].id;
      that.$axios
        .get(url, {
          headers: {
            "Content-Type": "application/json;charset=utf-8",
            Timestamp: timestamp,
            SignInfo: that.$md5(timestamp + "jewelry")
          }
        })
        .then(res => {
          let MyPhopo = []
          if (res.data.mark == "0") {
            console.log(res.data.obj)
            that.form = res.data.obj;
            that.value15 = res.data.obj.view_date;
            that.value = res.data.obj.news_state;
            let MyphopoList = "/api" + res.data.obj.news_pic
            that.SeeImg = res.data.obj.news_pic
            MyPhopo.push({url:MyphopoList})
            that.fileList2 = MyPhopo
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    Modify() {
      let that = this
      let timestamp = Date.parse(new Date());
      let url = "/api/oms/v1/news"
      console.log(that.form)
      if(that.Uping != ''){
        var ModifyImg = that.Uping.join()
      }else{
        var ModifyImg = that.SeeImg
      }
      let ModifyData = {
        	"id":that.form.id, 
          "news_title":that.form.news_title,
          "news_pic": ModifyImg,
          "news_content": that.form.news_content,
          "news_state": that.value,
          "view_date": that.form.view_date
      }
      console.log(that.form.news_state)
      that.$axios.put(url,ModifyData, {
          headers: {
            "Content-Type": "application/json;charset=utf-8",
            Timestamp: timestamp,
            SignInfo: that.$md5(timestamp + "jewelry")
          }
        })
        .then(res => {
          console.log(res)
          if (res.data.mark == "0") {
            that.Consultation()
            that.dialogFormVisible = false;
            that.ModifyShow = false;
            that.$refs.upload.clearFiles();
            that.form.news_title = "";
            that.form.news_state = "";
            that.form.news_content = "";
            that.value15 = "";
            that.value = ''
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 0) {
        return "th";
      }
      return "";
    },
    switchChange() {
      this.istag = !this.istag;
    },
    created: function() {
      // this.total = this.tableData.length;
    },
    current_change: function(currentPage) {
      let that = this;
      // console.log(currentPage, "页数");
      let url ="/api/oms/v1/news/list?currentPage=" +  currentPage + "&pageSize=" + that.pagesize;
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
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>
<style lang="css" scoped>
.Consultation {
  width: 100%;
  height: 100%;
  background: white;
}
.Title {
  padding: 15px;
}
.fy {
  margin-top: 15px;
}
</style>
