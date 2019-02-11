<template>
    <div class="Payment">
        <!-- 标题 -->
        <div class="Title">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>分类</el-breadcrumb-item>
                <el-breadcrumb-item>订单列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        
        <el-row :span="22">
            <el-col :span="1" :push="1">
                <div>
                    <el-button  @click="loadPayment()">
                        <i class="el-icon-refresh"></i>重置
                    </el-button>
                </div>
            </el-col>
            <el-col :span="3" :push="2">
                <div>
                <el-input placeholder="订单ID" v-model="OrderID" class="input-with-select">
                    <el-button slot="append" icon="el-icon-search" @click="OrderSearch()"></el-button>
                </el-input>
                </div>
            </el-col>
            <el-col :span="2" :push="3">
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
            <el-col :span="6" :push="4">
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
        <!-- 列表 -->
        <el-row style="margin-top:15px">
            <el-col :span="22" :push="1">
                    <el-table
                    :data="tableData"
                    border
                    style="width: 100%">
                    <el-table-column
                        prop="id"
                        label="ID"
                        width="50">
                    </el-table-column>
                    <el-table-column
                        prop="order_id"
                        label="订单ID"
                        width="50">
                    </el-table-column>
                    <el-table-column
                        prop="create_date"
                        label="创建时间"
                        width="160">
                    </el-table-column>
                    <el-table-column
                        prop="item"
                        label="支付项目"
                        :formatter="formatSex"
                        width="80">
                    </el-table-column>
                    <el-table-column
                        prop="out_trade_no"
                        label="支付订单号"
                        width="230">
                    </el-table-column>
                    <el-table-column
                        prop="total_fee"
                        label="支付金额"
                        width="50">
                    </el-table-column>
                    <el-table-column
                        prop="paid"
                        label="是否支付"
                        :formatter="formpaid"
                        width="78">
                    </el-table-column>
                    <el-table-column
                        prop="paid_date"
                        label="支付时间"
                        width="160">
                    </el-table-column>
                    <el-table-column
                        prop="out_refund_no"
                        label="退款单号"
                        width="236">
                    </el-table-column>
                    <el-table-column
                        prop="refund_fee"
                        label="退款金额"
                        width="80">
                    </el-table-column>
                    <el-table-column
                        prop="refunded"
                        label="是否已退款"
                        :formatter="formrefunded"
                        width="100">
                    </el-table-column>
                    <el-table-column
                        prop="refund_date"
                        label="退款时间"
                        width="240">
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
    data(){
        return{
            tableData:[],
            total: 20, //默认数据总数
            pagesize: 10, //每页的数据条数
            currentPage: 1, //默认开始页面
            OrderID:'',
            EffectOptions: [
                {
                value: "deposit",
                label: "定金"
                },{
                value: "balance",
                label: "尾款"
            }],
            valid:[],
            ItemValue:[]
        }
    },
    created(){
        let that = this
        that.loadPayment()
    },
    methods:{
        loadPayment(){
            let that = this
            let timestamp = Date.parse(new Date())
            let url = '/api/oms/v1/payment/list'
            that.$axios.get(url,{
                headers: {
                    "Content-Type": "application/json;charset=utf-8",
                    "Timestamp": timestamp,
                    "SignInfo": that.$md5(timestamp + "jewelry")
                }
            }).then(res=>{
                // console.log(res)
                if(res.data.mark == '0'){
                    that.tableData = res.data.obj.data
                    that.total = res.data.obj.totalPage * that.pagesize
                    for (let i in res.data.obj.data) {
                        let iTem = [];
                        let Paiddate = []
                        let Refunddate = []
                        iTem = that.$moment(res.data.obj.data[i].create_date).format("YYYY-MM-DD HH:mm:ss");
                        Paiddate = that.$moment(res.data.obj.data[i].paid_date).format("YYYY-MM-DD HH:mm:ss");
                        Refunddate = that.$moment(res.data.obj.data[i].refund_date).format("YYYY-MM-DD HH:mm:ss");
                        that.tableData[i].create_date = iTem;
                        that.tableData[i].paid_date = Paiddate;
                        that.tableData[i].refund_date = Refunddate;
                    }
                    console.log(res.data.obj)
                }else if(res.data.mark == '100'){
                    that.$message({
                        message:'登录超时，请重新登录！',
                        type:'warning'
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
        formatSex(row, column, cellValue) {
            if (cellValue === "deposit") {
                return "定金";
            } else {
                return "尾款";
            }
         },
        formpaid(row, column, cellValue) {
            if (cellValue === true) {
                return "是";
            } else {
                return "否";
            }
        },
        formrefunded(row, column, cellValue){
            if (cellValue === true) {
                return "是";
            } else {
                return "否";
            }
        },
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
        let url = "/api/oms/v1/payment/list?currentPage=" + currentPage + "&pageSize=" + that.pagesize;
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
        OrderSearch(){
        let that = this;
        let timestamp = Date.parse(new Date());
        let url = "/api/oms/v1/payment/list?order_id=" + that.OrderID;
        that.$axios.get(url, {
            headers: {
                "Content-Type": "multipart/form-data",
                Timestamp: timestamp,
                SignInfo: that.$md5(timestamp + "jewelry")
            }
            }).then(res => {
                if(res.data.mark == '0'){
                    that.tableData = res.data.obj.data
                    that.total = res.data.obj.totalPage * that.pagesize
                    for (let i in res.data.obj.data) {
                        let iTem = [];
                        let Paiddate = []
                        let Refunddate = []
                        iTem = that.$moment(res.data.obj.data[i].create_date).format("YYYY-MM-DD HH:mm:ss");
                        Paiddate = that.$moment(res.data.obj.data[i].paid_date).format("YYYY-MM-DD HH:mm:ss");
                        Refunddate = that.$moment(res.data.obj.data[i].refund_date).format("YYYY-MM-DD HH:mm:ss");
                        that.tableData[i].create_date = iTem;
                        that.tableData[i].paid_date = Paiddate;
                        that.tableData[i].refund_date = Refunddate;
                    }
                    console.log(res.data.obj)
                }else if(res.data.mark == '100'){
                    that.$message({
                        message:'登录超时，请重新登录！',
                        type:'warning'
                    })
                    setInterval(() => {
                        that.$router.push({ path: "/" });
                    }, 1000);
                }else{
                    that.$message.error(res.data.tip);
                }
            })
            .catch(res => {
            console.log(res);
            });
        },
        SelectSearch(){
            let that = this;
            let timestamp = Date.parse(new Date());
            let url = "/api/oms/v1/payment/list?item=" + that.valid;
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
            let url ="/api/oms/v1/payment/list?paidDateStart=" + iTem[0] + "&paidDateEnd=" + iTem[1];
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
                }).catch(res => {
                console.log(res);
            });
         },
    }
}
</script>
<style lang="css" scoped>
    .Payment{
        width: 100%;
        height: 100%;
        background: white;
    }
    .Title {
        padding: 15px;
    }
</style>

