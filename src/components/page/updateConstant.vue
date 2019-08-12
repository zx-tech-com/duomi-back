<template>
    <div v-loading="$root.showLoadingIcon">
        <el-row :gutter="19" >
             <el-col :span="8">
				<el-card shadow="hover">
					 <div class="crumbs">
						 <el-button type="primary" icon="delete" class="handle-del mr10" @click="updateEndTime">修改团拼截止时间</el-button>						
					 </div>
				
					<el-time-select v-model="endTime" :picker-options="{
							start: '08:30',
							step: '00:30',
							end: '23:00'
						  }"
						 placeholder="选择时间">
					</el-time-select>
					&nbsp;<span style="color: red;" >每天{{endTime}}结束当天拼团</span>
				 </el-card>				 
            </el-col>
			
			<el-col :span="8">
				<el-card shadow="hover">
					 <div class="crumbs">
						 <el-button type="primary" icon="delete" class="handle-del mr10" @click="updateEstimatedTimeOFDelivery">修改套餐送达时间</el-button>						
					 </div>				
					<el-time-select v-model="estimatedTimeOFDelivery" :picker-options="{
							start: '04:00',
							step: '00:30',
							end: '09:00'
						  }"
						 placeholder="选择时间">
					</el-time-select>
					&nbsp;<span style="color: red;" >每天{{estimatedTimeOFDelivery}}送达指定地点</span>
				 </el-card>				 
			</el-col>
			
			
			 <el-col :span="8">
				<el-card shadow="hover">
					 <div class="crumbs">
						 <el-button type="primary" icon="delete" class="handle-del mr10" :visible.sync="updateVisible" :rules="rules" @click="updateRate">修改哆咪豆金额换算率</el-button>
					 </div>
					<el-input placeholder="请输入换算哆咪豆数量" v-model="rate" oninput="value=value.replace(/[^\d]/g,'')" style="width: 220px;"></el-input>
					&nbsp;<span style="color: red;" >{{rate}}个哆咪豆抵扣1块钱</span>
				</el-card>
			</el-col>
        </el-row>
		
		<el-row :gutter="19" >
			<el-col :span="8">
				<el-card shadow="hover">
					 <div class="crumbs">
						 <el-button type="primary" icon="delete" class="handle-del mr10" @click="updateRebateRate">修改消耗返哆咪豆数</el-button>
					 </div>
					<el-input placeholder="请输入返还哆咪豆数量" v-model="rebateRate" oninput="value=value.replace(/[^\d]/g,'')" style="width: 220px;"></el-input>
					&nbsp;<span style="color: red;" >消费1块钱返还{{rebateRate}}哆咪豆</span>
				</el-card>
			</el-col>
			
			<el-col :span="8">
				<el-card shadow="hover"> 
					 <div class="crumbs">
						 <el-button type="primary" icon="delete" class="handle-del mr10" @click="updateNewCustomerFlagPrice">修改新用户支付金额</el-button>
					 </div>
					<el-input placeholder="请输入新用户支付金额" v-model="newCustomerFlagPrice" oninput="value=value.replace(/[^0-9.]/g,'')" style="width: 220px;"></el-input>
					&nbsp;<span style="color: red;" >新用户只需支付{{newCustomerFlagPrice}}（元）</span>
				</el-card>
			</el-col>
			
			
			<el-col :span="8">
				<el-card shadow="hover">
					 <div class="crumbs">
						 <el-button type="primary" icon="delete" class="handle-del mr10" @click="updateMaxAcceptableDistance">修改搜索查询范围内订单</el-button>
					 </div>
					<el-input placeholder="请输入范围距离(m)" v-model="maxAcceptableDistance" oninput="value=value.replace(/[^\d]/g,'')" style="width: 220px;"></el-input>
					&nbsp;<span style="color: red;" >默认查找{{maxAcceptableDistance}}米范围内的订单</span>
					</el-card>
			</el-col>
		</el-row>
		
		<el-row :gutter="19">
			<el-col :span="8">
				<el-card shadow="hover">
					 <div class="crumbs">
						<el-button type="primary" icon="delete" class="handle-del mr10" @click="updateMaxUseDoumidou">修改一次支付最多使用哆咪豆</el-button>
					 </div>
					<el-input placeholder="一次最多可使用最哆咪豆数" v-model="maxUseDoumidou" oninput="value=value.replace(/[^\d]/g,'')" style="width: 220px;"> </el-input>
				&nbsp;<span style="color: red;" >一次最多可使用{{maxUseDoumidou}}个哆咪豆</span>
				</el-card>
			</el-col>
		</el-row>
		
    </div>
</template>

