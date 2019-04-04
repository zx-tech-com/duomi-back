

/**
 * 获取到年月日时分信息
 */
function getYMDHmString(datetime){
	if(datetime)
		return datetime.substr(0,16);
	return datetime;
}

export default{
	getYMDHmString
}