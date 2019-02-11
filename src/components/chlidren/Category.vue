<template>
  <div class="Category">
    <!-- 标题 -->
    <div class="Title">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>分类</el-breadcrumb-item>
        <el-breadcrumb-item>类别列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-row>
      <el-col :span="1" :push="1">
          <el-button type="primary" @click="OpenAdd()">
            <i class="el-icon-plus"></i>添加
          </el-button>
      </el-col>
    </el-row>
    <el-row style="margin-top:15px;">
      <el-col :span="20" :push="1">
        <el-table :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)" style="width: 100%" border>
          <el-table-column prop="create_date" label="创建时间" width="180"></el-table-column>
          <el-table-column prop="style_id" label="类别ID" width="180"></el-table-column>
          <el-table-column prop="style_name" label="类别" width="180"></el-table-column>
          <el-table-column prop="imgUrl" label="图片" width="180">
          <!-- 图片的显示 -->
          <template slot-scope="scope">
          <img
          v-for="item in scope.row.imgUrl"
          :src="item"
          min-width="40"
          height="40"
          class="CommodityImg"
          >
          </template>
          </el-table-column>
          <el-table-column prop="is_valid" label="类别" width="180" :formatter="formatSex"></el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click="Edit(scope.$index,tableData)" type="text" size="small">修改</el-button>
              <el-button type="text" size="small" @click="ConsultaRemove(scope.$index,tableData)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 翻页 -->
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