<script>
    import Schart from 'vue-schart';
    import bus from '../common/bus';
    export default {
        name: 'dashboard',
        data: function() {
            return {
				selectDate : '',
				listUpdateUrl : '/updateConstant/getAllUpdate',
				updateEndTimeUrl : '/updateConstant/updateEndTime',
				updateEstimatedTimeOFDeliveryUrl : '/updateConstant/updateEstimatedTimeOFDelivery',
				updateMaxUseDoumidouUrl : '/updateConstant/updateMaxUseDoumidou',
				updateRateUrl:'/updateConstant/updateRate',
				updateRebateRateUrl:'/updateConstant/updateRebateRate',				
				updateMaxAcceptableDistanceUrl:'/updateConstant/updateMaxAcceptableDistance',
				updateNewCustomerFlagPriceUrl:'/updateConstant/updateNewCustomerFlagPrice',	
				comboUrl : 'statistic/combo',
				foodUrl : 'statistic/food',
				endTime: '',
				estimatedTimeOFDelivery:'',
				rate: '',
				updateVisible:false,
				maxUseDoumidou:'',
				rebateRate:'',
				maxAcceptableDistance:'',
				newCustomerFlagPrice:'',
				combos : [],
				foods : [],
				lists:[]
            }
        },
        components: {
            Schart
        },
        computed: {
			
			rules : function(){
				var vue = this;
				var finalRules = {//新增,修改都用得到
					endTime : [{required: true, message: '菜品类型必选', trigger: 'blur'}],
					rate: [{required: true, message: '选择是否上架', trigger: 'blur'}],
					maxUseDoumidou : [{required: true, message: '菜品名称必填', trigger: 'blur'}],
					rebateRate : [{required: true, message: '价格必填', trigger: 'blur'}],
				}
				return finalRules;
			},
			
			comboOptions : function(){
				var vue = this;
				return {
					title: vue.selectDate + ' 需准备的套餐预览',
					showValue: true,
					fillColor: 'rgb(7,196,168)',
					bottomPadding: 30,
					topPadding: 30
				};
			},
			foodOptions : function(){
				var vue = this;
				return {
					title: vue.selectDate + ' 需准备的菜品预览',
					showValue: true,
					fillColor: 'rgb(7,196,168)',
					bottomPadding: 30,
					topPadding: 30
				};
			},
            comboData : function(){
				var vue = this;
				return vue.combos.map(combo => {
					return {
						name :	combo.cname,
						value : combo.comboCounts
					}
				})
			},
			foodData : function(){
				var vue = this;
				return vue.foods.map(food => {
					return {
						name :	food.fname,
						value : food.foodCounts
					}
				})
			}
        },
		

        created(){
            this.handleListener();
        },
        activated(){
            //this.handleListener();
        },
        deactivated(){
            window.removeEventListener('resize', this.renderChart);
            bus.$off('collapse', this.handleBus);
        },
        methods: {
			
			dateChange : function(){
				//发送请求,获取数据
				this.getComboList();
				this.getFoodList();
			},
			
			getComboList : function(){
				var vue = this;
				vue.$jsonAxios.get(vue.comboUrl + vue.assembleQuery()).then(function(response){
					var data = response.data;
					if(vue.$util.checkIfDataSuccess(data)){
						vue.combos = data.data.data;
					}else
						vue.$message.error("错误码：" + data.code + " " + data.message);
				}).catch(function(error){
					vue.$util.axiosErrorHandler(error);
				})
			},
			
			getFoodList : function(){
				var vue = this;
				vue.$jsonAxios.get(vue.foodUrl + vue.assembleQuery()).then(function(response){
					var data = response.data;
					if(vue.$util.checkIfDataSuccess(data)){
						vue.foods = data.data;
					}else
						vue.$message.error("错误码：" + data.code + " " + data.message);
				}).catch(function(error){
					vue.$util.axiosErrorHandler(error);
				})
			},
			
			
			updateEndTime(){
				var vue = this;
				var reg = /^(20|21|22|23|[0-1]\d):[0-5]\d$/;
				var regExp = new RegExp(reg);
				if(!regExp.test(vue.endTime)){
					vue.$message.error("请选择正确时间");
					vue.handleListener();
					return;
				}
				var finalUrl = this.updateEndTimeUrl+"?endTime="+vue.endTime+":00";
				vue.$jsonAxios.get(finalUrl).then(function(response){
					//这里只能说明返回的状态码是以2开头的.
					var responseData = response.data;
					if(vue.$util.checkIfDataSuccess(responseData)){
						vue.$message.success("修改成功！");
						vue.handleListener();						
					}else
						vue.$message.error("错误码：" + responseData.code + " " + responseData.message);
				}).catch(function(err){
					//console.log(err);
					vue.$util.axiosErrorHandler(err,vue);
				})
			},
			
			updateEstimatedTimeOFDelivery(){
				var vue = this;
				var reg = /^(20|21|22|23|[0-1]\d):[0-5]\d$/;
				var regExp = new RegExp(reg);
				if(!regExp.test(vue.estimatedTimeOFDelivery)){
					vue.$message.error("请选择正确时间");
					vue.handleListener();
					return;
				}
				var finalUrl = this.updateEstimatedTimeOFDeliveryUrl+"?estimatedTimeOFDelivery="+vue.estimatedTimeOFDelivery+":00";
				vue.$jsonAxios.get(finalUrl).then(function(response){
					//这里只能说明返回的状态码是以2开头的.
					var responseData = response.data;
					if(vue.$util.checkIfDataSuccess(responseData)){
						vue.$message.success("修改成功！");
						vue.handleListener();						
					}else
						vue.$message.error("错误码：" + responseData.code + " " + responseData.message);
				}).catch(function(err){
					//console.log(err);
					vue.$util.axiosErrorHandler(err,vue);
				})
			},
			
			
			
			
			
			
			
			
			
			
			updateMaxUseDoumidou(){
				var vue = this;
				if(vue.maxUseDoumidou == ""){
					vue.$message.error("哆咪豆数量不能为空");
					vue.handleListener();
					return;
				}
				var finalUrl = this.updateMaxUseDoumidouUrl+"?maxUseDoumidou="+vue.maxUseDoumidou;
				vue.$jsonAxios.get(finalUrl).then(function(response){
					//这里只能说明返回的状态码是以2开头的.
					var responseData = response.data;
					if(vue.$util.checkIfDataSuccess(responseData)){
						vue.$message.success("修改成功！");
						vue.handleListener();						
					}else
						vue.$message.error("错误码：" + responseData.code + " " + responseData.message);
				}).catch(function(err){
					//console.log(err);
					vue.$util.axiosErrorHandler(err,vue);
				})
				
			},
			updateRate(){
				var vue = this;
				if(vue.rate == ""){
					vue.$message.error("哆咪豆数量不能为空");
					vue.handleListener();
					return;
				}
				var finalUrl = this.updateRateUrl+"?rate="+vue.rate;
				vue.$jsonAxios.get(finalUrl).then(function(response){
					//这里只能说明返回的状态码是以2开头的.
					var responseData = response.data;
					if(vue.$util.checkIfDataSuccess(responseData)){
						vue.$message.success("修改成功！");
						vue.handleListener();						
					}else
						vue.$message.error("错误码：" + responseData.code + " " + responseData.message);
				}).catch(function(err){
					//console.log(err);
					vue.$util.axiosErrorHandler(err,vue);
				})
				
			},
			
			
			updateMaxAcceptableDistance(){
				var vue = this;
				if(vue.maxAcceptableDistance == ""){
					vue.$message.error("哆咪豆数量不能为空");
					vue.handleListener();
					return;
				}
				var finalUrl = this.updateMaxAcceptableDistanceUrl+"?maxAcceptableDistance="+vue.maxAcceptableDistance;
				vue.$jsonAxios.get(finalUrl).then(function(response){
					//这里只能说明返回的状态码是以2开头的.
					var responseData = response.data;
					if(vue.$util.checkIfDataSuccess(responseData)){
						vue.$message.success("修改成功！");
						vue.handleListener();						
					}else
						vue.$message.error("错误码：" + responseData.code + " " + responseData.message);
				}).catch(function(err){
					//console.log(err);
					vue.$util.axiosErrorHandler(err,vue);
				})				
			},
			
			
			updateRebateRate(){
				var vue = this;
				if(vue.rebateRate == ""){
					vue.$message.error("哆咪豆数量不能为空");
					vue.handleListener();
					return;
				}
				var finalUrl = this.updateRebateRateUrl+"?rebateRate="+vue.rebateRate;
				vue.$jsonAxios.get(finalUrl).then(function(response){
					//这里只能说明返回的状态码是以2开头的.
					var responseData = response.data;
					if(vue.$util.checkIfDataSuccess(responseData)){
						vue.$message.success("修改成功！");
						vue.handleListener();						
					}else
						vue.$message.error("错误码：" + responseData.code + " " + responseData.message);
				}).catch(function(err){
					//console.log(err);
					vue.$util.axiosErrorHandler(err,vue);
				})				
			},
			
			updateNewCustomerFlagPrice(){
				var vue = this;
				if(vue.newCustomerFlagPrice == "" || vue.newCustomerFlagPrice <= 0.00){
					vue.$message.error("支付金额大于0.00（元）");
					vue.handleListener();
					return;
				}
				var finalUrl = this.updateNewCustomerFlagPriceUrl+"?newCustomerFlagPrice="+vue.newCustomerFlagPrice;
				vue.$jsonAxios.get(finalUrl).then(function(response){
					//这里只能说明返回的状态码是以2开头的.
					var responseData = response.data;
					if(vue.$util.checkIfDataSuccess(responseData)){
						vue.$message.success("修改成功！");
						vue.handleListener();						
					}else
						vue.$message.error("错误码：" + responseData.code + " " + responseData.message);
				}).catch(function(err){
					//console.log(err);
					vue.$util.axiosErrorHandler(err,vue);
				})		
				
				
			},
			
			
			
			handleAdd(){
				var vue = this;
				//清空fileList
				vue.fileList = [];
				//重置form
				vue.form = {
					online : 0
				};
				vue.addVisible = true;
				vue.$nextTick(function(){
					vue.$refs.addform.clearValidate();
				})
			},
			
			
			initSelectedDate : function(){
				var date = new Date();
				this.selectDate = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + (date.getDate()+1);
			},
			assembleQuery : function(){
				var date = this.selectDate;
				var nextDate = new Date(new Date(date).setDate((new Date(date).getDate()+1)));
				var endDate = nextDate.getFullYear() + '-' + (nextDate.getMonth()+1) + '-' + (nextDate.getDate());
				var param = {
					beginDate : '2018-03-22',//date,
					endDate : '2020-03-22'//endDate
				};
				return '?'+this.$qs.stringify(param);
			},
			
            handleListener(){
               var vue = this;
			   vue.$jsonAxios.get(this.listUpdateUrl).then(function(response){
			   	//这里只能说明返回的状态码是以2开头的.
			   	var data = response.data;
			   	if(data.code == vue.$util.success_code){//成功返回列表
					vue.lists = data.data;
					vue.rate = vue.lists.rate;
					vue.maxUseDoumidou = vue.lists.maxUseDoumidou;
					vue.endTime = vue.lists.endTime;
					vue.rebateRate = vue.lists.rebateRate;
					vue.maxAcceptableDistance = vue.lists.maxAcceptableDistance;
					vue.newCustomerFlagPrice = vue.lists.newCustomerFlagPrice;
					vue.estimatedTimeOFDelivery = vue.lists.estimatedTimeOFDelivery;
			   	}else
			   		vue.$message.error("错误码：" + data.code + " " + data.message);
			   }).catch(function(err){
			   	//console.log(err);
			   	vue.$util.axiosErrorHandler(err,vue);
			   }) 
            },
            handleBus(msg){
                setTimeout(() => {
                    this.renderChart()
                }, 300);
            },
            renderChart(){
                this.$refs.bar.renderChart();
                this.$refs.bar2.renderChart();
            }
        }
    }

