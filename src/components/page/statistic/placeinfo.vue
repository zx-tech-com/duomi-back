

<template>
	<div v-loading="$root.showLoadingIcon">
		<el-row v-for="(row,rowIndex) in cabinetData" :key="rowIndex">
			<el-col :span="span" v-for="(col, colIndex) in row" :key="colIndex">
				<el-card>
					<div slot="header" >
						<el-col :span="12" class="text-code">{{col.code}}</el-col>
						<img  class="icon" :src="col.iconPath" />
					</div>
					<el-row class="text-combo">
						<div class="text-combo">{{col.cname}}</div>
						<span class="text-combo">{{col.orderNumber}}</span>
					</el-row>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>




<script>
	export default {

		data: function() {

			return {
				rawData : [],
				cols: 8,
				groupOrder : '0',
				personalOrder : '1',
				emptyIcon : require('@/assets/img/empty.png'),
				groupIcon : require('@/assets/img/group.png'),
				personalIcon : require('@/assets/img/personal.png'),
			}

		},
		
		created : function(){
			this.listCabinetInfo();
		},
		computed: {
			span: function() {
				return (24 / this.cols);
			},
			cabinetData : function(){
				var vue = this;
				var tempData = vue.rawData.map(cabinet=>{
					var line = cabinet.line;
					var cname = [];
					var orderNumber = '';
					var path = vue.path;
					if(line == null || line.length == 0){
// 						cname.push('无');
// 						orderNumber = '无';
						path = vue.emptyIcon;
					}else if(cabinet.orderStatus == vue.personalOrder){//个人订单
						line.forEach(l=>{
							if(l.payStatus == '支付成功'){
								var name = l.cname + ' * ';
								name += l.counts;
								cname.push(name);
								path = vue.personalIcon;
							}
						})
					}else if(cabinet.orderStatus == vue.groupOrder){//团购订单
						if(cabinet.groupNumber > 0){
							var name = line[0].cname;
							if(cabinet.fname != null)
								name += "(" + cabinet.fname + ")";
							name += ' * ';
							name += cabinet.groupNumber;
							cname.push(name);
							path = vue.groupIcon;
						}else{
// 							cname.push('无');
// 							orderNumber = '无';
							path = vue.emptyIcon;
						}
					}
					return {
						code : cabinet.code,
						cabinetStatus : cabinet.cabinetStatus,
						orderStatus : cabinet.orderStatus,
						cname : cname.join("; "),
						orderNumber : cabinet.orderNumber?cabinet.orderNumber:orderNumber,
						iconPath : path
					}
				});
				//尝试转换tempData为二维数组.
				var cols = vue.cols;
				var finalData = [];
				var begin = 0 - cols;
				var end = 0;
				while(true){
					begin = begin + cols;
					if(begin >= tempData.length)
						break;
					end = begin + cols;
					if(end > tempData.length)
						end = tempData.length;
					finalData.push(tempData.slice(begin,end))
				}
				return finalData;
			}
		},

		methods: {
			
			listCabinetInfo : function(){
				var placeId = 47;
				var deliveryDate = "2019-05-06";
				var url = "statistic/placeDetail?placeId=" + placeId + "&deliveryDate=" + deliveryDate;
				var vue = this;
				vue.$jsonAxios.get(url).then(function(response){
					var data = response.data;
					if(vue.$util.checkIfDataSuccess(data)){
						if(data.data)
							vue.rawData = data.data;
						else
							vue.rawData = [];
					}else
						vue.$message.error("错误码：" + data.code + " " + data.message);
				}).catch(function(error){
					vue.$util.axiosErrorHandler(error);
				})
			}
			
			
		}

	}
</script>

<style>
	.icon {
		width: 30px;
		height: 30px;
		margin-left: 30px;
	}

	.text-combo {
		margin-bottom: 5px;
		font-family: "PingFang SC";
		font-size: 13px;
	}
	.text-code {
		font-family: "Microsoft YaHei";
		font-size: 20px;
	}
	.el-card__header{
		padding : 5px 20px !important;
	}
	
	.el-card__body {
		padding: 20px 5px !important;
	}
</style>
