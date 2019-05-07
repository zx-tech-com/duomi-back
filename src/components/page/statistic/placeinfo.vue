<template>
	<div v-loading="$root.showLoadingIcon">
		<el-row v-for="(row,rowIndex) in rows" :key="rowIndex">
			<el-col :span="span" v-for="(col, colIndex) in cols" :key="colIndex">
				<el-card>
					<span>A1</span>
					<!-- <span>ZUBNU0000811904241445004</span> -->
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	
	export default{
		
		data : function(){
			
			return {
				rows : 6,
				cols : 6
			}
			
		},
		
		computed: {
			span : function(){
				return (24/this.rows);
			},
			
		},
		
		methods : {
			
		}
		
	}
	
	
</script>

<style>
</style>
