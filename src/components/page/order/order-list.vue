<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
				<!-- TODO 修改下图标-->
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 订单列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
				<!-- <el-button type="primary" icon="delete" class="handle-del mr10" @click="batchDelete">批量删除</el-button> -->
				
				<el-select v-model="queryInfo.comboId" placeholder="种类筛选" class="handle-select mr10">
				    <el-option v-for="combom in combo" :key="combom.id" :label="combom.cname" :value="combom.id"></el-option>
				</el-select>
				

				<el-date-picker
				  v-model="salesModel"
				  type="daterange"
				  align="right"
				  unlink-panels
				  range-separator="至"
				  start-placeholder="开始日期"
				  end-placeholder="结束日期"
				  value-format="yyyy-MM-dd HH:mm:ss"
				  >
				</el-date-picker>&nbsp;&nbsp;
				<el-input v-model="queryInfo.query" placeholder="名称筛选" class="handle-input mr10"></el-input>
				<el-button type="primary" icon="search" @click="getOrderBy">搜索</el-button>
				
            </div> 
            <el-table :data="data" border class="table" @expand-change="getSalesOrderLine">
                <el-table-column label="展开" width="60" type="expand" :expand-change="getSalesOrderLine">
					
					<!-- <template slot-scope="props">
						<el-table :data="[{}]" border class="table" >
							<el-table-column prop="index" label="序号" width="60" align="center"></el-table-column>
						</el-table>
					</template> -->
					
				</el-table-column>
				<el-table-column prop="index" label="序号" width="60" align="center"></el-table-column>
                <el-table-column prop="name" label="发起人用户名" align="center"></el-table-column>
				<el-table-column prop="tel" label="联系方式" sortable align="center"></el-table-column>
				<el-table-column prop="cname" label="套餐名称" sortable align="center"></el-table-column>
                <el-table-column prop="orderNumber" label="订单号" sortable align="center"></el-table-column>
				<el-table-column prop="orderTime" label="下单时间" align="center"></el-table-column>
				<el-table-column prop="orderType" label="订单类型" align="center"></el-table-column>
				<el-table-column prop="expectReachTime" label="期望送达时间" align="center"></el-table-column>
				<el-table-column prop="finalPrice" label="最终价格(元)" align="center"></el-table-column>
				
				<!-- <el-table-column label="查看所有订单"  align="center">
				    <template slot-scope="scope">
				        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					</template>
				</el-table-column> -->
				
            </el-table>
			
			<div class="pagination">
			    <el-pagination background @current-change="pageChange" :page-size="pageInfo.pageSize"
					layout="prev, pager, next" :total="pageInfo.totalData"></el-pagination>
			</div>
        </div>


        <!-- TODO删除提示框 -->
       <!-- <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">确定要{{onlinTypes[needToChangeOnlineStatusFood.online]}}该食品吗？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog> -->
    </div>
	
	
	
</template>




