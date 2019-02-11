<template>
  <div class="context">
    <div class="Title">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>分类</el-breadcrumb-item>
        <el-breadcrumb-item>商品</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 精确搜索 -->
    <el-row>
      <el-col class="addBtn" :span="1" :push="1">
        <el-button type="primary" @click="OpenModle()">
          <i class="el-icon-plus"></i>添加
        </el-button>
      </el-col>
      <el-col class="addBtn" :span="1" :push="2">
        <el-button @click="Reset()">
          <i class="el-icon-refresh"></i>重置
        </el-button>
      </el-col>
      <el-col :span="3" :push="3">
        <div style="margin-top: 15px;">
          <el-input placeholder="商品名称" v-model="Namesearch" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="CommoditySearch()"></el-button>
          </el-input>
        </div>
      </el-col>
      <el-col :span="2" :push="4">
        <div style="margin-top:15px">
          <el-select v-model="valid" placeholder="请选择" @change="SelectSearch()">
            <el-option
              v-for="item in EffectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </el-col>
      <el-col :span="6" :push="5">
        <div style="margin-top：15px;padding-top:15px;">
          <el-date-picker
            v-model="ItemValue"
            @change="CreateDate()"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </div>
      </el-col>
      <el-col :span="4" :push="6">
        <div class="grid-content bg-purple-dark">
          <div style="margin-top: 15px;">
            <el-input placeholder="本页搜索" v-model="search" class="input-with-select">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-row style="margin-top: 15px;">
      <el-col :span="22" :push="1">
        <el-table
          :data="tables.slice((currentPage-1)*pagesize,currentPage*pagesize)"
          style="width: 100%;"
          border
          tooltip-effect="dark"
          stripe
          max-height="600"
          class="FormSollce"
        >
          <!-- <el-table-column type="selection" width="55"></el-table-column> -->
          <el-table-column fixed prop="jewelry_id" label="ID" width="50"></el-table-column>
          <el-table-column
            fixed
            prop="create_date"
            label="创建时间"
            width="235"
            value-format="yyyy-MM-dd"
          ></el-table-column>
          <el-table-column prop="jewelry_name" label="商品名称" width="110"></el-table-column>
          <el-table-column prop="style_name" label="类型" width="50"></el-table-column>
          <el-table-column prop="jewelry_specification" label="商品规格" width="80"></el-table-column>
          <el-table-column prop="jewelry_deposit" label="定金" width="60"></el-table-column>
          <el-table-column prop="process_cost" label="价格" width="65"></el-table-column>
          <el-table-column prop="jewelry_growth" label="成长值" width="65"></el-table-column>
          <el-table-column prop="is_valid" label="是否有效" width="80" :formatter="formatSex"></el-table-column>
          <el-table-column prop="is_valid" label="是否有效" width="60"></el-table-column>
          <el-table-column prop="imgUrl" label="图片" min-width="20%">
            <!-- 图片的显示 -->
            <template slot-scope="scope">
              <img
                v-for="item in scope.row.imgUrl"
                :src="item"
                min-width="70"
                height="70"
                class="CommodityImg"
              >
            </template>
          </el-table-column>

          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button type="text" @click="See(scope.$index,tableData)" size="small">修改</el-button>
              <el-button
                @click.native.prevent="deleteRow(scope.$index, tableData)"
                type="text"
                size="small"
              >移除</el-button>
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

    <!-- 添加 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="40%" @close='closeDialog'>
      <el-form :model="form" >
        <el-form-item label="商品名字：" :label-width="formLabelWidth">
          <el-input v-model="form.jewelry_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型：" :label-width="formLabelWidth">
          <el-select v-model="Stylevalue" placeholder="请选择">
            <el-option
              v-for="item in StyleOptions"
              :key="item.style_id"
              :label="item.style_name"
              :value="item.style_id"
            ></el-option>
          </el-select>
        </el-form-item>
          <el-form-item label="规格：" :label-width="formLabelWidth">
            <el-select v-model="Specvlaue" placeholder="请选择">
              <el-option
                v-for="item in Specifications"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
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
          <el-form-item label="定金：" :label-width="formLabelWidth">
            <el-input v-model="form.jewelry_deposit" autocomplete="off" @blur="MyDeposit()"></el-input>
          </el-form-item>
          <el-form-item label="价格：" :label-width="formLabelWidth" >
            <el-input v-model="form.process_cost" autocomplete="off" @blur="YTotal()"></el-input>
            <span class="Total">价格已经包含定金，价格不能少于定金</span>
          </el-form-item>
          <el-form-item label="成长值：" :label-width="formLabelWidth">
            <el-input v-model="form.jewelry_growth" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="上传封面：" :label-width="formLabelWidth">
            <el-upload
              :multiple="multiple"
              action="/api/oms/v1/uploadPic"
              list-type="picture-card"
              :auto-upload="false"
              :http-request="uploadFile"
              ref="upload"
              :limit="1"
              :file-list="fileList2"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-button type="primary" style="margin-top:10px" @click="subPicForm()">上传图片</el-button>
          </el-form-item>
          <el-form-item label="banner：" :label-width="formLabelWidth">
            <el-upload
              :multiple="multiple1"
              action="/api/oms/v1/uploadPic"
              list-type="picture-card"
              :auto-upload="false"
              :http-request="uploadFile1"
              ref="upload1"
              :file-list="fileList3"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-button type="primary" style="margin-top:10px" @click="subPicForm1()">上传图片</el-button>
          </el-form-item>
          <el-form-item label="商品详情：" :label-width="formLabelWidth">
            <el-input type="textarea" v-model="form.Details" :rows="10" ></el-input>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="AddGoods('form')" v-show="isShow">确 定</el-button>
        <el-button type="primary" @click="Modify('form')" v-show="isModify">确认修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "context",
  data() {
    return {
      isShow: false,
      isModify: false,
      tableData: [],
      StyleOptions: [],
      EffectOptions: [
        {
          value: "1",
          label: "有效"
        },
        {
          value: "0",
          label: "无效"
        }
      ],
      Stylevalue: [],
      Effectvalue: [],
      Specvlaue: [],
      Specifications: [
        {
          value: "已有款式",
          label: "已有款式"
        },
        {
          value: "无规格",
          label: "无规格"
        }
      ],
      loading: true,
      dialogVisible: false,
      AddGoodsStatus: false,
      dialogTableVisible: false,
      dialogFormVisible: false,
      Immobility: false,
      labelPosition: "left",
      formLabelAlign: {},
      value14: "",
      value15: "",
      input5: "",
      // 搜索
      search: "",
      Namesearch: "",
      valid: [],
      ItemValue: "",
      // 表单提交
      form: {
        jewelry_name: "", //商品名称
        style_id: "", //商品类别id
        jewelry_specification: "", //商品规格
        jewelry_deposit: "", //定金
        process_cost: "", //加工费
        jewelry_growth: "", //成长值
        jewelry_pic_src: "", //封面图片
        bannerPics: "", //banner图片，图片之间用##分隔
        Details: "", //商品详情
        is_valid: ""
      },
      formLabelWidth: "100px",
      // 上传
      multiple: false,
      multiple1: true,
      cover: "",
      bannerImg: null,
      formDate: "",
      // 翻页
      total: 1000, //默认数据总数
      pagesize: 10, //每页的数据条数
      currentPage: 1, //默认开始页面
      VForm: [],
      TiemValue: [],
      title:'',

      // 图片
      fileList2:[],
      fileList3:[],
      SeeImg:'',
      SeeImgList:''
    };
  },
  created() {
    this.clickAlert();
  },
  computed: {
    // 模糊搜索
    tables() {
      // 搜索
      const search = this.search;
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
    // 初始数据
    clickAlert: function() {
      let that = this;
      var timestamp = Date.parse(new Date());
      var url = "/api/oms/v1/jewelry/list";
      // console.log(url);
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
            that.tableData = res.data.obj.data;
            that.total = res.data.obj.totalPage * that.pagesize
            for (let i in res.data.obj.data) {
              let iTem = [];
              let image = [];
              image.push("/api" + res.data.obj.data[i].jewelry_pic_src);
              that.tableData[i].imgUrl = image;
              iTem = that.$moment(res.data.obj.data[i].create_date).format("YYYY-MM-DD HH:mm:ss");
              that.tableData[i].create_date = iTem;
            }
          } else if(res.data.mark == "100"){  
            that.$message.error(res.data.tip);
            setInterval(() => { 
              that.$router.push({ path: '/' });
            }, 1000)
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    closeDialog(){
      let that = this
      that.form.jewelry_name = ""; //商品名称
      that.form.style_id = ""; //商品类别id
      that.Specvlaue = ""; //商品规格
      that.Stylevalue=''
      that.form.jewelry_deposit = ""; //定金
      that.form.process_cost = ""; //加工费
      that.form.jewelry_growth = ""; //成长值
      that.form.Details = ""; //商品详情
      that.Effectvalue = ""; //是否有效1：有效 0：无效(默认有效)
      that.$refs.upload.clearFiles();
      that.$refs.upload1.clearFiles();
    },
    Reset() {
      let that = this;
      that.clickAlert();
    },
    OpenModle() {
      let that = this;
      that.dialogFormVisible = true;
      that.title = '添加商品'
      that.isShow = true;
      that.isModify = false
      let timestamp = Date.parse(new Date());
      let url = "/api/oms/v1/style/simplelist";
      that.$axios
        .get(url, {
          headers: {
            "Content-Type": "application/json;charset=utf-8",
            Timestamp: timestamp,
            SignInfo: that.$md5(timestamp + "jewelry")
          }
        })
        .then(res => {
          console.log(res, "列表");
          if (res.data.mark == "0") {
            that.StyleOptions = res.data.obj;
          } else {
            that.$message.error(res.data.tip);
          }
        })
        .catch(res => {});
    },
    formatSex(row, column, cellValue) {
      if (cellValue === "1") {
        return "显示";
      } else {
        return "不显示";
      }
    },
    deleteRow(index, rows) {
      console.log(rows[index].jewelry_id, "开始的id");
      let that = this;
      let timestamp = Date.parse(new Date());
      let url = "/api/oms/v1/jewelry/" + rows[index].jewelry_id;
      that.$axios
        .delete(url, {
          headers: {
            "Content-Type": "application/json;charset=utf-8",
            Timestamp: timestamp,
            SignInfo: that.$md5(timestamp + "jewelry")
          }
        })
        .then(res => {
          if (res.data.mark == "0") {
            rows.splice(index, 1);
            that.$message({
              message: "删除成功！",
              type: "warning"
            });
          }
        })
        .catch(res => {
          console.log(res);
        });
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    See(index, item) {
      let that = this;
      that.dialogFormVisible = true;
      that.title = '修改商品'
      that.isModify = true;
      that.isShow = false
      let timestamp = Date.parse(new Date());
      let url ='/api/oms/v1/jewelry/' + item[index].jewelry_id
      console.log(item[index].jewelry_id)
      that.$axios.get(url, {
          headers: {
            "Content-Type": "application/json;charset=utf-8",
            Timestamp: timestamp,
            SignInfo: that.$md5(timestamp + "jewelry")
          }
        })
        .then(res => {
          if (res.data.mark == "0") {
            console.log(res,'查询')
            that.StyleOptions = res.data.obj.styleList;
            that.form = res.data.obj.jewelry
            that.Stylevalue = res.data.obj.jewelry.style_id;
            that.Effectvalue = res.data.obj.jewelry.is_valid
            that.Specvlaue = item[index].jewelry_specification;
            that.form.Details = res.data.obj.jewelry.jewelry_details
            let myPhopo = '/api' + res.data.obj.jewelry.jewelry_pic_src
            that.SeeImg = res.data.obj.jewelry.jewelry_pic_src
            that.fileList2 = []
            that.fileList2.push({url:myPhopo})
            var MyPhopoList = res.data.obj.jewelry.bannerPics
            var MyPhopo = MyPhopoList.split(',')
            that.SeeImgList = res.data.obj.jewelry.bannerPics
            that.fileList3 = []
            for(let i in MyPhopo){
              that.fileList3.push({url:'/api' + MyPhopo[i]})
            }
          }
        }).catch(res => {
           console.log(res)
        });
    },
    // 修改
    Modify() {
      let that = this;
      console.log(that.bannerImg);
      let timestamp = Date.parse(new Date());
      if(that.cover != ''){
        var MySee = that.cover
      }else{
        var MySee = that.SeeImg
      }
      if(that.bannerImg != null){
        var MyBanner = that.bannerImg.join(",");
      }else{
        console.log(that.SeeImgList)
        var MyBanner = that.SeeImgList
      }

      let Mydata = {
        jewelry_id: that.form.jewelry_id, //商品id（必填）
        jewelry_name: that.form.jewelry_name, //商品名称（选填）
        style_id: that.Stylevalue, //商品类别id（选填）
        jewelry_specification: that.Specvlaue, //商品规格（选填）
        jewelry_deposit: that.form.jewelry_deposit, //定金（选填）
        process_cost: that.form.process_cost, //加工费（选填）
        jewelry_growth: that.form.jewelry_growth, //成长值（选填）
        jewelry_pic_src: MySee, //封面图片（选填）
        bannerPics: MyBanner, //banner图片，图片之间用##分隔（选填）
        jewelry_details: that.form.Details, //商品详情（选填）
        is_valid: that.Effectvalue //是否有效1：有效 0：无效(默认有效)（选填）
      };

      console.log(Mydata, "数据");
      let url = "/api/oms/v1/jewelry";
      that.$axios
        .put(url, Mydata, {
          headers: {
            "Content-Type": "application/json;charset=utf-8",
            Timestamp: timestamp,
            SignInfo: that.$md5(timestamp + "jewelry")
          }
        })
        .then(res => {
          if (res.data.mark == "0") {
            that.dialogFormVisible = false;
            that.isModify = false;
            that.clickAlert();
            that.$message({
              type: "success",
              message: "修改成功"
            });
          } else {
            that.$message({
              type: "warning",
              message: res.data.tip
            });
          }
        })
        .catch(res => {
          that.$message({
            type: "error",
            message: res.data.tip
          });
        });
    },
    // 上传封面
    uploadFile(file) {
      this.formDate.append("picfile", file.file);
      console.log(file.file);
    },
    subPicForm() {
      console.log(11);
      let that = this;
      that.formDate = new FormData();
      that.$refs.upload.submit();
      that.formDate.append("WS_CODE", "12133");
      let timestamp = Date.parse(new Date());
      let url = "/api/oms/v1/uploadPic";
      let config = {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          Timestamp: timestamp,
          SignInfo: that.$md5(timestamp + "jewelry")
        }
      };
      that.$axios
        .post(url, that.formDate, config)
        .then(res => {
          if (res.data.mark == "0") {
            that.cover = res.data.obj[0];
            that.$message({
              message: "封面图片上传成功！",
              type: "success"
            });
          }
        })
        .catch(res => {
          console.log(res);
        });
    },
    // 上传banner
    uploadFile1(file) {
      this.formDate.append("picfile", file.file);
    },
    subPicForm1() {
      let that = this;
      that.formDate = new FormData();
      that.$refs.upload1.submit();
      that.formDate.append("WS_CODE", "12133");
      let timestamp = Date.parse(new Date());
      let url = "/api/oms/v1/uploadPic";
      let config = {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          Timestamp: timestamp,
          SignInfo: that.$md5(timestamp + "jewelry")
        }
      };
      that.$axios
        .post(url, that.formDate, config)
        .then(res => {
          if (res.data.mark == "0") {
            console.log(res.data.obj, "这个是要上传的bannerImg");
            // that.bannerImg.push(res.data.obj)
            that.bannerImg = res.data.obj;
            that.$message({
              message: "banner图片上传成功！",
              type: "success"
            });
          }
        })
        .catch(res => {
          console.log(res);
        });
    },
    // @blur="fun()"
    MyDeposit(){
       let that = this
       if(that.form.jewelry_deposit == 0  || that.form.jewelry_deposit < 0){
          that.$message({
            message:'定金不能为0，请从新输入！',
            type:'warning'
          })
       }
    },
    YTotal(){
      let that = this
      let number = that.form.process_cost  - that.form.jewelry_deposit
      console.log(number)
      if(number == 0 || number < 0){
            that.form.process_cost = ''
            that.$message({
              message:'总额不能小于定金，请从新输入！',
              type:'warning'
            })
      }
    },

    // 添加
    AddGoods() {
      let that = this;
      that.isShow = true;
      if(that.bannerImg != null){
        var MyBanner = that.bannerImg.join(",");
      }else{
        that.$message({
          message:'上传错误',
          type:'warning'
        })
      }

      let url = "/api/oms/v1/jewelry";
      let timestamp = Date.parse(new Date());
      let MyForm = {
        jewelry_name: that.form.jewelry_name, //商品名称
        style_id: that.Stylevalue, //商品类别id
        jewelry_specification: that.Specvlaue, //商品规格
        jewelry_deposit: that.form.jewelry_deposit, //定金
        process_cost: that.form.process_cost, //加工费
        jewelry_growth: that.form.jewelry_growth, //成长值
        jewelry_pic_src: that.cover, //封面图片
        bannerPics: MyBanner, //banner图片，图片之间用##分隔
        jewelry_details: that.form.Details, //商品详情
        is_valid: that.Effectvalue //是否有效1：有效 0：无效(默认有效)
      };
      if (that.form.jewelry_name != "" || that.form.jewelry_deposit != "" || that.form.process_cost != "" || that.form.jewelry_growth != "" || MyBanner != null || that.form.Details != '') {
        that.$axios
          .post(url, MyForm, {
            headers: {
              "Content-Type": "application/json;charset=utf-8",
              Timestamp: timestamp,
              SignInfo: that.$md5(timestamp + "jewelry")
            }
          })
          .then(res => {
            // console.log(res);
            if (res.data.mark == "0") {
              console.log(res.data.obj);
              that.clickAlert();
              that.$refs.upload.clearFiles();
              that.$refs.upload1.clearFiles();
              that.form.jewelry_name = ""; //商品名称
              that.form.style_id = ""; //商品类别id
              that.Specvlaue = ""; //商品规格
              that.form.jewelry_deposit = ""; //定金
              that.form.process_cost = ""; //加工费
              that.form.jewelry_growth = ""; //成长值
              that.form.Details = ""; //商品详情
              that.Effectvalue = ""; //是否有效1：有效 0：无效(默认有效)
              that.dialogFormVisible = false;
              that.isShow = false;
            }else{
              that.$message({
                message:res.data.tip,
                type:'warning'
              })
            }
          })
          .catch(res => {
            console.log(res);
          });
      }else{
        that.$message({
          message:'请填写内容信息',
          type:'warning'
        })
      }
    },
    Edit() {
      let that = this;
      that.dialogVisible = false;
      that.formLabelAlign.date = that.value14;
      // that.tableData.push(that.formLabelAlign);
      // console.log(that.form.date,that.value14,'时间 ')
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
        "/api/oms/v1/jewelry/list?currentPage=" +
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
            image.push("/api" + res.data.obj.data[i].jewelry_pic_src);
            console.log(image);
            that.tableData[i].imgUrl = image;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    CommoditySearch() {
      let that = this;
      let timestamp = Date.parse(new Date());
      let url = "/api/oms/v1/jewelry/list?name=" + that.Namesearch;
      that.$axios
        .get(url, {
          headers: {
            "Content-Type": "multipart/form-data",
            Timestamp: timestamp,
            SignInfo: that.$md5(timestamp + "jewelry")
          }
        })
        .then(res => {
          if (res.data.mark == "0") {
            console.log(res.data.obj);
            that.tableData = res.data.obj.data;
            for (let i in res.data.obj.data) {
              let iTem = [];
              let image = [];
              image.push("/api" + res.data.obj.data[i].jewelry_pic_src);
              that.tableData[i].imgUrl = image;
              iTem = that
                .$moment(res.data.obj.data[i].create_date)
                .format("YYYY-MM-DD HH:mm:ss");
              that.tableData[i].create_date = iTem;
            }
            if (res.data.obj.data == "") {
              that.$message({
                message: "没有搜索到您要的资料！",
                type: "warning"
              });
            }
          } else {
            that.$message({
              message: res.data.tip,
              type: "warning"
            });
          }
        })
        .catch(res => {
          console.log(res);
        });
    },
    SelectSearch() {
      let that = this;
      console.log(that.valid, "这是id");
      let timestamp = Date.parse(new Date());
      let url = "/api/oms/v1/jewelry/list?valid=" + that.valid;
      that.$axios
        .get(url, {
          headers: {
            "Content-Type": "multipart/form-data",
            Timestamp: timestamp,
            SignInfo: that.$md5(timestamp + "jewelry")
          }
        })
        .then(res => {
          if (res.data.mark == "0") {
            console.log(res.data.obj);
            that.tableData = res.data.obj.data;
            for (let i in res.data.obj.data) {
              let iTem = [];
              let image = [];
              image.push("/api" + res.data.obj.data[i].jewelry_pic_src);
              that.tableData[i].imgUrl = image;
              iTem = that
                .$moment(res.data.obj.data[i].create_date)
                .format("YYYY-MM-DD HH:mm:ss");
              that.tableData[i].create_date = iTem;
            }
            if (res.data.obj.data == "") {
              that.$message({
                message: "没有搜索到您要的资料！",
                type: "warning"
              });
            }
          } else {
            that.$message({
              message: res.data.tip,
              type: "warning"
            });
          }
        })
        .catch(res => {
          console.log(res);
        });
    },
    CreateDate() {
      let that = this;
      let timestamp = Date.parse(new Date());
      let iTem = [];
      for (let i in that.ItemValue) {
        iTem.push(
          that.$moment(that.ItemValue[i]).format("YYYY/MM/DD HH:mm:ss")
        );
        console.log(iTem);
      }
      let url =
        "/api/oms/v1/jewelry/list?create_date_start=" +
        iTem[0] +
        "&create_date_end=" +
        iTem[1];
      that.$axios
        .get(url, {
          headers: {
            "Content-Type": "multipart/form-data",
            Timestamp: timestamp,
            SignInfo: that.$md5(timestamp + "jewelry")
          }
        })
        .then(res => {
          if (res.data.mark == "0") {
            console.log(res.data.obj);
            that.tableData = res.data.obj.data;
            for (let i in res.data.obj.data) {
              let iTem1 = [];
              let image = [];
              image.push("/api" + res.data.obj.data[i].jewelry_pic_src);
              that.tableData[i].imgUrl = image;
              iTem1 = that
                .$moment(res.data.obj.data[i].create_date)
                .format("YYYY-MM-DD HH:mm:ss");
              that.tableData[i].create_date = iTem1;
            }
            if (res.data.obj.data == "") {
              that.$message({
                message: "没有搜索到您要的资料！",
                type: "warning"
              });
            }
          } else {
            that.$message({
              message: res.data.tip,
              type: "warning"
            });
          }
        })
        .catch(res => {
          console.log(res);
        });
    }
  }
};
</script>

<style lang="css" scoped>
.context {
  width: 100%;
  height: 100%;
  background: white;
}
.Title {
  padding: 15px;
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}
.addBtn {
  margin-top: 15px;
}
.el-icon-arrow-right {
  padding: 15px;
}
.CommodityImg {
  height: 3rem;
  margin: 0 5px 0 5px;
}
.Total{
  font-size: 12px;
  position: absolute;
  top:28px;
  color: red;
}
</style>