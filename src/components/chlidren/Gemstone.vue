  <template>
        <div class="Gemstone">
            <!-- 标题 -->
            <div class="Title">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item>分类</el-breadcrumb-item>
                    <el-breadcrumb-item>商品</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <el-row>
                <el-col :span='1' :push="1">
                    <el-button type="primary" @click="OpenModle()">
                        <i class="el-icon-plus"></i>添加
                    </el-button>
                </el-col>
            </el-row>
            <!-- 表格 -->
            <el-row style="margin-top: 15px;">
                <el-col  :span="22" :push="1">
                    <el-table
                    :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
                    border
                    style="width: 100%">
                        <el-table-column
                        prop="id"
                        label="ID"
                        width="50">
                        </el-table-column>
                        <el-table-column
                        prop="create_date"
                        label="日期"
                        width="180">
                        </el-table-column>
                        <el-table-column
                        prop="gem_name"
                        label="宝石名称"
                        width="180">
                        </el-table-column>
                        <el-table-column prop="imgUrl" label="图片" min-width="10%">
                            <!-- 图片的显示 -->
                            <template slot-scope="scope">
                                 <img v-for="item in scope.row.ImgUrl" :src="item" min-width="40"  height="40"  class="CommodityImg">
                            </template>
                        </el-table-column>
                        <el-table-column
                        prop="is_valid"
                        label="状态"
                        width="60"
                        :formatter="formatSex">
                        </el-table-column>
                        <el-table-column
                        width="800"
                        prop="gem_subhead"
                        label="介绍">
                        </el-table-column>
                        <el-table-column label="操作" width="100">
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
            <el-dialog
            :title="title"
            :visible.sync="dialogVisible"
            @close='closeDialog'
            width="40%"
            >
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="宝石名称：" :label-width="formLabelWidth">
                    <el-input v-model="form.gem_name"></el-input>
                </el-form-item>
                <el-form-item label="状态：" :label-width="formLabelWidth">
                      <el-select v-model="value" placeholder="请选择">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="图片上传：" :label-width="formLabelWidth">
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

                <el-form-item label="介绍：" :label-width="formLabelWidth">
                    <el-input type="textarea" v-model="form.gem_subhead"></el-input>
                </el-form-item>
                </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="SubGemstone()" v-show="AddModle">确 定</el-button>
                <el-button type="primary" @click="SeeGemstone()" v-show="SeeModle">修 改</el-button>
            </span>
            </el-dialog>
        </div>
  </template>
   <script>
    export default {
      data() {
        return {
          tableData:[],
        //翻译    
          total: 0, //默认数据总数
          pagesize: 10, //每页的数据条数
          currentPage: 1, //默认开始页面
          formLabelWidth:'100px',
        // 模态框
           dialogVisible:false,
           title:'',
           multiple: false,
           panelShow: true,
           AddModle:false,
           SeeModle:false,
           options: [{
                value: '1',
                label: '显示'
                }, {
                value: '2',
                label: '隐藏'
                }],
            value: '',
            //添加信息
            form: {
                id:'',
                gem_name:'',
                is_valid:'',
                gem_subhead:''
            },
            UpImage:'',
            fileList2:[],
            SeeImg:''
        }
      },
     created() {
         let that = this;
         that.loadGemstone()
      },
     methods: {
         loadGemstone(){
             let that = this;
             var timestamp = Date.parse(new Date());
             let url = '/api/oms/v1/gem/list'
             that.$axios.get(url,{
                    headers: {
                    "Content-Type": "application/json;charset=utf-8",
                    Timestamp: timestamp,
                    SignInfo: that.$md5(timestamp + "jewelry")
                }
             }).then(res=>{
                 console.log(res)
                if(res.data.mark == '0'){
                    that.total = res.data.obj.totalPage * that.pagesize
                    that.tableData = res.data.obj.data
                    for(let i in res.data.obj.data){
                        let iTem = []
                        let ImgUrl = []
                        iTem = that.$moment(res.data.obj.data[i].create_date).format("YYYY-MM-DD HH:mm:ss");
                        that.tableData[i].create_date = iTem
                        ImgUrl.push('/api' + res.data.obj.data[i].gem_icon_url)
                        that.tableData[i].ImgUrl = ImgUrl
                    }
                }
             }).catch(res=>{
                 console.log(res)
             })
          },
         formatSex(row, column, cellValue) {
            if (cellValue === "1") {
                return "显示";
            } else {
                return "隐藏";
            }
         },
         closeDialog(){
            let that = this
            that.form.gem_name = ""
            that.form.gem_subhead = ""
            that.value = ""
            that.$refs.upload.clearFiles();
         },
         // 删除
         deleteRow(index,rows){
             let that = this
             let timestamp = Date.parse(new Date())
             let url = '/api/oms/v1/gem/' + rows[index].id
             console.log(rows[index].id)
             that.$axios.delete(url,{
                headers: {
                    "Content-Type": "application/json;charset=utf-8",
                    Timestamp: timestamp,
                    SignInfo: that.$md5(timestamp + "jewelry")
                }
             }).then(res=>{
                 console.log(res)
                 if(res.data.mark == '0'){
                     that.$message({
                         message:'删除成功',
                         type:'success'
                     })
                     rows.splice(index,1)
                 }else if(res.data.mark == '100'){
                        that.$message({
                             message:'请重新登录',
                             type: "warning"
                        })
                        setInterval(() => {
                            that.$router.push({ path: "/" });
                        }, 2000);
                 }else{
                     that.$message.error(res.data.tip);
                 }
             }).catch(res=>{
                 console.log(res)
             })
         },
        //  翻页
         switchChange() {
            this.istag = !this.istag;
         },
         created: function() {
            this.total = this.tableData.length;
         },
         current_change: function(currentPage) {
            let that = this;
            console.log(currentPage, "页数");
            let url = "/api/oms/v1/gem/list?currentPage=" + currentPage + "&pageSize=" + that.pagesize;
            let timestamp = Date.parse(new Date());
            that.$axios.get(url, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Timestamp: timestamp,
                    SignInfo: that.$md5(timestamp + "jewelry")
                }
            }).then(res => {
                that.tableData = [];
                for (let i = 0; i < res.data.obj.data.length; i++) {
                    let obj = res.data.obj.data;
                    that.tableData.push(obj[i]);
                }
            for(let i in res.data.obj.data){
                        let iTem = []
                        let ImgUrl = []
                        iTem = that.$moment(res.data.obj.data[i].create_date).format("YYYY-MM-DD HH:mm:ss");
                        that.tableData[i].create_date = iTem
                        ImgUrl.push('/api' + res.data.obj.data[i].gem_icon_url)
                        that.tableData[i].ImgUrl = ImgUrl
                    }
            }).catch(error => {
                console.log(error);
            });
        },
        // 打开模态框
        OpenModle(){
            let that = this
            that.dialogVisible = true
            that.AddModle = true
            that.SeeModle = false
            that.title = '添加宝石'
        },
        // 图片上传
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
            that.$axios.post(url, that.formDate, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Timestamp: timestamp,
                    SignInfo: that.$md5(timestamp + "jewelry")
                }
            }).then(res => {
                if (res.data.mark == "0") {
                    that.UpImage = res.data.obj;
                    that.$message({
                        message: "图片上传成功",
                        type: "success"
                    });
                    console.log(res.data.obj);
                }
            }).catch(error => {
                console.log(error);
            });
        },
        SubGemstone(){
            let that = this 
            let timestamp = Date.parse(new Date())
            if(that.UpImage != ''){
                 var GemstoneImg = that.UpImage.join()
            }
            let Myform = {
                "gem_name":that.form.gem_name,
                "gem_icon_url":GemstoneImg,
                "gem_subhead":that.form.gem_subhead,
                "is_valid":that.value
            }
            console.log(Myform)
            let url = '/api/oms/v1/gem'
            if(that.form.gem_name != '' || that.UpImage != '' || that.form.gem_subhead != '' || that.value != ''){
                that.$axios.post(url,Myform,{
                    headers: {
                    "Content-Type": "application/json;charset=utf-8",
                    Timestamp: timestamp,
                    SignInfo: that.$md5(timestamp + "jewelry")
                }
                }).then(res=>{
                    console.log(res)
                    that.form.gem_name = ""
                    that.form.gem_subhead = ""
                    that.value = ""
                    that.dialogVisible = false
                    that.AddModle = false
                    if(res.data.mark == '0'){
                        that.loadGemstone()
                        console.log(res)
                        that.$message({
                            message:'添加成功',
                            type:'success'
                        })

                    }else if(res.data.mark == '100'){
                        that.$message({
                            message:'请重新登录',
                            type: "warning"
                        })
                        setInterval(() => {
                            that.$router.push({ path: "/" });
                        }, 2000);
                    }else{
                        that.$message.error(res.data.tip);
                    }
                }).catch(res=>{
                    console.log(res)
                })
            }else{
                that.$message({
                    message:'请填写添加内容',
                    type:'warning'
                })
            }
        },
        See(index,rows){
            let that = this
            console.log(rows[index])
            that.fileList2 = []
            that.title = '修改信息'
            that.dialogVisible = true
            that.AddModle = false
            that.SeeModle = true
            that.form = rows[index]
            that.value = rows[index].is_valid
            that.form.id = rows[index].id
            let timestamp = Date.parse(new Date())
            let url = '/api/oms/v1/gem/' + rows[index].id
            that.$axios.get(url,{
                headers: {
                    "Content-Type": "application/json;charset=utf-8",
                    Timestamp: timestamp,
                    SignInfo: that.$md5(timestamp + "jewelry")
                }
            }).then(res=>{
                that.form = res.data.obj
                that.value = res.data.obj.is_valid
                that.form.id = res.data.obj.id
                let MyPhopo = {} 
                MyPhopo = '/api' + res.data.obj.gem_icon_url
                that.SeeImg = res.data.obj.gem_icon_url
                that.fileList2.push({url:MyPhopo})
            }).catch(res=>{
                console.log(res)
            })
        },
        SeeGemstone(){
            let that = this
            let timestamp = Date.parse(new Date())
            let url = '/api/oms/v1/gem'
            if(that.UpImage != ''){
                 var GemstoneImg = that.UpImage.join()
            }else{
                var GemstoneImg = that.SeeImg
            }
            let SeeForm = {
                'id':that.form.id,
                "gem_name":that.form.gem_name,
                "gem_icon_url":GemstoneImg,
                "gem_subhead":that.form.gem_subhead,
                "is_valid":that.value
            }
            console.log(SeeForm )
            if(that.form.gem_name != '' || that.UpImage != '' || that.form.gem_subhead != '' || that.value != ''){
                that.$axios.put(url,SeeForm,{
                    headers: {
                        "Content-Type": "application/json;charset=utf-8",
                        Timestamp: timestamp,
                        SignInfo: that.$md5(timestamp + "jewelry")
                    }
                }).then(res=>{
                    console.log(res)
                    if(res.data.mark == '0'){
                        that.loadGemstone()
                        that.dialogVisible = false
                        that.SeeModle = false
                        that.$message({
                            message:'修改成功',
                            type:'success'
                        })
                    }
                }).catch(res=>{
                    console.log(res)
                })
            }else{
                that.$message({
                    message:'填写修改内容!',
                    type:'warning'
                })
            }
        }
      }
    }
  </script>

  <style lang="css" scoped>
    .Gemstone{
        width: 100%;
        height: 100%;
        background: white;
    }
   .Title {
        padding: 15px;
    }
    .addBtn {
        margin-top: 15px;
    }
    .Subhead{
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
    }
  </style>
  