<script>
    export default {
        name: 'basetable',
        data() {
            return {
				
				listUrl : 'order/listAllOrder',
				addUrl : 'food/addFood',
				editUrl : 'food/updateFood',
				delUrl : 'food/deleteFood',
				listComboUrl : 'combo/listCombo',
				combo : [],
				onlinTypes : ['上架','下架'],
				salesModels : [],
				fileName : 'img',
				salesModel:[],
				fileList:[],
				limit : 1,
				withCredentials : true,
				
				addVisible:false,
				editVisible: false,
				delVisible: false,
				queryInfo:{//查询条件
					comboId : '',
					query : '',
					orderTime:'',
					endTime:''
					
				},
				
				
				
				pageInfo:{
					"pageNo": 1,		//形如这种格式
					//"pageSize": 6,
					//"start": 0,
					//"totalData": 22,
					"totalPage": 1
				},
				
				validateOnRuleChange : false,
				
                form: {//新增或者修改都需要用到
                },		
				
				needToChangeOnlineStatusFood:{
					online : 1
				}//点击上架，下架按钮所暂存的数据.

            }
        },
		
		
        created() {
			//初始化轮播图数据
            this.getRawOrderList();
			this.getComboNameList();
			//初始化修改轮播图的url地址,因为这里使用element的upload而不是aoixs所以需要手动配置地址
			this.editUrl = this.$urlConfig.baseUrl + this.editUrl;
			this.addUrl = this.$urlConfig.baseUrl + this.addUrl;
			this.listComboUrl = this.$urlConfig.baseUrl + this.listComboUrl;
        },
        computed: {
			
            data(){
				var vue = this;
                return vue.salesModels.map((salesModels,index) => {
                   return {
					   index : index + 1,
					   id : salesModels.id,
					   name :salesModels.customer.nickname,
					   tel : salesModels.customer.tel,
					   cname:salesModels.combo.cname,
					   orderNumber : salesModels.orderNumber,
					   orderTime : vue.$util.getYMDHmString(salesModels.orderTime),
					   orderType: salesModels.groupNumber + '人(' + ['团拼','个人单'][salesModels.status] + ')',//显示是否是团拼和总共拼团人数
					   expectReachTime:vue.$util.getYMDHmString(salesModels.expectReachTime),
					   finalPrice:salesModels.finalPrice
				   };
                })
            }
        },
        methods: {
			getOrderBy(){
				 this.pageInfo.pageNo='1';
				 this.getRawOrderList();
			},
			
			
			
			handleEdit(index, row) {
				var vue = this;
				vue.idx = index;
				const SalesLine = vue.data[index];
				console.log("1122="+food.id);
				vue.form = {
				   id : food.id
				}
				vue.fileList = [];
				vue.editVisible = true;
// 				vue.$nextTick(function(){//注意需要在visible为true之后调用 emmmmm
// 					vue.$refs.editform.clearValidate();
// 				})
			},
			
            getRawOrderList() {
				var vue = this;
				var finalUrl = vue.assembleQueryUrl();
				vue.$jsonAxios.get(finalUrl).then(function(response){
					//这里只能说明返回的状态码是以2开头的.
					var data = response.data;
					if(data.code == vue.$util.success_code){//成功返回列表
						vue.salesModels = data.data.data;//特喵的,我自己看着都头大
						var page = data.data.page;
						vue.pageInfo = {
							pageNO : page.pageNO,
							pageSize : page.pageSize,
							totalData : page.totalData
 						};
					}else
						vue.$message.error("错误码：" + data.code + " " + data.message);
				}).catch(function(err){
					//console.log(err);
					vue.$util.axiosErrorHandler(err,vue);
				})
                
            },
			
			getComboNameList(){
				var vue = this;
				var url = vue.listComboUrl + "?pageSize=" + vue.$util.maxPageSize;
				vue.$jsonAxios.get(url).then(function(response){
					var data = response.data;
					if(data.code == vue.$util.success_code){//成功返回列表
						vue.combo = data.data.data;//特喵的,我自己看着都头大
						}else
							vue.$message.error("错误码：" + data.code + " " + data.message);
						}).catch(function(err){
							//console.log(err);
							vue.$util.axiosErrorHandler(err,vue);
						})
					    
					},

			assembleQueryUrl : function(){
				var pageInfo = this.pageInfo;
				this.queryInfo.orderTime=this.salesModel[0];
				this.queryInfo.endTime=this.salesModel[1];
				var queryInfo = this.queryInfo;
				var params = {};
				this.$util.assembleNewParamsWithNoUndefinedNullProperty(params,pageInfo);
				this.$util.assembleNewParamsWithNoUndefinedNullProperty(params,queryInfo);
				console.log(params);
				return this.listUrl + "?" + this.$qs.stringify(params);
			},
			
					
			pageChange : function(val){
				this.pageInfo.pageNo = val;
				this.getRawOrderList();
			},
			
			getSalesOrderLine : function(row,expanded){
				console.log(expanded);
			}
			
		}
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
    .table{
        width: 100%;
        font-size: 14px;
    }
    .red{
        color: #ff0000;
    }
    .mr10{
        margin-right: 10px;
    }
	/* flex布局居中 */
	.footer-center{
		display: flex;
		justify-content: center;
	}
	
</style>
