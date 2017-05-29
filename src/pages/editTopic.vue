<template>
	<div class="addTopic">
		<Heads page-type="编辑话题" class="head-title"></Heads>	
  		<div style="background:white;height:35px;"></div><br>
  		<div class="add-content">
  			<span class="span1">&nbsp;选择板块：</span>
	    	<mu-select-field v-model="tab"  @input="setErrorText" labelFloat fullWidth class="tab-select">
			    <mu-menu-item value="share" title="分享"/>
			    <mu-menu-item value="ask" title="问答"/>
			    <mu-menu-item value="job" title="招聘"/> 			   
			</mu-select-field>
			<mu-text-field label="标题字数10字以上" v-model="title" :errorText="errorTxt" @input="setErrorText(11)" labelFloat fullWidth/>
			<mu-text-field label="回复支持Markdown语法,请注意标记代码" @input="setErrorText" v-model="topicContent" multiLine :rows="7" :rowsMax="6" :maxLength="500" labelFloat fullWidth/>
			<mu-raised-button label="确认" class="submit-button" @click="submitTopic" :disabled="disabled" primary/>
            <mu-raised-button label="取消" class="cancel-button" @click="cancel"  backgroundColor="#a4c639"/>
  		</div>
  		<loads v-if="!success"></loads>
	</div>
</template>

<script>
import Heads  from '../components/Head.vue';
import {mapGetters} from 'vuex';
import Loads  from '../components/loadings.vue';

export default{
	components:{
	    Heads,Loads
	},
    data() {
	    return {
	      	tab:"",
	      	title:"",
	      	topicContent :"",
	      	errorTxt:"",
	      	disabled:true,
	      	topic:{},
	      	tabs:"",
	      	success:false
	    };
	},
    computed: {
	    ...mapGetters({
	        userInfo: 'getUserInfo'
	    })
    },
    mounted(){
	    // 获取url传的tab参数
	    this.topicId = this.$route.params.id;
	    console.log(this.topicId);
      	this.$http.get('https://cnodejs.org/api/v1/topic/'+this.topicId)
      	.then(res => {
        	this.topic=res.data.data;
        	this.tab=res.data.data.tab;
        	this.title=res.data.data.title;
        	this.topicContent=res.data.data.content;
        	this.success=true;
      	})
      	.catch(err => {
        	//console.log(err);
      	});
	},
    methods:{
	   	setErrorText(title){
	   		if(this.title.length>=10&&this.tab&&this.topicContent){
	   			this.errorTxt="";
	   			this.disabled=false;
	   		}
	   		if(this.title.length<10&&title==11){
	   			this.errorTxt="标题的字数在10字以上！";
	   		}
	   	},
	   	submitTopic(){
		   	let newTopic ={
	        	accesstoken:this.userInfo.token,
	        	topic_id:this.topicId,
	        	title:this.title,
	        	tab:this.tab,
	        	content:this.topicContent
		   	}	
	        this.$http.post('https://cnodejs.org/api/v1/topics/update',newTopic)
	            .then(res => {
	              if (res.data.success) {
		            if (this.timer) clearTimeout(this.timer)
		            this.timer = setTimeout(() => { 
		                this.$router.push({
		                    name: 'topicList'
		                });
		            }, 1000);
	              }
	            })
	            .catch(err => {
	              //console.log('操作失败',err);
	            })
	   	},
      	cancel(){
            if (this.timer) clearTimeout(this.timer)
            this.timer = setTimeout(() => { 
                this.$router.push({
                    name: 'topicList'
                });
            }, 0);
      	}
    }	
}
</script>

<style scoped>
.add-content{
	text-align: left;
	margin: -45px 15px 0px 15px;
	
}
.span1{
    font-size: 15px;
    font-weight: 700;
    font-family: "微软雅黑";
	font-style: 
}
.tab-select{
	width: 140px;
}
.submit-button {
  margin: 0px 10px 3px auto;
  width: 40%;
}
.cancel-button {
  margin: 0px auto 3px 10px;
  width: 40%;
}	
</style>