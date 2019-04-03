<template>
    <div class="table" v-loading="$root.showLoadingIcon">
        <div class="crumbs">
            <el-breadcrumb separator="/">
				<!-- TODO 修改下图标-->
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 菜品列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
				<!-- <el-button type="primary" icon="delete" class="handle-del mr10" @click="batchDelete">批量删除</el-button> -->
				
				<el-select v-model="queryInfo.ftype"  placeholder="种类筛选" class="handle-select mr10">
				    <el-option v-for="(food, index) in foodTypes" :key="index" :label="food" :value="index"></el-option>
				</el-select>
				
				<el-select v-model="queryInfo.online" placeholder="状态筛选" class="handle-select mr10">
				    <el-option v-for="(online, index) in onlinTypes" :key="index" :label="online" :value="index"></el-option>
				</el-select>
				
				<el-input v-model="queryInfo.query" placeholder="名称筛选" class="handle-input mr10"></el-input>
				<el-button type="primary" icon="search" @click="getRawFoodList">搜索</el-button>
				
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="handleAdd">新增菜品</el-button>
            </div>
            <el-table :data="data" border class="table">
                <el-table-column prop="index" label="序号" width="60" align="center"></el-table-column>
                <!-- <el-table-column type="selection" width="60" align="center"></el-table-column> -->
                <el-table-column prop="imgUrl" label="图片" align="center">
					<template slot-scope="scope">
					  <img  :src="scope.row.imgUrl" alt="图片加载失败" style="width: 100px;height: 60px">
					</template>
                </el-table-column>
                <el-table-column prop="fname" label="名称" align="center"></el-table-column>
                <el-table-column prop="price" label="价格" sortable align="center"></el-table-column>
				<el-table-column prop="ftype" label="类型" align="center"></el-table-column>
				<el-table-column prop="online" label="状态" align="center"></el-table-column>
				<el-table-column label="操作"  align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button v-if="scope.row.online == '上架'" type="text" icon="el-icon-delete" class="red" @click="updateOnlineStatus(scope.$index, scope.row)">下架</el-button>
						<el-button v-else type="text" icon="el-icon-edit" @click="updateOnlineStatus(scope.$index, scope.row)">上架</el-button>
					</template>
                </el-table-column>
            </el-table>
			<div class="pagination">
			    <el-pagination background @current-change="pageChange" :page-size="pageInfo.pageSize"
					layout="prev, pager, next" :total="pageInfo.totalData"></el-pagination>
			</div>
        </div>



		<!-- 编辑弹出框 -->
		<el-dialog title="修改菜品" :visible.sync="editVisible" width="30%">
			<el-form ref="editform" :model="form" :rules="rules" label-width="80px" >
				<el-form-item label="菜品类型"  prop="ftype" >
				    <el-select v-model="form.ftype" placeholder="选择菜品类型" class="handle-select mr10">
				        <el-option v-for="(food, index) in foodTypes" :key="index" :label="food" :value="index"></el-option>
				    </el-select>
				</el-form-item>
				
				<!-- <el-form-item label="是否上架"  prop="online">
				    <el-select v-model="form.online" placeholder="默认为上架" class="handle-select mr10">
						<el-option v-for="(online, index) in onlinTypes" :key="index" :label="online" :value="index"></el-option>
				    </el-select>
				</el-form-item> -->
				
			    <el-form-item label="菜品名称"  prop="fname">
			        <el-input v-model="form.fname"></el-input>
			    </el-form-item>
				
			    <el-form-item label="菜品价格"  prop="price">
			        <el-input v-model="form.price" placeholder="小数点后最多2位,单位为元"></el-input>
			    </el-form-item>
				
				<el-form-item label="原图片">
				    <img :src="form.imgUrl" alt="呀,图片加载不出来" width="200px" height="200px"/>
				</el-form-item>
				
				<el-form-item label="菜品照片"  prop="img">
					<el-upload
					  class="upload-demo"
					  ref="editUpload"
					  list-type="picture-card"
					  accept = "image/*"
					  :headers = "$root.headers"
					  :with-credentials = "withCredentials"
					  :action="editUrl"
					  :data = "editData"
					  :limit = "limit"
					  :name = "fileName"
					  :file-list="fileList"
					  :on-error="editError"
					  :on-success="editSuccess"
					  :on-exceed = "onExceed"
					  :auto-upload="false">
					  <el-button slot="trigger" size="small" type="primary">选取图片</el-button>
					</el-upload>
				</el-form-item>
			</el-form>
		    <span slot="footer" class="dialog-footer">
				<div class="footer-center">
					<el-button @click="cancelEdit">取 消</el-button>
					<el-button type="primary" @click="editSubmit">提 交</el-button>
				</div>
		    </span>
		</el-dialog>



        <!-- 新增菜品弹窗 -->
        <el-dialog title="新增菜品" :visible.sync="addVisible" width="30%">
			<el-form ref="addform" :model="form" :rules="rules" label-width="80px" >
				<el-form-item label="菜品类型"  prop="ftype" >
				    <el-select v-model="form.ftype" placeholder="选择菜品类型" class="handle-select mr10">
				        <el-option v-for="(food, index) in foodTypes" :key="index" :label="food" :value="index"></el-option>
				    </el-select>
				</el-form-item>
				
				<!-- <el-form-item label="是否上架"  prop="online">
				    <el-select v-model="form.online" placeholder="默认为上架" class="handle-select mr10">
						<el-option v-for="(online, index) in onlinTypes" :key="index" :label="online" :value="index"></el-option>
				    </el-select>
				</el-form-item> -->
				
			    <el-form-item label="菜品名称"  prop="fname">
			        <el-input v-model="form.fname"></el-input>
			    </el-form-item>
				
			    <el-form-item label="菜品价格"  prop="price">
			        <el-input v-model="form.price" placeholder="小数点后最多2位,单位为元"></el-input>
			    </el-form-item>
				
				<el-form-item label="菜品照片"  prop="img">
					<el-upload
					  class="upload-demo"
					  ref="addUpload"
					  list-type="picture-card"
					  accept = "image/*"
					  :headers = "$root.headers"
					  :with-credentials = "withCredentials"
					  :action="addUrl"
					  :data = "addData"
					  :limit = "limit"
					  :name = "fileName"
					  :file-list="fileList"
					  :on-error="addError"
					  :on-success="addSuccess"
					  :on-exceed = "onExceed"
					  :auto-upload="false">
					  <el-button slot="trigger" size="small" type="primary">选取图片</el-button>
					</el-upload>
				</el-form-item>
			</el-form>
            <span slot="footer" class="dialog-footer">
				<div class="footer-center">
					<el-button @click="cancelAdd">取 消</el-button>
					<el-button type="primary" @click="addSubmit">提 交</el-button>
				</div>
            </span>
        </el-dialog>

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
				
				listUrl : 'food/listFood',
				addUrl : 'food/addFood',
				editUrl : 'food/updateFood',
				delUrl : 'food/deleteFood',
				foodTypes : ['主食','辅食','汤羹'],
				onlinTypes : ['上架','下架'],
				foods : [],
				fileName : 'img',
				fileList:[],
				limit : 1,
				withCredentials : true,
				
				addVisible:false,
				editVisible: false,
				delVisible: false,
				
				queryInfo:{//查询条件
					online : 0,
					query : '',
					ftype : ''
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
			//初始化修改轮播图的url地址,因为这里使用element的upload而不是aoixs所以需要手动配置地址
			this.editUrl = this.$urlConfig.baseUrl + this.editUrl;
			this.addUrl = this.$urlConfig.baseUrl + this.addUrl;
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
			
            data() {
				var vue = this;
                return vue.foods.map((food,index) => {
                   return {
					   index : index + 1,
					   id : food.id,
					   imgUrl : vue.$util.getFullAttachmentUrl(food.imgUrl),
					   fname : food.fname,
					   price : food.price,
					   ftype : vue.foodTypes[food.ftype],
					   online: vue.onlinTypes[food.online]
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
            getRawFoodList() {
				var vue = this;
				var finalUrl = vue.assembleQueryUrl();
				vue.$jsonAxios.get(finalUrl).then(function(response){
					//这里只能说明返回的状态码是以2开头的.
					var data = response.data;
					if(data.code == vue.$util.success_code){//成功返回列表
						vue.foods = data.data.data;//特喵的,我自己看着都头大
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

			assembleQueryUrl : function(){
				var pageInfo = this.pageInfo;
				var queryInfo = this.queryInfo;
				var params = {};
				this.$util.assembleNewParamsWithNoUndefinedNullProperty(params,pageInfo);
				this.$util.assembleNewParamsWithNoUndefinedNullProperty(params,queryInfo);
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

            handleEdit(index, row) {
				var vue = this;
                vue.idx = index;
                const food = vue.data[index];
                vue.form = {
                   id : food.id,
                   ftype : vue.foodTypes.indexOf(food.ftype),
                   fname : food.fname,
                   price : food.price,
                   online : vue.onlinTypes.indexOf(food.online),
				   imgUrl : food.imgUrl
                }
				vue.fileList = [];
                vue.editVisible = true;
				vue.$nextTick(function(){//注意需要在visible为true之后调用 emmmmm
					vue.$refs.editform.clearValidate();
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
