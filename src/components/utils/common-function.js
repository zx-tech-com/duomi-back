
import config from './config.js';
import datetimeUtil from './datetime-utils.js';

const success_code = 200;
const maxPageSize = 10000;//自定义的最大数目
const maxDistance = 9999;//最大距离


function axiosErrorHandler(error,vue){
	
	try{
		if (error.response) 
			vue.$message.error(error.response.status);
		else if (error.request)
			vue.$message.error(error.request);
		else
		  vue.$message('Error', error.message);
		vue.$message.error(error.message);
	}catch(e){
		vue.$message.error(e);
	}finally{
		vue.$root.showLoadingIcon = false;
	}
}

function getSuccessHandler(response,vue,property){
	console.log(response.data);
	try{
		var data = response.data;
		if(data.code == success_code){
			vue[property] = data.data;
		}
		else{
			vue.$message.error("错误码：" + data.code + " " + data.message);
		}
	}catch(e){
		console.log(e);
	}
}

function signleDeleteSuccessHandler(response,vue,property,index){
	console.log(response.data);
	try{
		var data = response.data;
		if(data.code == success_code){
			vue[property].splice(index, 1);
			vue.$message.success("删除成功");
		}
		else{
			vue.$message.error("错误码：" + data.code + " " + data.message);
		}
	}catch(e){
		console.log(e);
	}
}


function getFullAttachmentUrl(subUrl){
	return config.attachmentBaseUrl + subUrl;
}

function checkIfDataSuccess(response){
	try{
		return response.code == success_code;
	}catch(e){
		return false;
	}
}

/**
 * 不进行递归遍历,非object对象不予理睬
 */
function assembleNewParamsWithNoUndefinedNullProperty(destParams,params){
	if(typeof params == 'object'){
		for(var key in params){
			if((params[key]!='' && !!params[key]) || params[key] === 0) // !!''结果为true
				destParams[key] = params[key];
		}
	}
}

/**
 * 递归遍历
 */
/* function assembleNewParamsWithNoUndefinedNullPropertyRecurse(destParams,params){
	if(typeof params == 'object'){//对象
		for(var key in params){
			assembleNewParamsWithNoUndefinedNullPropertyRecurse();
		}
	}
} */




export default{
	axiosErrorHandler,
	getSuccessHandler,
	getFullAttachmentUrl,
	signleDeleteSuccessHandler,
	assembleNewParamsWithNoUndefinedNullProperty,
	checkIfDataSuccess,
	success_code,
	maxPageSize,
	maxDistance,
	getYMDHmString:datetimeUtil.getYMDHmString
}