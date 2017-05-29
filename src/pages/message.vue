<template>
	<div class="messages">
		<Heads page-type="我的消息" class="head-title"></Heads>	
  		<div style="background:white;height:35px;"></div><br>
  		<div>
			<mu-tabs :value="activeTab" @change="handleTabChange" :lineClass="line">
				<mu-tab value="tab1" title="已读消息"/>
				<mu-tab value="tab2" title="未读消息">
					<!-- <mu-badge circle secondary v-show="this.$store.state.info.notiNum>0" /> -->
				</mu-tab>
			</mu-tabs>
			<div v-if="success" class="message-list">
				<div v-if="activeTab === 'tab1'">
			    	<mu-list v-if="hasRead>0" v-for="item in hasReadMess" key="item.id">
					    <mu-list-item :title="item.topic.title" :describeText="item.author.loginname" :to="{name:'topics',params:{id:item.topic.id}}" style="margin-top:-19px;">
					      	<mu-avatar :src="item.author.avatar_url" slot="leftAvatar"/>
					      	<div class="span-time">{{changeTime(item.create_at)}}</div>
					      	<div v-html="item.reply.content" class="reply-content"></div>
					    </mu-list-item>
					   	<mu-divider/>
					</mu-list>
					<div class="noData" v-if="hasRead==0">暂无数据</div>
				</div>
				<div v-if="activeTab === 'tab2'">
			      	<div class="isReadAll" v-if="hasnotRead>0">
			      	 	<mu-checkbox label="是否标记全部已读" uncheckIcon="visibility_off" checkedIcon="visibility" @change="submitReadAll"/>
			      	</div>
			      	<mu-divider/>
					<mu-list v-if="hasnotRead>0" v-for="item in hasnotReadMess" key="item.id">
					    <mu-list-item :title="item.topic.title" :describeText="item.author.loginname" :to="{name:'topics',params:{id:item.topic.id}}" style="margin-top:-19px;">
					      	<mu-avatar :src="item.author.avatar_url" slot="leftAvatar"/>
					      	 <div class="isRead">
					      	 	<mu-checkbox :label="isReads?'已读':'未读'" v-model="isReads" uncheckIcon="visibility_off" checkedIcon="visibility" @change="submitRead(item.id)"/>
					      	 </div>
					      	<div class="span-time">{{changeTime(item.create_at)}}</div>
					      	<div v-html="item.reply.content" class="reply-content"></div>
					    </mu-list-item>
					   	<mu-divider/>
					</mu-list>
					<div class="noData" v-if="hasnotRead==0">暂无数据</div>
				</div>				
			</div>
  		</div>
  		<loads v-if="!success"></loads>
  		<backTop></backTop>
	</div>
</template>

<script>
import Heads  from '../components/Head.vue';
import {mapGetters} from 'vuex';
import Loads  from '../components/loadings.vue';
import BackTop  from '../components/backTop.vue';

export default{
	components:{
	    Heads,Loads,BackTop
	},
    data() {
	    return {
			success:false,
			hasReadMess:{},
			hasnotReadMess:{},
			hasRead:-1,
			hasnotRead:-1,
	      	activeTab:'tab1',
	      	line:'lineClass',
	      	isReads:false
	    };
	},
    computed: {
	    ...mapGetters({
	        userInfo: 'getUserInfo'
	    })
    },	
    mounted () {
		let token = this.userInfo.token;
        this.$http.get('https://cnodejs.org/api/v1/messages?accesstoken='+token)
        .then(res => {
          this.hasReadMess=res.data.data.has_read_messages;
          this.hasnotReadMess=res.data.data.hasnot_read_messages;
          this.hasRead=res.data.data.has_read_messages.length;
          this.hasnotRead=res.data.data.hasnot_read_messages.length;
          this.success=true;
        })
        .catch(err => {
          //console.log(err);
        });
    },
	methods: {
	    handleTabChange (val) {
	      	this.activeTab = val
	    },
		submitRead(id) {
	        this.$http.post('https://cnodejs.org/api/v1/message/mark_one/'+id,{accesstoken :this.userInfo.token
	        }).then(res => {
	          if (res.data.success) {
	            this.isReads = true;
	            if (this.timer) clearTimeout(this.timer)
              	this.timer = setTimeout(() => { 
                	history.go(0)
              	}, 0)
	          }
	        })
	        .catch(err => {
	          //console.log(err);
	        });
		},
		submitReadAll(){
	        this.$http.post('https://cnodejs.org/api/v1/message/mark_all',{accesstoken :this.userInfo.token
	        }).then(res => {
	          if (res.data.success) {
	            this.isReads = true;
	            if (this.timer) clearTimeout(this.timer)
              	this.timer = setTimeout(() => { 
                	history.go(0)
              	}, 0)
	          }
	        })
	        .catch(err => {
	          //console.log(err);
	        });
		}
  }
}
</script>

<style scoped>
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
.lineClass{
	background: #0091ea;
}
.mu-tabs{
	background: #eee;
	color: #03A9F4;
}
.mu-tab-link{
	color: #212121;
}
.mu-tab-active{
	font-weight: 900;
	color: #03A9F4;
}
.message-list{
	text-align:left;
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
.reply-content{
    margin: 4px 0px -8px -52px;
    text-align: left;
    padding: 0px;
    overflow: auto;
    font-size: 10px;
    line-height: 1.45;
    background-color: #f6f8fa;
    border-radius: 3px;
}
.isRead{
	text-align:right;
	margin-top:-40px;
	margin-bottom:20px;
}
.isReadAll{
	text-align:center;
	margin:3px 0px 0px 0px;
}	
</style>