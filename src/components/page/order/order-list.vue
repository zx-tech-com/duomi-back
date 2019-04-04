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
            <el-table :data="data" border class="table" >
                <el-table-column prop="index" label="序号" width="60" align="center"></el-table-column>
                <!-- <el-table-column type="selection" width="60" align="center"></el-table-column> -->
               
                <el-table-column prop="name" label="用户名" align="center"></el-table-column>
				<el-table-column prop="tel" label="联系方式" sortable align="center"></el-table-column>
				<el-table-column prop="cname" label="套餐名称" sortable align="center"></el-table-column>
                <el-table-column prop="orderNumber" label="订单号" sortable align="center"></el-table-column>
				<el-table-column prop="orderTime" label="下单时间" align="center"></el-table-column>
				<el-table-column prop="endTime" label="最迟团拼时间" align="center"></el-table-column>
				<el-table-column prop="expectReachTime" label="期望送达时间" align="center"></el-table-column>
				<el-table-column prop="finalPrice" label="最终价格" align="center"></el-table-column>
				
				<el-table-column label="查看所有订单"  align="center">
				    <template slot-scope="scope">
				        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					</template>
				</el-table-column>
				
            </el-table>
			
			<div class="pagination">
			    <el-pagination background @current-change="pageChange" :page-size="pageInfo.pageSize"
					layout="prev, pager, next" :total="pageInfo.totalData"></el-pagination>
			</div>
        </div>



		




        <!-- TODO删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">确定要{{onlinTypes[needToChangeOnlineStatusFood.online]}}该食品吗？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
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
            this.getRawFoodList();
			this.getComboNameList();
			//初始化修改轮播图的url地址,因为这里使用element的upload而不是aoixs所以需要手动配置地址
			this.editUrl = this.$urlConfig.baseUrl + this.editUrl;
			this.addUrl = this.$urlConfig.baseUrl + this.addUrl;
			this.listComboUrl = this.$urlConfig.baseUrl + this.listComboUrl;
        },
        computed: {
			rules : function(){
				var vue = this;
				var validateImg = (rule, value, callback) => {
					if (vue.$refs.addUpload.uploadFiles.length == 0) {
					  callback(new Error('请上传照片'));
					}
					callback();
				};
				
				var finalRules = {//新增,修改都用得到
					ftype : [{required: true, message: '菜品类型必选', trigger: 'blur'}],
					online: [{required: true, message: '选择是否上架', trigger: 'blur'}],
					fname : [{required: true, message: '菜品名称必填', trigger: 'blur'}],
					price : [{required: true, message: '价格必填', trigger: 'blur'}],
				}
				if(vue.addVisible)//修改是不需要验证图片必须上传的
					finalRules.img = [{ validator: validateImg}];
				return finalRules;
			},
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
					   orderTime : salesModels.orderTime,
					   endTime: salesModels.endTime,
					   expectReachTime:salesModels.expectReachTime,
					   finalPrice:salesModels.finalPrice

				   };
                })
            },
			editData : function(){
				var vue = this;
				return {
					id : vue.form.id,
					ftype : vue.form.ftype,
					fname : vue.form.fname,
					price : vue.form.price,
					// online : vue.form.online
				}
			},
			addData : function(){
				var vue = this;
				return {
					ftype : vue.form.ftype,
					fname : vue.form.fname,
					price : vue.form.price,
					// online : vue.form.online
				}
			}
        },
        methods: {
			getOrderBy(){
				 this.pageInfo.pageNo='1';
				 this.getRawFoodList();
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
			
            getRawFoodList() {
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
				vue.$jsonAxios.get(vue.listComboUrl).then(function(response){
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

         
			
			
            updateOnlineStatus(index, row) {
				
				var online = this.onlinTypes.indexOf(row.online);//修改前状态
				online =  online == -1? 0 : online;//如果indexOf返回-1 就让状态变为0 即 上架
				
				online = Math.abs((online-1));//更改后的状态 即0变1,1变0
                this.needToChangeOnlineStatusFood.idx = index;
				this.needToChangeOnlineStatusFood.id = row.id;
				this.needToChangeOnlineStatusFood.online = online;
                this.delVisible = true;
            },
				
				
			//新增请求
			addSubmit(){
				var vue = this;
				vue.$refs.addform.validate(function(result,object){//表单验证
					if(result == true){
						//console.log(vue.$refs.addUpload.data);
						vue.$refs.addUpload.submit();
					}
				})
			},
					
            // 提交修改请求
            editSubmit() {
				var vue = this;
				vue.$refs.editform.validate(function(result,obj){
					if(result){//验证通过
						if(vue.$refs.editUpload.uploadFiles.length == 1)//说明有图片上传
							vue.$refs.editUpload.submit();
						else//无图片上传
							vue.editSubmitByHand();
					}
				})
            },
			
			editSubmitByHand : function(){
				var vue = this;
				vue.$jsonAxios.post(vue.editUrl,vue.$qs.stringify(vue.editData)).then(function(response){
					var responseData = response.data;
					if(vue.$util.checkIfDataSuccess(responseData))
						vue.$message.success("修改成功！");
					else
						vue.$message.error("错误码：" + responseData.code + " " + responseData.message);
					//刷新列表
					vue.getRawFoodList();
					//隐藏编辑框
					vue.editVisible = false;
				}).catch(function(error){
					vue.$util.axiosErrorHandler(error,vue)
				})
			},
			
            // 确定删除
            deleteRow(){
				var vue = this;
				//使用axios删除
				vue.$jsonAxios.post(vue.delUrl,vue.$qs.stringify(vue.needToChangeOnlineStatusFood)).then(function(response){
					
					var data = response.data;
					if(data.code == vue.$util.success_code){
						vue.foods.splice(vue.needToChangeOnlineStatusFood.idx, 1);
						var p = vue.onlinTypes[vue.needToChangeOnlineStatusFood.online];
						vue.$message.success(p + "成功");
					}
					else{
						vue.$message.error("错误码：" + data.code + " " + data.message);
					}
					vue.delVisible = false;
				}).catch(function(error){
					vue.$util.axiosErrorHandler(error);
				})
            },
			
			cancelAdd : function(){
				this.addVisible = false;
			},
			cancelEdit:function(){
				this.editVisible = false;
			},
		
			pageChange : function(val){
				this.pageInfo.pageNo = val;
				this.getRawFoodList();
			},
		
			editSuccess : function(data, file, fileList){
				var vue = this;
				if(vue.$util.checkIfDataSuccess(data)){
					vue.$message.success(`修改成功!`);
					//刷新列表
					vue.getRawFoodList();
					//隐藏编辑框
					vue.editVisible = false;
				}else
					vue.editError();
			},
			
			editError: function(response, file, fileList){
				this.$message.error(`修改失败!`);
			},
			
			
			addSuccess : function(data, file, fileList){
				var vue = this;
				if(vue.$util.checkIfDataSuccess(data)){
					vue.$message.success(`新增成功!`);
					//刷新列表
					vue.getRawFoodList();
					//隐藏编辑框
					vue.addVisible = false;
				}else
					vue.addError();
				
				
			},
			
			addError: function(response, file, fileList){
				this.$message.error(`新增失败!`);
			},
			
			
			onExceed : function(){
				this.$message.error(`最多上传一张,请先删除左边的轮播图`);
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
