
import config from './config.js';

const success_code = 200;


function axiosErrorHandler(error,vue){
	
	if (error.response) 
		vue.$message.error(error.response.status);
    else if (error.request)
		vue.$message.error(error.request);
    else
      vue.$message('Error', error.message);
    vue.$message(error.config);
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
		if(response.code == success_code)
			return true;
		else
			return false;
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
			if((params[key]!='' && !!params[key]) || params[key] === 0) // !!''这货竟然返回true,你敢信?
				destParams[key] = params[key];
		}
	}
	console.log(destParams);
}



export default{
	axiosErrorHandler,
	getSuccessHandler,
	getFullAttachmentUrl,
	signleDeleteSuccessHandler,
	assembleNewParamsWithNoUndefinedNullProperty,
	checkIfDataSuccess,
	success_code
}