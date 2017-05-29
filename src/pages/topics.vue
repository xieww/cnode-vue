<template>
<div>
	<Heads page-type="主题详情" class="head-title"></Heads>	
  <div style="background:white;height:35px;" id="top"></div><br>
	<div class="topicpage" v-if="topic.title">
	    <!-- <span class="title" :title="getTabInfo(topic.tab,topic.good,topic.top,true)"></span> -->
		<h2 class="topic-title" v-text="topic.title">
		</h2>
		<div class="topic-info">
			<mu-avatar :src="topic.author.avatar_url"/>
            <div class="col">
                <span>&nbsp;作者:{{topic.author.loginname}}</span>
                <time><br>
                    发布于:{{changeTime(topic.create_at)}}
                </time>
                <mu-icon-button v-show="userInfo.loginname === topic.author.loginname" tooltip="修改" icon="mode_edit" class="eidt-icon" :to="{name:'editTopic',params:{id:topic.id}}"/>  
            </div>
            <div class="right">
                <span class="name">{{topic.visit_count}}次浏览</span><br>
                <span class="topic-collect" v-show="userInfo.userId">
                <mu-checkbox :label="collected ? '取消收藏' : '收藏'" v-model="collected" class="demo-checkbox" uncheckIcon="favorite_border" checkedIcon="favorite" @change="collect"/>	
                </span>
            </div>
		</div>
		<div class='markdown-body topic-content' v-html="topic.content"></div>
        <h3 class="topic-reply">
        	<strong style="color: #42b983;">{{topic.reply_count}}</strong> 回复
        </h3>
        <div class="reply-list">
	      <mu-list v-for="(item,index) in topic.replies" :key="item.id" >
	      	<mu-list-item class="list-item" >
	      	<div class="listtopic">
	            <router-link :to="{name:'userinfo',params:{loginname:item.author.loginname}}" >
	                <mu-avatar :src="item.author.avatar_url"/>
	            </router-link>
	            <div class="user-info">
		            <span class="cl">
		                <span v-text="item.author.loginname"></span>
		                <span>
		                    <!-- <span></span> -->
		                    {{index+1}}楼·发布于:{{changeTime(item.create_at)}}
                        <span v-show="topic.author.loginname===item.author.loginname" class="authors">
                          作者
                        </span>
                    </span>
		            </span>
		            <span class="cr">
		                <span class="right" @click="upTopic(item)" :class="{'uped':isUped(item.ups)}">
		                   <mu-icon slot="left" value="thumb_up"/>
		                </span>
		                {{item.ups.length}}
    				        <span class="right" @click="replyTopic(item)">
    		                   <mu-icon slot="left" value="reply"/>
    		            </span>
		            </span>
	            </div>
	      	</div>
 			    <div class="reply_content" v-html="item.content"></div>
	      	</mu-list-item>
          <div class="topic-item" v-if="isok" v-show="userInfo.userId && replyIds === item.id">
            <mu-text-field  hintText="回复内容" v-model="replyContent" multiLine :rows="6" :rowsMax="6" :maxLength="500" fullWidth />
            <mu-raised-button label="确认" class="submit-button" @click="submitTopic"  primary/>
            <mu-raised-button label="取消" class="cancel-button" @click="cancel"  backgroundColor="#a4c639"/>
          </div>
	      	<mu-divider/>
	  	  </mu-list>
        </div>
        <div class="topic-item"  v-show="userInfo.userId">
          <mu-text-field  hintText="回复内容" v-model="replyContentAll" multiLine :rows="6" :rowsMax="6" :maxLength="500" fullWidth />
          <mu-raised-button label="确认" class="submit-button" @click="submitTopic"  primary/>
          <mu-raised-button label="取消" class="cancel-button" @click="cancel"  backgroundColor="#a4c639"/>
        </div>
        <backTop></backTop>        
	</div>
  <loads v-if="!success"></loads>
  
</div>
</template>