</script>


<style scoped>
    .el-row {
        margin-bottom: 20px;
    }

    .grid-content {
        display: flex;
        align-items: center;
        height: 100px;
    }

    .grid-cont-right {
        flex: 1;
        text-align: center;
        font-size: 14px;
        color: #999;
    }

    .grid-num {
        font-size: 30px;
        font-weight: bold;
    }

    .grid-con-icon {
        font-size: 50px;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
        color: #fff;
    }

    .grid-con-1 .grid-con-icon {
        background: rgb(45, 140, 240);
    }

    .grid-con-1 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-2 .grid-con-icon {
        background: rgb(100, 213, 114);
    }

    .grid-con-2 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-3 .grid-con-icon {
        background: rgb(242, 94, 67);
    }

    .grid-con-3 .grid-num {
        color: rgb(242, 94, 67);
    }

    .user-info {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        border-bottom: 2px solid #ccc;
        margin-bottom: 20px;
    }

    .user-avator {
        width: 120px;
        height: 120px;
        border-radius: 50%;
    }

    .user-info-cont {
        padding-left: 50px;
        flex: 1;
        font-size: 14px;
        color: #999;
    }

    .user-info-cont div:first-child {
        font-size: 30px;
        color: #222;
    }

    .user-info-list {
        font-size: 14px;
        color: #999;
        line-height: 25px;
    }

    .user-info-list span {
        margin-left: 70px;
    }

    .mgb20 {
        margin-bottom: 20px;
    }

    .todo-item {
        font-size: 14px;
    }

    .todo-item-del {
        text-decoration: line-through;
        color: #999;
    }

    .schart {
        width: 100%;
        height: 300px;
    }

</style>
