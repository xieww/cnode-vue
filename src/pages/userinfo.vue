<template>
	<div class="userinfom">
		<Heads :page-type="loginname" class="head-title"></Heads>	
  		<div style="background:white;height:35px;"></div><br>
  		<div v-if="success">
	    	<div class="gridlist-demo-container">
			  	<mu-grid-list class="gridlist-demo" :cols="1" :cellHeight="200" :padding="0">
				    <mu-grid-tile titlePosition="bottom" actionPosition="left" :cols="1" :rows="1">
				      <img :src="userinfos.avatar_url"/>
				      <span slot="title" style="float:left;">创建于:{{changeTime(userinfos.create_at)}}</span>
				      <span slot="subTitle" style="float:left;">积分:<b>{{userinfos.score}}</b></span>
				      <mu-icon-button icon="star_border" slot="action"/>
				    </mu-grid-tile>
			  	</mu-grid-list>
			</div>
			<mu-tabs :value="activeTab" @change="handleTabChange" :lineClass="line">
				<mu-tab value="tab1" title="最近回复"/>
				<mu-tab value="tab2" title="最新发布"/>
			</mu-tabs>
			<div v-if="activeTab === 'tab1'" style="text-align:left;">
	            <mu-list v-if="userinfos.recent_replies.length>0" v-for="item in userinfos.recent_replies" :key="item.id">
				    <mu-list-item :title="item.title" :describeText="item.author.loginname" :to="{name:'topics',params:{id:item.id}}">
				      	<mu-avatar :src="item.author.avatar_url" slot="leftAvatar"/>
				      	<div class="span-time">{{changeTime(item.last_reply_at)}}</div>
				    </mu-list-item>
				   	<mu-divider/>
				</mu-list>
				<div class="noData" v-if="repliesLength==0">暂无数据</div>
			</div>
			<div v-if="activeTab === 'tab2'" style="text-align:left;">
				<mu-list v-if="userinfos.recent_topics.length>0" v-for="item in userinfos.recent_topics" :key="item.id">
				    <mu-list-item :title="item.title" :describeText="item.author.loginname" :to="{name:'topics',params:{id:item.id}}">
				      	<mu-avatar :src="item.author.avatar_url" slot="leftAvatar"/>
				      	<div class="span-time">{{changeTime(item.last_reply_at)}}</div>
				    </mu-list-item>
				   	<mu-divider/>
				</mu-list>
				<div class="noData" v-if="topicsLength==0">暂无数据</div>
			</div>
  		</div>
  		<loads v-if="!success"></loads>
  		<backTop></backTop>
	</div>
</template>

<script>
import Heads  from '../components/Head.vue';
import Loads  from '../components/loadings.vue'
import BackTop  from '../components/backTop.vue';

export default{
	components:{
	    Heads,Loads,BackTop
	},
    data() {
	    return {
			loginname:"",
			success:false,
			userinfos:{},
	      	activeTab: 'tab1',
	      	line:'lineClass',
	      	repliesLength:-1,
	      	topicsLength:-1
	    };
	},
	mounted () {
		this.loginname=this.$route.params.loginname;
		this.getUserInfo();
    },
	methods: {
		getUserInfo() {
	        this.$http.get('https://cnodejs.org/api/v1/user/'+this.loginname)
	        .then(res => {
	          this.userinfos=res.data.data;
	          this.repliesLength=res.data.data.recent_replies.length;
	          this.topicsLength=res.data.data.recent_topics.length;
	          this.success=true;
	        })
	        .catch(err => {
	          //console.log(err);
	        });
	    },
	    handleTabChange (val) {
	      	this.activeTab = val
	    }
  }
}	
</script>

<style scoped>
.userinfos{

}
.head-title{
  width: 100%;
  margin:0px auto 0px auto;
  position:fixed;/*固定作用*/
  top:0px;
  /*ie6下样式，加下划线表示只针对ie6 的hack */
  _position:absolute;/* 把导航栏位置定义为绝对位置  关键*/
  _top:expression(documentElement.scrollTop + "px"); /* 把导航栏位置放在浏览器垂直滚动条的顶端  关键 */
  z-index:9999; /* 让导航栏浮在网页的高层位置，遇到flash和图片时候也能始终保持最外层 */
/*   text-align:left; */
}
.gridlist-demo-container{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.gridlist-demo{
	width: 100%;
	background:url(../assets/bg2.jpg) 0 40%;
	background-size: cover;
}	
.mu-grid-tile>img{
	width: 80px;
    border-radius: 50%;
    height: 40%;
    margin-top: 20px;
    border:2px solid #fff;
    display: inline-block;
    float:left;
}
.span-time{
	text-align: right;
	margin-top: -20px;
	color: #76ff03;
}
.noData{
	text-align: center;
	line-height: 55px;
	color: #ef5350;
}
</style>