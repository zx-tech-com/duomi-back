<template>
	<div  v-loading="showLoadingIcon">
		<div class="handle-box">
			<div id="container"></div>
			<div class="form">
				<div class="search">
					<el-input v-model="place" placeholder="请输入地址,eg:合肥 蜀山区 中国电科" class="handle-input"></el-input>
					<el-button type="primary" icon="search" @click="codeAddress">搜索</el-button>
				</div>
				
				<el-form ref="placeForm"  class="real-form" :model="form" label-width="60px">
					<el-form-item label="省:" :rules="rules" prop="province">
						<el-input v-model="form.province"></el-input>
					</el-form-item>
					<el-form-item label="市:" :rules="rules" prop="city">
						<el-input v-model="form.city" ></el-input>
					</el-form-item>
					<el-form-item label="区:" :rules="rules" prop="district">
						<el-input v-model="form.district" ></el-input>
					</el-form-item>
					<el-form-item label="街道:" >
						<el-input v-model="form.street" ></el-input>
					</el-form-item>
					<el-form-item label="全称:" :rules="rules" prop="address">
						<el-input v-model="form.address" ></el-input>
					</el-form-item>
					<el-form-item label="纬度:" >
						<el-input v-model="form.latitude" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="经度:" >
						<el-input v-model="form.longitude" :disabled="true"></el-input>
					</el-form-item>
					
					
				</el-form>
				<div class="footer-center">
					<el-button @click="cancel">取 消</el-button>
					<el-button type="primary" @click="submit">提 交</el-button>
				</div>
			</div>
		</div>
	</div>

</template>
<script>
	import {
		TMap
	} from './tencent-map.js'
	export default {
		name: 'parking-parkText',
		data() {
			return {
				
				showLoadingIcon : false,
				addUrl : 'address/addplace',
				listDomiPlaceUrl : 'cabinet/listDuomiPlace',
				addDistanceUrl : 'address/adddistance',
				
				form: {

				},
				
				newCustomerPlaceId : -1,
				rules : [
					{ required: true, message: '该项必填'}
				],
				
				geocoder: null,
				map: null,
				marker: null,
				place: '',
				coordinate: null,
				spherical : null,//用于计算两点距离
				

			}
		},
		created() {
			this.initMap();
		},
		methods: {
			initMap() {
				var vue = this;
				TMap().then(qq => {
					
					//保存下来spherical用于计算两点间距离
					vue.spherical = qq.maps.geometry.spherical;
					vue.LatLng = qq.maps.LatLng;
					
					vue.map = new qq.maps.Map(document.getElementById('container'), {
						center: new qq.maps.LatLng(31.819084866830963, 117.22738265991211),
						zoom: 13
					})
					//绑定单击事件添加参数
					qq.maps.event.addListener(vue.map, 'click', function(event) {
						vue.coordinate = {
							latitude: event.latLng.getLat(),
							longitude: event.latLng.getLng()
						};
						var coord = new qq.maps.LatLng(vue.coordinate.latitude,vue.coordinate.longitude);
						vue.geocoder.getAddress(coord);
					});

					//调用地址解析类
					vue.geocoder = new qq.maps.Geocoder({
						complete: function(result) {
							
							vue.map.setCenter(result.detail.location);
							var marker = new qq.maps.Marker({
								map: vue.map,
								position: result.detail.location
							});
							vue.resolveResult(result);
						}
					});
					
				})
			},
			codeAddress() {
				this.geocoder.getLocation(this.place);
			},
			resolveResult(result){
				var info = result.detail.addressComponents;
				this.form = {
					province : info.province,
					city : info.city,
					district : info.district,
					address : result.detail.address,
					latitude : result.detail.location.lat,
					longitude : result.detail.location.lng
				};
				console.log(result);
			},
			cancel : function(){
				this.form = {};
				this.$refs.placeForm.clearValidate();
			},
			submit : function(){
				var vue = this;
				vue.$refs.placeForm.validate(function(result,obj){
					if(result === true)
						vue.addCustomerPlace();
				})
			},
			addCustomerPlace : function(){
				var vue = this;
				vue.showLoadingIcon = true;
				vue.$jsonAxios.post(vue.addUrl,vue.$qs.stringify(vue.form)).then(function(response){
					var data = response.data;
					if(vue.$util.checkIfDataSuccess(data)){
						vue.newCustomerPlaceId = data.data;
						vue.$message.success("添加成功！正在自动计算距离,请稍后...");
						vue.calculateDistance();
					}else
						vue.$message.error("错误码：" + data.code + " " + data.message);
				}).catch(function(error){
					vue.showLoadingIcon = false;
				})
			},
			
			/**
			 * 计算新添加的用户地址和之前添加的投放点之间的距离
			 */
			calculateDistance : function(){
				var vue = this;
				//1.获取所有的投放点信息.
				vue.listAllDomiPlace().then(function(data){
					//2.计算距离
					var duomiPlace = data.data;
					var distanceList = [];
					
					
					
					for(var duomiPlaceRecord of duomiPlace)
						distanceList.push(vue.calculateTwoPointDistance(duomiPlaceRecord));
					
					console.log(duomiPlace.length);
					if(duomiPlace.length == 0){
						vue.$message.success("计算距离成功");
						vue.showLoadingIcon = false;
						return;
					};
					
					vue.addDistances(distanceList);

					// JSON.stringify(duomiPlace)=='[]'
				}).catch(function(error){
					vue.$message.error("获取投放点信息失败,无法自动计算距离,请联系开发人员");
					vue.showLoadingIcon = false;
				})
				
			},
			
			addDistances : function(distanceList){
				var vue = this;
				vue.$jaxios.post(vue.addDistanceUrl,JSON.stringify(distanceList)).then(function(response){
					var data = response.data;
					
					
					
					
					if(vue.$util.checkIfDataSuccess(data)){
						vue.$message.success("自动计算距离成功！");
					}else
						vue.$message.error("自动计算距离失败,请联系开发人员");
				}).catch(function(error){
					vue.$message.error("自动计算距离失败,请联系开发人员");
				}).finally(function(){
					vue.showLoadingIcon = false;
				})
			},
			
			calculateTwoPointDistance:function(record){
				var vue = this;
				var pointA = new vue.LatLng(vue.form.latitude,vue.form.longitude);
				var pointB = new vue.LatLng(record.latitude,record.longitude);
				console.log(pointA, pointB);
				var distance =  vue.spherical.computeDistanceBetween(pointA, pointB);
				distance = distance > vue.$util.maxDistance ? vue.$util.maxDistance : distance;
				distance = new Number(distance.toFixed(1));
				return {
					customerPlaceId : vue.newCustomerPlaceId,
					duomiPlaceId : record.id,
					distance : distance
				}
			},
			
			listAllDomiPlace : function(){
				
				var vue = this;
				var promise = new Promise(function(resolve,reject){
					vue.$jsonAxios.get(vue.listDomiPlaceUrl).then(function(response){
						var data = response.data;						
						if(vue.$util.checkIfDataSuccess(data)){
							resolve(data);
						}esle
							reject(data);							
					}).catch(function(error){
						reject(error);
					})
				});
				return promise;
			},
			
		},
	}
</script>

<style scoped>

	.handle-box{
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
	}

	#container {
		min-width: 800px;
		min-height: 780px;
	}
	
	.form{
		height: 100%;
		width: 500px;
		
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	
	.search{
		display: flex;
		flex-direction: row;
		margin-bottom: 20px;
	}
	
	.search,.real-form{
		width: 70% !important;
	}


</style>
