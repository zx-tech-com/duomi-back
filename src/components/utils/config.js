const protocol = "http";
// const ip = '39.98.204.123';
// const port = '8080';
// const ip = 'localhost';
const ip = '192.168.1.177';
const port = '9090';
const context = "duomi"

const baseUrl = protocol + "://" + ip + ":" + port + "/" + context + "/";

const attachmentContext = 'duomi-file';

const attachmentBaseUrl = protocol + "://" + ip + ":" + port + "/" + attachmentContext + "/";


export default{
	baseUrl,
	attachmentBaseUrl
}