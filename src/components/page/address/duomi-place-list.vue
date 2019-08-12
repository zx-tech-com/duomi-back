<template>
    <div class="table" v-loading="$root.showLoadingIcon">
        <div class="crumbs">
            <el-breadcrumb separator="/">
				<!-- TODO 修改下图标-->
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 投放点列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-table :data="data" border class="table">
                <el-table-column prop="index" label="序号" sortable  align="center" width="140"></el-table-column>
                <el-table-column prop="shortName" label="投放点" align="center" width="200"></el-table-column>
				<el-table-column prop="porderCabinetCount" label="个人柜子数目" align="center" width="180"></el-table-column>
				<el-table-column prop="cabinetCount" label="柜子总数" align="center" width="140"></el-table-column>
				<el-table-column prop="combosPerCabinet" label="最大容量" align="center" width="140"></el-table-column>
				<el-table-column prop="address" label="具体地址" align="center" ></el-table-column>
				
				<el-table-column label="查看订单"  align="center">
				    <template slot-scope="scope">
				        <el-button type="text" @click="gotoPlaceInfo(scope.row)">查看订单情况</el-button>
				    </template>
				</el-table-column>
				
				<el-table-column label="操作"  align="center">
				    <template slot-scope="scope">
				        <!-- <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button> -->
				        <el-button v-if="scope.row.online == '上架'" type="text" icon="el-icon-delete" class="red" @click="updateOnlineStatus(scope.$index, scope.row)">删除</el-button>
