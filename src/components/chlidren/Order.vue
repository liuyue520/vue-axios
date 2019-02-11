<template>
  <div class="Order">
    <!-- 标题 -->
    <div class="Title">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>分类</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-row style="margin-top:30px">
      <el-col :span="1" :push="1">
        <el-button  @click="loadOrder()">
          <i class="el-icon-refresh"></i>重置
        </el-button>
      </el-col>
      <el-col :span="4" :push="2">
        <div>
          <el-input placeholder="商品名称" v-model="Namesearch" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="CommoditySearch()"></el-button>
          </el-input>
        </div>
      </el-col>
      <el-col :span="5" :push="3">
        <div>
          <el-input placeholder="订单号" v-model="order_no" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="OrderSearch()"></el-button>
          </el-input>
        </div>
      </el-col>
      <el-col :span="2" :push="4">
        <div >
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
        <div>
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
    </el-row>
    <el-row style="margin-top:15px;">
      <el-col :span="22" :push="1">
        <el-table :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)" border style="width: 100%">
          <el-table-column prop="order_id" label="订单ID" width="70"></el-table-column>
          <el-table-column prop="create_date" label="创建日期" width="180"></el-table-column>
          <el-table-column prop="cust_name" label="客户姓名" width="110"></el-table-column>
          <el-table-column prop="deposit" label="定金" width="60"></el-table-column>
          <el-table-column prop="payment" label="总金额" width="80"></el-table-column>
          <el-table-column prop="order_no" label="订单号" width="185"></el-table-column>
          <el-table-column prop="order_remarks" label="订单备注" width="400"></el-table-column>
          <el-table-column prop="order_status" :formatter="formatSex" label="订单转态" width="100"></el-table-column>
          <el-table-column fixed="right" label="操作" width="200">
            <template slot-scope="scope">
              <el-button @click="see(scope.$index,tableData)" type="text" size="small">查看</el-button>
              <el-button type="text" size="small" v-show="scope.row.order_status == '4'" @click="Deliver(scope.$index,tableData)">发货</el-button>
              <el-button type="text" size="small" v-show="scope.row.order_status == '7'" @click="Refund(scope.$index,tableData)">确认退款</el-button>
              <!-- <el-button type="text" size="small" v-show="scope.row.order_status == '7'" @click="Ofrefund(scope.$index,tableData)" >拒绝退款</el-button> -->
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

    <el-dialog title="查看详情" :visible.sync="dialogVisible" width="50%">
      <el-form label-width="130px" :disabled="true">
        <el-form-item label="订单ID">
          <el-col>
            <el-input v-model="OrderDetails.order_id"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="订单号">
          <el-input v-model="OrderDetails.order_no"></el-input>
        </el-form-item>
        <el-form-item label="总定金">
          <el-input v-model="OrderDetails.deposit"></el-input>
        </el-form-item>
        <el-form-item label="总金额">
          <el-input v-model="OrderDetails.payment"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-input v-model="OrderDetails.order_status"></el-input>
        </el-form-item>
        <el-form-item label="收件人">
          <el-input v-model="OrderDetails.receiver_name"></el-input>
        </el-form-item>
        <el-form-item label="收件电话">
          <el-input v-model="OrderDetails.receiver_phone"></el-input>
        </el-form-item>
        <el-form-item label="收件地址">
          <el-input v-model="OrderDetails.receiver_address"></el-input>
        </el-form-item>
        <el-form-item label="客户邮寄快递公司">
          <el-input v-model="OrderDetails.cust_post_company"></el-input>
        </el-form-item>
        <el-form-item label="客户邮寄快递单号">
          <el-input v-model="OrderDetails.cust_post_number"></el-input>
        </el-form-item>
        <el-form-item label="发货快递公司">
          <el-input v-model="OrderDetails.post_company"></el-input>
        </el-form-item>
        <el-form-item label="发货快递单号">
          <el-input v-model="OrderDetails.post_number"></el-input>
        </el-form-item>
        <el-form-item label="订单创建时间">
          <el-input v-model="OrderDetails.create_date"></el-input>
        </el-form-item>
        <el-form-item label="退款金额">
          <el-input v-model="OrderDetails.refund"></el-input>
        </el-form-item>
        <el-form-item label="退款日期">
          <el-input v-model="OrderDetails.refund_date"></el-input>
        </el-form-item>
        <el-form-item label="支付定金日期">
          <el-input v-model="OrderDetails.deposit_date"></el-input>
        </el-form-item>
        <el-form-item label="支付尾款日期">
          <el-input v-model="OrderDetails.balance_payment_date"></el-input>
        </el-form-item>
        <el-form-item label="定金支付单号">
          <el-input v-model="OrderDetails.deposit_no"></el-input>
        </el-form-item>
        <el-form-item label="尾款支付单号">
          <el-input v-model="OrderDetails.balance_payment_no"></el-input>
        </el-form-item>
        <div class="OrderTextarea">
          <el-form-item label="备注">
            <el-input type="textarea" v-model="OrderDetails.order_remarks"></el-input>
          </el-form-item>
        </div>
        <div class="moreRulesIn" v-for="(item,index) in OrderDetails.detailList" :key="item.key">
          <el-form-item label="商品列表：" :prop="'OrderDetails.' + index +'.detailList'">商品id
            <el-input v-model="item.jewelry_id"></el-input>商品名称
            <el-input v-model="item.jewelry_name"></el-input>商品数量
            <el-input v-model="item.jewelry_count"></el-input>商品金额
            <el-input v-model="item.price"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

     <el-dialog title="发货" :visible.sync="ModelState" width="30%">
       <el-form label-width="80px">
          <el-form-item label="快递公司">
              <el-select v-model="value" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
          </el-form-item>
        <el-form-item label="快递单号">
          <el-input v-model="OrderNumber" autocomplete="off"></el-input>
        </el-form-item>
        </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="ConfirmSate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      OrderDetails: [],
      ModelState:false,
      DeliverValue:'',
      options: [{
          value: '韵达',
          label: '韵达'
        }, {
          value: '申通',
          label: '申通'
        }, {
          value: 'EMS',
          label: 'EMS'
        }, {
          value: '顺丰',
          label: '顺丰'
        }, {
          value: '中通',
          label: '中通'
        },{
          value:'圆通',
          label:'圆通'
        }],
        value: '',
        OrderNumber:'',
        // 翻页
        total: 20, //默认数据总数
        pagesize: 10, //每页的数据条数
        currentPage: 1, //默认开始页面
        Namesearch:'',
        order_no:'',
        Effectvalue: [],
        EffectOptions: [
        {
          value: "1",
          label: "待付定金"
        },{
          value: "2",
          label: "待上传"
        },{
          value: "3",
          label: "待付款"
        },{
          value: "4",
          label: "待发货"
        },{
          value: "5",
          label: "待收货"
        },{
          value: "6",
          label: "待评价"
        },{
          value: "7",
          label: "退款中"
        },{
          value: "8",
          label: "退款完成"
        },{
          value: "9",
          label: "已完成"
        }
      ],
      ItemValue: "",
      valid:[]
    };
  },
  created: function() {
    let that = this;
    that.loadOrder();
  },
  methods: {
    loadOrder() {
      let that = this;
      let timestamp = Date.parse(new Date());
      let url = "/api/oms/v1/order/list";
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
            that.total = res.data.obj.totalPage * that.pagesize
            for (let i in res.data.obj.data) {
              let iTem = [];
              iTem = that
                .$moment(res.data.obj.data[i].create_date)
                .format("YYYY-MM-DD HH:mm:ss");
              that.tableData[i].create_date = iTem;
            }
          }else if(res.data.mark == "100"){
            that.$message({
              message:'登录超时，请从新登录！',
              type: "warning"
            });
            setInterval(() => { 
              that.$router.push({ path: '/' });
            }, 1000)
          }else{
            that.$message.error(res.data.tip);
          }
        })
        .catch(res => {
          console.log(res);
        });
    },
    formatSex(row, column, cellValue) {
      switch (cellValue) {
        case "1":
          return "待付定金";
          break;
        case "2":
          return "待上传";
          break;
        case "3":
          return "待付款";
          break;
        case "4":
          return "待发货";
          break;
        case "5":
          return "待收货";
          break;
        case "6":
          return "待评价";
          break;
        case "7":
          return "退款中";
          break;
        case "8":
          return "退款完成";
          break;
        case "9":
          return "已完成";
          break;
      }
    },
    see(index, item) {
      // console.log(item[index].order_id);
      let that = this;
      that.dialogVisible = true;
      let url = "/api/oms/v1/order/" + item[index].order_id;
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
          // console.log(res, "数据");
          if (res.data.mark == "0") {
            that.OrderDetails = res.data.obj;
            
          }
        })
        .catch(res => {});
    },
    // 发货
    Deliver(index,item){
      let that = this
      that.ModelState = true
      that.DeliverValue = item[index].order_id
    },
    ConfirmSate(){
      let that = this
      let timestamp = Date.parse(new Date());
      let url = '/api/oms/v1/order/deliver'
      if(that.value != '' || that.OrderNumber != ''){
        that.$axios.put(url,{
            "order_id": that.DeliverValue,  //订单id
            "post_company":that.value, //快递公司
            "post_number":that.OrderNumber //快递单号
        },{
            headers: {
              "Content-Type": "application/json;charset=utf-8",
              Timestamp: timestamp,
              SignInfo: that.$md5(timestamp + "jewelry")
            }
        }).then(res=>{
          if(res.data.mark == '0'){
            that.ModelState = false
            that.loadOrder()
            that.$message({
                message: "发货成功！",
                type: "success"
            })
          }else{
            that.$message({
                message: res.data.tip,
                type: "warning"
            })
          }
        }).catch(res=>{
          that.$message.error(res.data.tip);
        })
      }else{
          that.$message({
                message:'请出去发货公司和单号再提交',
                type: "warning"
          })
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
      // console.log(currentPage, "页数");
      let url =
        "/api/oms/v1/order/list?currentPage=" +
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
          // console.log(res.data.obj,'翻页数据')
          for (let i = 0; i < res.data.obj.data.length; i++) {
            let obj = res.data.obj.data;
            that.tableData.push(obj[i]);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 搜索
    CommoditySearch(){
      let that = this;
      let timestamp = Date.parse(new Date());
      let url = "/api/oms/v1/order/list?cust_name=" + that.Namesearch;
      that.$axios.get(url, {
          headers: {
            "Content-Type": "multipart/form-data",
            Timestamp: timestamp,
            SignInfo: that.$md5(timestamp + "jewelry")
          }
        }).then(res => {
          if (res.data.mark == "0") {
            // console.log(res.data.obj);
            that.tableData = res.data.obj.data;
            for (let i in res.data.obj.data) {
              let iTem = [];
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
    OrderSearch(){
      let that = this;
      let timestamp = Date.parse(new Date());
      let url = "/api/oms/v1/order/list?order_no=" + that.order_no;
      that.$axios.get(url, {
          headers: {
            "Content-Type": "multipart/form-data",
            Timestamp: timestamp,
            SignInfo: that.$md5(timestamp + "jewelry")
          }
        }).then(res => {
          if (res.data.mark == "0") {
            // console.log(res.data.obj);
            that.tableData = res.data.obj.data;
            for (let i in res.data.obj.data) {
              let iTem = [];
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
    SelectSearch(){
      let that = this;
      // console.log(that.valid, "这是id");
      let timestamp = Date.parse(new Date());
      let url = "/api/oms/v1/order/list?order_status=" + that.valid;
      that.$axios.get(url, {
          headers: {
            "Content-Type": "multipart/form-data",
            Timestamp: timestamp,
            SignInfo: that.$md5(timestamp + "jewelry")
          }
        }).then(res => {
          if (res.data.mark == "0") {
            // console.log(res.data.obj);
            that.tableData = res.data.obj.data;
            for (let i in res.data.obj.data) {
              let iTem = [];
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
        }).catch(res => {
          console.log(res);
        });
    },
    CreateDate(){ 
      let that = this;
      let timestamp = Date.parse(new Date());
      let iTem = [];
      for (let i in that.ItemValue) {
        iTem.push(
          that.$moment(that.ItemValue[i]).format("YYYY/MM/DD HH:mm:ss")
        );
        // console.log(iTem);
      }
      let url ="/api/oms/v1/order/list?create_start=" + iTem[0] + "&create_end=" + iTem[1];
      that.$axios.get(url, {
          headers: {
            "Content-Type": "multipart/form-data",
            Timestamp: timestamp,
            SignInfo: that.$md5(timestamp + "jewelry")
          }
        })
        .then(res => {
          if (res.data.mark == "0") {
            // console.log(res.data.obj);
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
    },
    // 退款
    Refund(index,item){
      let that = this
      // console.log(item[index],'订单号')
      let timestamp = Date.parse(new Date());
      let url = '/api/oms/v1/order/refund/deposit/' + item[index].order_id
        that.$axios.put(url,{},{
          headers: {
            "Content-Type": "application/json;charset=utf-8",
            "Timestamp": timestamp,
            "SignInfo": that.$md5(timestamp + "jewelry")
          }
        }).then(res => {
          if(res.data.mark == '0'){
            that.loadOrder()
            that.$message({
              message:'确认退款！',
              type:'success'
            })
          }else if(res.data.mark == '100'){
            that.$message({
              message:"登录超时,请从新登录！",
              type:'type: "warning"'
            })
            setInterval(() => {
                that.$router.push({ path: "/" });
            }, 1000);
          }else{
            that.$message.error(res.data.tip);
          }
        }).catch(res => {
          console.log(res);
        });
    }
  }
};
</script>

<style lang="css" scoped>
.Order {
  width: 100%;
  height: 100%;
  background: white;
  float: right;
}
.Title {
  margin: 15px;
}
</style>