<!-- 添加修改 -->
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      @close='closeDialog'
      width="30%">
      <el-form ref="form" :model="form" :label-width="formLabelWidth">
        <el-form-item label="类别名称：">
            <el-input v-model="form.style_name"></el-input>
        </el-form-item>
        <el-form-item label="是否有效：" :label-width="formLabelWidth">
          <el-select v-model="Effectvalue" placeholder="请选择">
            <el-option
              v-for="item in EffectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
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
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="AddCatgory()" v-show="isShow">添 加</el-button>
        <el-button type="primary" @click="Modify()" v-show="isModify">修 改</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "Category",
  data() {
    return {
      tableData: [],
      total: 1000, //默认数据总数
      pagesize: 10, //每页的数据条数
      currentPage: 1, //默认开始页面
      title:'',
      dialogVisible: false,
      isShow: false,
      isModify:false,
      multiple: false,
      panelShow: true,
      formLabelWidth:'100px',
      EffectOptions: [
        {
          value: "1",
          label: "显示"
        },
        {
          value: "0",
          label: "隐藏"
        }
      ],
      Effectvalue: [],
      form: {
          style_name: '',
          style_id:''
        },
      fileList2:[],
      Addimg:'',
      MyImgList:''
    };
  },
  created: function() {
    let that = this;
    that.loadMessage();
  },
  methods: {
    loadMessage() {
      let that = this;
      let url = "/api/oms/v1/style/list";
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
              console.log(res.data.obj)
              that.tableData = res.data.obj.data
              that.total = res.data.obj.totalPage * that.pagesize
              for (let i in res.data.obj.data) {
              let iTem = [];
              let image = [];
              image.push("/api" + res.data.obj.data[i].icon_src);
              that.tableData[i].imgUrl = image;
              iTem = that
                .$moment(res.data.obj.data[i].create_date)
                .format("YYYY-MM-DD HH:mm:ss");
              that.tableData[i].create_date = iTem;
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
      formatSex(row, column, cellValue) {
      if (cellValue === "1") {
        return "显示";
      } else {
        return "隐藏";
      }
    },
     // 上传
    uploadFile(file) {
      let that = this;
      that.formDate.append("picfile", file.file);
    },
    closeDialog(){
      let that = this
      that.Effectvalue = ''
      that.form.style_name = ''
      that.$refs.upload.clearFiles();
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
            that.Addimg = res.data.obj;
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
    OpenAdd(){
      let that = this
      that.dialogVisible = true
      that.title = '添加类别'
      that.isShow = true
      that.isModify = false
    },
    AddCatgory(){
      let that = this
      console.log(that.Effectvalue,that.form.style_name,that.Addimg,'所有添加数据')
      if(that.Addimg != ''){
        var Mybannr = that.Addimg.join()
      }
      let MyForm = {
        	"style_name": that.form.style_name, //类别名称
          "icon_src":Mybannr, //类别图标
          "is_valid":that.Effectvalue //1：可用 0：不可用
      }
      console.log(MyForm)
      let timestamp = Date.parse(new Date())
      let url = '/api/oms/v1/style'
      that.$axios.post(url,MyForm,{
            headers: {
              "Content-Type": "application/json;charset=utf-8",
              Timestamp: timestamp,
              SignInfo: that.$md5(timestamp + "jewelry")
            }
      }).then(res=>{
        console.log(res)
        if(res.data.mark == '0'){
          that.loadMessage()
          that.dialogVisible = false
          that.isShow = false
          that.Effectvalue = ''
          that.form.style_name = ''
          that.$refs.upload.clearFiles();
        }else if(res.data.mark == '100'){
          that.$message({
              message:'登录超时，请从新登录！',
              type:'warning'
            })
            setInterval(() => { 
              that.$router.push({ path: '/' });
            }, 1000)
        }else{
          that.$message.error(res.data.tip);
        }
      }).catch(res=>{
        console.log(res)
      })
    },
    Edit(index,item){
      let that = this
      let timestamp = Date.parse(new Date())
      let url = '/api/oms/v1/style/' + item[index].style_id
      that.dialogVisible = true;
      that.title = '修改类别'
      that.isModify = true;
      that.isShow = false
      that.$axios.get(url,{
          headers: {
              "Content-Type": "application/json;charset=utf-8",
              Timestamp: timestamp,
              SignInfo: that.$md5(timestamp + "jewelry")
          }
      }).then(res=>{
        if(res.data.mark == '0'){
          console.log(res.data.obj,'数据')
          that.form.style_name = res.data.obj.style_name
          that.Effectvalue = res.data.obj.is_valid
          that.form.style_id = res.data.obj.style_id
          that.fileList2 = []
          let MyPhopo = '/api' + res.data.obj.icon_src
          that.MyImgList = res.data.obj.icon_src
          that.fileList2.push({url:MyPhopo})
        }
      }).catch(res=>{
        console.log(res)
      })
    },
    Modify(){
      let that = this
      let timestamp = Date.parse(new Date())
      let url = '/api/oms/v1/style'
      if(that.Addimg != ''){
        var ModifyImg = that.Addimg.join()
      }else{
        var ModifyImg = that.MyImgList
      }
      let MyModifyList = {
        	"style_id":that.form.style_id, //类别id（必填）
          "style_name": that.form.style_name, //类别名称
          "icon_src":ModifyImg, //类别图标
          "is_valid":that.Effectvalue //1：可用 0：不可用
      }
      that.$axios.put(url,MyModifyList,{
          headers: {
              "Content-Type": "application/json;charset=utf-8",
              Timestamp: timestamp,
              SignInfo: that.$md5(timestamp + "jewelry")
          }
      }).then(res=>{
          if(res.data.mark == '0'){
              that.loadMessage()
              that.dialogVisible = false
              that.isModify = false
              that.isShow = false
              that.$message({
                message:'修改成功！',
                type:'success'
              })
          }else if(res.data.mark == '100'){
            that.$message({
              message:'登录超时，请从新登录！',
              type:'warning'
            })
            setInterval(() => { 
              that.$router.push({ path: '/' });
            }, 1000)
          }else{
            that.$message.error(res.data.tip);
          }
      }).catch(res=>{
        console.log(res)
      })
    },
    // 删除
    ConsultaRemove(index,item){
        let that = this
        let timestamp = Date.parse(new Date())
        let url = '/api/oms/v1/style/' + item[index].style_id
        that.$axios.delete(url,{
            headers: {
              "Content-Type": "application/json;charset=utf-8",
              Timestamp: timestamp,
              SignInfo: that.$md5(timestamp + "jewelry")
            }
        }).then(res=>{
          console.log(res)
            if (res.data.mark == "0") {
            item.splice(index, 1);
            that.loadMessage()
            that.$message({
              message: "删除成功！",
              type: "success"
            });
          }else if(res.data.mark == '100'){
            that.$message({
              message:'登录超时，请从新登录！',
              type:'warning'
            })
            setInterval(() => { 
              that.$router.push({ path: '/' });
            }, 1000)
          }else{
            that.$message.error(res.data.tip);
          }
        }).catch(res=>{
          console.log(res)
        })
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
      let url ="/api/oms/v1/style/list?currentPage=" + currentPage + "&pageSize=" + that.pagesize;
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
          for (let i in res.data.obj.data) {
              let iTem = [];
              let image = [];
              image.push('/api' + res.data.obj.data[i].icon_src);
              that.tableData[i].imgUrl = image;
              iTem = that
                .$moment(res.data.obj.data[i].create_date)
                .format("YYYY-MM-DD HH:mm:ss");
              that.tableData[i].create_date = iTem;
            }
        })
        .catch(error => {
          console.log(error);
        });
    },
  }

};
</script>
<style lang="css" scoped>
.Category {
  width: 100%;
  height: 100%;
  background: white;
}
.Title {
  padding: 15px;
}
</style>