<script>
import "../assets/css/github-markdown.css";
import $ from 'n-zepto';
import Heads  from '../components/Head.vue';
import BackTop  from '../components/backTop.vue';
import {mapGetters} from 'vuex';
import {getTabInfo}  from '../libs/utils.js';
import Loads  from '../components/loadings.vue';
export  default{
	components:{
	    Heads,
      Loads,
      BackTop
	},
    data() {
	    return {
	        topic: {}, // 主题
	        noData: false,
	        topicId: '',
	        curReplyId: '',
	        collected:false,
          authorTxt: `---from [xieww](https://github.com/xieww)`,
          replyIds: '',
          replyContent:'',
          replyContentAll:'',
          isok:false,
          content: '',
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
      this.$http.get('https://cnodejs.org/api/v1/topic/'+this.topicId)
      .then(res => {
        this.topic=res.data.data;
        this.success=true;
      })
      .catch(err => {
        //console.log(err);
      });

      //获取收藏信息
      let loginname=this.userInfo.loginname;
      if(loginname){
        this.$http.get('https://cnodejs.org/api/v1/topic_collect/'+loginname)
        .then(res => {
          let arr=[]
          for(let i=0;i<res.data.data.length;i++){
            arr.push(res.data.data[i].id)
          }
          if($.inArray(this.topicId, arr)>-1){
            this.collected=true
          }
        })
        .catch(err => {
          //console.log(err);
        });
      }
	},
	methods:{
      // 获取不同tab的样式或者标题
      getTabInfo(tab, good, top, isClass) {
          return getTabInfo(tab, good, top, isClass);
      },
      //收藏功能
      collect(){
        //收藏
        if (!this.collected) {
        this.$http.post(`https://cnodejs.org/api/v1/topic_collect/collect`, {
            accesstoken :this.userInfo.token,
            topic_id :this.topicId
        }).then(res => {
          if (res.data.success) {
            this.collected = true;
          }
        })
      } else {
        //取消收藏
        this.$http.post(`https://cnodejs.org/api/v1/topic_collect/de_collect`, {
            accesstoken :this.userInfo.token,
            topic_id :this.topicId
        }).then(res => {
          if (res.data.success) {
            this.collected = false;
          }
        })
      }
    },
      //回复功能
     replyTopic(item){
        if (!this.userInfo.userId) {
          this.$router.push({
            name: 'login',
            params: {
              redirect: encodeURIComponent(this.$route.path)
            }
          });
        } else {
          this.replyIds=item.id;
          this.replyContent=`@${item.author.loginname} `;
          this.isok=true;
        }
      },
      submitTopic(){
        let token = this.userInfo.token;
        let replyMess={
          accesstoken: token
        }
        let htmlText = this.authorTxt; 
        if(this.replyIds){

          replyMess.reply_id = this.replyIds;
          replyMess.content=this.replyContent+`     `+htmlText;
        }else{
          replyMess.content=this.replyContentAll+`     `+htmlText;
        }
        this.$http.post('https://cnodejs.org/api/v1/topic/'+ this.topicId +'/replies',replyMess)
            .then(res => {
              if (res.data.success) {
                  this.topic.replies.push({
                      id: res.reply_id,
                      author: {
                          loginname: this.userInfo.loginname,
                          avatar_url: this.userInfo.avatar_url
                      },
                      content : replyMess.content,
                      ups: []
                  });
              }
              this.replyMess = '';
              this.isok=false;
            })
            .catch(err => {
              //console.log('操作失败',err);
            })
      }, 
      //点赞功能     
      upTopic(item){
        if (!this.userInfo.userId) {
          this.$router.push({
            name: 'login',
            params: {
              redirect: encodeURIComponent(this.$route.path)
            }
          });
        } else {
        let token = this.userInfo.token;
        this.$http.post('https://cnodejs.org/api/v1/reply/'+ item.id +'/ups', {accesstoken:token})
            .then(res => {
              if (res.data.action === 'down') {
                let index = $.inArray(this.userInfo.userId, item.ups);
                item.ups.splice(index, 1);
              }else{
                item.ups.push(this.userInfo.userId);
              }
            })
            .catch(err => {
              //console.log('操作失败',err);
            })
        }
      },
      isUped(ups){
        return $.inArray(this.userInfo.userId, ups) >= 0;
      },
      cancel(){
        this.isok=false;
      },
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
.topic-title {
    padding: 5px;
    margin: 15px;
    font-size: 18px;
    color: #2c3e50;
    line-height: 1.5;
    background-color: #f0f0f0;
    border-radius: 5px;
    text-align: left;
}
.title{
  margin-bottom: 0px;
  white-space: pre;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 24px;
  font-weight: 900;
  text-align: left;
  margin-left: -4px;
}
.title:before{
    content: attr(title);
    margin-right: 10px;
    margin-top: -3px;
    padding: 4px 6px;
    color: #fff;
    font-size: 10px;
    font-weight: 400;
    border-radius: 4px;
    background-color: #e7e7e7;
    text-align: center;
    vertical-align: middle;
}

[title='top']:before{
  background: #E74C3C;
  content: '置顶';
}
[title='ask']:before{
  background: #159951;
  content: '问答';
}
[title='share']:before{
  background: #03A9F4;
  content: '分享';
}
[title='job']:before{
  background: #C898DE;
  content: '招聘';
}
[title='good']:before{
  background: #EFBD05;
  content: '精华';
}
[title='default']:before{
  display: none;
}
.topic-info {
	display: flex;
	align-items: center;
	padding: 0 15px;
	color: #34495e;
	font-size: 12px;
}
.col {
    display: block;
    flex: 1;
    text-align:left;
    margin-left: 5px;
}
.topic-content {
    padding: 15px;
    margin-top: 15px;
    background: #fff;
    border-bottom: 1px solid #d4d4d4;
    text-align: left;
}
.topic-reply {
    padding: 15px;
    margin-top: 5px;
    border-bottom: 1px solid #d4d4d4;
    text-align: left;
}
.topic-collect{
	text-align: right;
}
.listtopic {
    margin: -15px 0px 5px -5px;
    /* padding: 0 10px; */
    display: flex;
}
.user-info {
    overflow: hidden;
    display: block;
    /* width: 100%; */
    flex: 1;
    margin-bottom: -200px;
}
.cl { 
	  margin: 6px 0px 0px 5px;
    display: inline-block;
    float: left;
}
.cr {
    float: right;
    display: inline-block;
    text-align: right;
}
.uped{
  color: #03A9F4;
}
.reply_content {
    margin: -5px 0px -8px 0px;
    text-align: left;
    padding: 0px;
    overflow: auto;
    font-size: 10px;
    line-height: 1.45;
    background-color: #f6f8fa;
    border-radius: 3px;
}	
.topic-item{
margin:1px 15px 3px 15px;
}
.submit-button {
  margin: 0px 10px 3px auto;
  width: 40%;
}
.cancel-button {
  margin: 0px auto 3px 10px;
  width: 40%;
}
.authors{
    color: #fff;
    background-color: #6ba44e;
    padding: 2px;
    font-size: 12px;
}
.eidt-icon{
  margin-top: -25px;
}
</style>