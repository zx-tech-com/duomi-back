<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">后台管理系统</div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="请输入账号">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="passwd">
                    <el-input type="passwd" placeholder="请输入密码" show-password v-model="ruleForm.passwd" @keyup.enter.native="submitForm('ruleForm')">
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        data: function(){
            return {
				loginUrl : 'admin/login',
                ruleForm: {
                    username: '',
                    passwd: ''
                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    passwd: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            submitForm(formName) {
				var vue = this;
                vue.$refs[formName].validate((valid) => {
                    if (valid) {
						vue.login();
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
			login : function(){
				var vue = this;
				vue.$jsonAxios.post(vue.loginUrl,vue.$qs.stringify(vue.ruleForm)).then(function(response){
					var data = response.data;
					if(vue.$util.checkIfDataSuccess(data)){
						localStorage.setItem('ms_username',vue.ruleForm.username);
						vue.$router.push('/dashboard');//进入首页
					}else
						vue.$message.error("错误码：" + data.code + " " + data.message);
				}).catch(function(error){
					vue.$util.axiosErrorHandler(error,vue);
				})
			}
        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
        background-image: url(../../assets/img/login-bg.jpg);
        background-size: 100%;
    }
    .ms-title{
        width:100%;
        line-height: 50px;
        text-align: center;
        font-size:20px;
        color: #fff;
        border-bottom: 1px solid #ddd;
    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:350px;
        margin:-190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255,255,255, 0.3);
        overflow: hidden;
    }
    .ms-content{
        padding: 30px 30px;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
        margin-bottom: 10px;
    }
    .login-tips{
        font-size:12px;
        line-height:30px;
        color:#fff;
    }
</style>