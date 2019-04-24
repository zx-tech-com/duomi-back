<template>
    <div v-loading="$root.showLoadingIcon">
        <el-row :gutter="19">
             <el-col >
				 <div class="crumbs">
				     <el-button type="primary" icon="delete" class="handle-del mr10" @click="updateEndTime">修改团拼截止时间</el-button>
				 </div>
				 <el-card shadow="hover">
					<el-time-select v-model="endTime" :picker-options="{
							start: '08:30',
							step: '00:10',
							end: '24:00'
						  }"
						 placeholder="选择时间">
					</el-time-select>
				 </el-card>
            </el-col>
        </el-row>
		
		
         <el-row :gutter="19">
             <el-col >
        		 <div class="crumbs">
        		    <el-button type="primary" icon="delete" class="handle-del mr10" @click="handleAdd">新增菜品</el-button>
        		 </div>
        		 <el-card shadow="hover">
        			<el-input placeholder="一次最多可使用多米豆数" v-model="maxUseDoumidou" > </el-input>
        			</el-card>
            </el-col>
        </el-row>
		
		
		<el-row :gutter="19">
		     <el-col >
				 <div class="crumbs">
				     <el-button type="primary" icon="delete" class="handle-del mr10" @click="handleAdd">新增菜品</el-button>
				 </div>
				 <el-card shadow="hover">
					<el-input placeholder="请输入换算多米豆数量" v-model="rate" > </el-input>
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
				comboUrl : 'statistic/combo',
				foodUrl : 'statistic/food',
				endTime: '',
				rate: '',
				maxUseDoumidou:'',
				combos : [],
				foods : [],
				lists:[]
            }
        },
        components: {
            Schart
        },
        computed: {
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
			this.listUpdateUrl = this.$urlConfig.baseUrl + this.listUpdateUrl;
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
					vue.endTime = vue.lists.endTime
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