<!-- 						<el-button v-else type="text" icon="el-icon-edit" @click="updateOnlineStatus(scope.$index, scope.row)">上架</el-button> -->
					</template>
				</el-table-column>	
            </el-table>
        </div>

		<!-- 编辑弹出框 -->
		<el-dialog title="修改投放点信息" :visible.sync="editVisible" width="30%">
			<el-form ref="form" :model="form" label-width="80px">
			    <el-form-item label="投放点名称">
			        <el-input v-model="form.shortName"></el-input>
			    </el-form-item>
				
			    <el-form-item label="个人柜子数目">
			        <el-input v-model="form.porderCabinetCount"></el-input>
			    </el-form-item>
				
				<el-form-item label="柜子总数">
				    <el-input v-model="form.cabinetCount"></el-input>
				</el-form-item>
				
				<el-form-item label="最大容量">
				    <el-input v-model="form.combosPerCabinet"></el-input>
				</el-form-item>
				
				<el-form-item label="具体地址">
				    <el-input v-model="form.address"></el-input>
				</el-form-item>
				
				
				
				
			</el-form>
		   
		    <span slot="footer" class="dialog-footer">
				<div class="footer-center">
					<el-button @click="editVisible = false">取 消</el-button>
					<el-button type="primary" @click="saveEdit">提 交</el-button>
				</div>
		    </span>
		</el-dialog>



        <!-- 新增弹出框 -->
        <el-dialog title="新增轮播图" :visible.sync="addVisible" width="30%">
			<el-form ref="form" :model="form" label-width="80px">
			    <el-form-item label="描述">
			        <el-input v-model="form.description"></el-input>
			    </el-form-item>
				
			    <el-form-item label="跳转地址">
			        <el-input v-model="form.url"></el-input>
			    </el-form-item>
				
				<el-form-item label="轮播图">
					<el-upload
					  class="upload-demo"
					  ref="upload"
					  list-type="picture-card"
					  accept = "image/*"
					  :headers = "$root.headers"
					  :with-credentials = "withCredentials"
					  :action="addUrl"
					  :data = "addData"
					  :limit = "limit"
					  :name = "fileName"
					  :file-list="fileList"
					  :on-error="editFailure"
					  :on-success="editSuccess"
					  :on-exceed = "onExceed"
					  :auto-upload="false">
					  <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
					</el-upload>
				</el-form-item>
			</el-form>
            <span slot="footer" class="dialog-footer">
				<div class="footer-center">
					<el-button @click="addVisible = false">取 消</el-button>
					<el-button type="primary" @click="addSubmit">提 交</el-button>
				</div>
            </span>
        </el-dialog>

        <!-- TODO删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">确定要{{onlinTypes[needToChangeOnlineStatusDuomiPlace.unuse]}}该投放点吗？</div>
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
				
				url : 'cabinet/listDuomiPlace',
				editUrl : 'slideShow/updateSlideShow',
				delUrl : 'cabinet/updateDuomiPlace',
				addUrl : 'slideShow/addSlideShow',
				banners : [],
				duomiPlaces : [],
				fileName : 'img',
				fileList:[],
				limit : 1,
				withCredentials : true,
				
				addVisible:false,
				editVisible: false,
				delVisible: false,
				onlinTypes : ['下架','上架'],
				
                 form: {//新增或者修改都需要用到
                	choosable : false//默认不可选
                },		
				needToChangeOnlineStatusDuomiPlace:{
					unuse : 0
				},
				
				waitToDel:{}//等待被删除的对象

            }
        },
        created() {
			//初始化轮播图数据
			this.getDuimiPlaceList();
           // this.getRawBannerList();
			//初始化修改轮播图的url地址
			this.editUrl = this.$urlConfig.baseUrl + this.editUrl;
			this.addUrl = this.$urlConfig.baseUrl + this.addUrl;
        },
        computed: {
            data() {
				var vue = this;
                return vue.duomiPlaces.map((duomiPlace,index) => {
                   return {
					   index : index + 1,
					   id : duomiPlace.id,
					   shortName: duomiPlace.shortName,
					   porderCabinetCount: duomiPlace.porderCabinetCount,
					   cabinetCount: duomiPlace.cabinetCount,
					   combosPerCabinet: duomiPlace.combosPerCabinet,
					    online: vue.onlinTypes[duomiPlace.unuse],
					   address: duomiPlace.address
				   };
                })
            },
			editData : function(){
				var vue = this;
				return {
					id : vue.form.id,
					description : vue.form.description,
					url : vue.form.url
				}
			},
			addData : function(){
				var vue = this;
				return {
					description : vue.form.description,
					url : vue.form.url
				}
			}
        },
        methods: {
            getDuimiPlaceList() {
				var vue = this;
				vue.$jsonAxios.get(vue.url).then(function(response){
					//这里只能说明返回的状态码是以2开头的.
					vue.$util.getSuccessHandler(response,vue,"duomiPlaces");
				}).catch(function(err){
					vue.$util.axiosErrorHandler(err,vue);
				})
                
            },

			handleAdd(){
				var vue = this;
				//清空fileList
				vue.fileList = [];
				//清空form
				vue.form = {};
				vue.addVisible = true;
			},

            handleEdit(index, row) {
				vue.idx = index;
                const duomiPlace = vue.data[index];
                vue.form = {
                  id : duomiPlace.id,
                  shortName: duomiPlace.shortName,
                  porderCabinetCount: duomiPlace.porderCabinetCount,
                  cabinetCount: duomiPlace.cabinetCount,
                  combosPerCabinet: duomiPlace.combosPerCabinet,
                  address: duomiPlace.address
				   //TODO 设置foods index
                }
                vue.editVisible = true;
				vue.$nextTick(function(){//注意需要在visible为true之后调用 emmmmm
					vue.$refs.editform.clearValidate();
				})
            },
			
			
			updateOnlineStatus(index, row) {
				var online = this.onlinTypes.indexOf(row.online);//修改前状态
				online =  online == -1? 0 : online;//如果indexOf返回-1 就让状态变为0 即 上架
				
				online = Math.abs((online-1));//更改后的状态 即0变1,1变0
			    this.needToChangeOnlineStatusDuomiPlace.idx = index;
				this.needToChangeOnlineStatusDuomiPlace.id = row.id;
				this.needToChangeOnlineStatusDuomiPlace.unuse = online;
			    this.delVisible = true;
			},
			
            handleDelete(index, row) {
                this.waitToDel.idx = index;
				this.waitToDel.id = row.id;
                this.delVisible = true;
            },
				
				
			//新增请求
			addSubmit(){
				this.$refs.upload.submit();
			},
					
            // 提交修改请求
            saveEdit() {
				//这里直接调用UI-Element的函数.不需要手动调用axios发送请求
				//附加的数据也会一并发送过去
				var vue = this;
				if(vue.fileList.length == 1)//说明有图片上传
					vue.$refs.upload.submit();
				else{//没有照片上传,手动使用axios发送其他数据
					var data = vue.$qs.stringify(vue.editData);
					console.log(data);
					vue.$jsonAxios.post(vue.editUrl,data).then(function(response){
						var responseData = response.data;
						if(responseData.code == vue.$util.success_code){
							vue.$message.success("成功！");
						}							
						else{
							vue.$message.error("错误码：" + responseData.code + " " + responseData.message);
						}
							
						//刷新列表
						//vue.getRawBannerList();
						//隐藏编辑框
						this.delVisible = false;
					}).catch(function(error){
						
					})
				}
            },
            // 确定删除
           deleteRow(){
           	var vue = this;
           	//使用axios删除
           	vue.$jsonAxios.post(vue.delUrl,vue.$qs.stringify(vue.needToChangeOnlineStatusDuomiPlace)).then(function(response){
           		
           		var data = response.data;
				console.log("1111="+data.code);
           		if(data.code == vue.$util.success_code){
           			vue.$message.success("删除成功");	
           		}
           		else{
           			vue.$message.error("错误码：" + data.code + " " + data.message);
           		}
				vue.getDuimiPlaceList();
           		vue.delVisible = false;
				
           	}).catch(function(error){
           		vue.$util.axiosErrorHandler(error);
           	})
           },
        
		
		
			editSuccess : function(response, file, fileList){
				var vue = this;
				if(vue.$util.checkIfResponseSuccess(response)){
					vue.$message.success(`成功!`);
					//刷新列表
					vue.getRawBannerList();
					//隐藏编辑框
					vue.editVisible = false;
					vue.addVisible = false;
				}else{
					vue.editFailure();
				}
				
			},
			
			editFailure: function(response, file, fileList){
				this.$message.error(`失败!`);
			},
			
			onExceed : function(){
				this.$message.error(`最多上传一张,请先删除左边的轮播图`);
			},
			
			gotoPlaceInfo : function(placeInfo){
				console.log(placeInfo);
				this.$router.push({ path: '/placeinfo', query: { placeId: placeInfo.id }});
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
