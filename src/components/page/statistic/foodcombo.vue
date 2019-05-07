<template>
    <div v-loading="$root.showLoadingIcon">
		<el-row  :gutter="2">
		     <el-col >
		        <el-card shadow="hover">
		            <div class="block">
		            	<el-date-picker  value-format="yyyy-MM-dd" @change="dateChange" v-model="selectDate" type="date" placeholder="选择日期"></el-date-picker>
		            </div>
		        </el-card>
		    </el-col>
		</el-row>
		
        <el-row :gutter="19">
             <el-col >
                <el-card shadow="hover">
                    <schart v-show="comboData.length > 0" ref="bar" class="schart" canvasId="bar" :data="comboData" type="bar" :options="comboOptions"></schart>
					<div v-show="comboData.length == 0">无订单信息</div>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="19">
            <el-col >
                <el-card shadow="hover">
					<div v-show="foodData.length == 0">无订单信息</div>
                    <schart v-show="foodData.length > 0" ref="bar2" class="schart" canvasId="bar2" :data="foodData" type="bar" :options="foodOptions"></schart>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import Schart from 'vue-schart';
    import bus from '../../common/bus';
    export default {
        name: 'dashboard',
        data: function() {
            return {
				selectDate : '',
				comboUrl : 'statistic/combo',
				foodUrl : 'statistic/food',
				
				combos : [],
				foods : [],
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
			this.initSelectedDate();
			this.dateChange();
        },
        activated(){
            this.handleListener();
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
						vue.combos = data.data;
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
                bus.$on('collapse', this.handleBus);
                // 调用renderChart方法对图表进行重新渲染
                window.addEventListener('resize', this.renderChart)
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
