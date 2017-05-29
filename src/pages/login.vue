<template>
	<div class="logins">
    	<mu-appbar title="登陆"/>
    	<div class="div2">
    		<mu-text-field label="Access Token" v-model="token"  :errorText="inputErrorText" @input="setErrorText" :maxLength="36" labelFloat class="login-field" />
    		<mu-raised-button label="确认" @click="login" :disabled="disabled" fullWidth primary/>
    	</div>
	</div>
</template>

<script>

export default {
	name: 'login',
	data () {
      	return {
      		token:"",
      		inputErrorText:"",
      		disabled:true,
      		success:false
      	}
	},
	methods:{
		login(){
	      this.$http.post('https://cnodejs.org/api/v1/accesstoken', {accesstoken: this.token})
	        .then(res => {
	          if (res.status === 200) {
                let user = {
                    loginname: res.data.loginname,
                    avatar_url: res.data.avatar_url,
                    userId: res.data.id,
                    token: this.token
                };
                window.window.sessionStorage.user = JSON.stringify(user);
                this.$store.dispatch('setUserInfo', user);
                let redirect = decodeURIComponent(this.$route.query.redirect || '/');
                this.$router.push({
                    path: redirect
                });
	          }
	        })
	        .catch(err => {
	          //console.log('验证失败',err);
	        })
		},
	    setErrorText() {
	    	//alert(this.accesstoken.length);
    		if(this.token.length==36){
    			this.inputErrorText="";
    			this.disabled=false;
    		}else{
    			this.inputErrorText="Access Token应为36位的字符串！"
    		}
	    },
	},
}	
</script>

<style scoped>
.div2{
	padding:60px 10px 10px;
}
.login-field{
	width: 90%;
}
</style>