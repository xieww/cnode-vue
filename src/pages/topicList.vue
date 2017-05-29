<template>
	<div class="topicList demo-infinite-container">
    <Heads :page-type="getTitleStr(searchKey.tab)" class="head-title"></Heads>
    <div class="demo-refresh-container">
    <mu-refresh-control :refreshing="refreshing" :trigger="trigger" @refresh="refresh"/>
    <div style="background:white;height:45px;"></div><br>
      <mu-list v-for="item in topics" :key="item.id" class="listpage">
        <mu-list-item :to="{name:'topics',params:{id:item.id}}" class="list-item" >
        <div style="margin-top:-0px;">
          <h3 v-text="item.title" class="title" :title="getTabInfo(item.tab,item.good,item.top,true)"></h3>
          <div class="contents">
            <mu-avatar :src="item.author.avatar_url"/>
            <div class="info">
                <p>
                    <span class="name">
                        &nbsp;&nbsp;{{item.author.loginname}}
                    </span>
                    <span class="status" v-if="item.reply_count > 0">
                        <b style="color: #42b983;">{{item.reply_count}}</b>
                        /{{item.visit_count}}
                    </span>
                </p>
                <p><br>
                    <span style="float:left;">&nbsp;&nbsp;{{changeTime(item.create_at)}}</span>
                    <span style="float:right;">{{changeTime(item.last_reply_at)}}</span>
                </p>
            </div>
          </div>
        </div>
        </mu-list-item>
        <mu-divider/>
      </mu-list>
      <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="loadMore"/>      
    </div>
    <loads v-if="!success"></loads>
    <!-- <div id="backtotop" style="display: block; top: 250px; right: 0px;"><a href="javascript:scroll(0,0)" >回到顶部</a></div> -->
<!-- <backTop></backTop> -->
  </div>
</template>

<script>
import $ from 'n-zepto';
import Heads  from '../components/Head.vue';
import {getTabInfo}  from '../libs/utils.js';
import Loads  from '../components/loadings.vue';
import BackTop  from '../components/backTop.vue';

export default{   
    data() {
        return {
            scroll: true,
            topics: [],
            index: {},
            searchKey: {
                page: 1,
                limit: 20,
                tab: 'all',
                mdrender: true
            },
            searchDataStr: '',
            success:false,
            loading: false,
            scroller: null,
            refreshing: false,
            trigger: null
     }       
    },
    components:{
        Heads,Loads,BackTop
    },
    mounted() {
      this.scroller = this.$el;
      this.trigger = this.$el;
      if (this.$route.query && this.$route.query.tab) {
          this.searchKey.tab = this.$route.query.tab;
      }
      //this.getTopics();
      // 如果从详情返回并且之前存有对应的查询条件和参数
      // 则直接渲染之前的数据
      if (window.window.sessionStorage.searchKey && window.window.sessionStorage.tab === this.searchKey.tab) {
          this.topics = JSON.parse(window.window.sessionStorage.topics);
          this.searchKey = JSON.parse(window.window.sessionStorage.searchKey);
          this.success=true;
          this.$nextTick(() => {
            $('.demo-infinite-container').scrollTop(window.window.sessionStorage.scrollTop);
          });
      } else {
          this.getTopics();
      }
    },
    beforeRouteLeave(to, from, next) {
      // set sessionStorage before enter router for later use
      if (to.name === 'topic') {
          window.window.sessionStorage.scrollTop = $('.demo-infinite-container').scrollTop();
          window.window.sessionStorage.topics = JSON.stringify(this.topics);
          window.window.sessionStorage.searchKey = JSON.stringify(this.searchKey);
          window.window.sessionStorage.tab = from.query.tab || 'all';
      }
      $(window).off('scroll');
      next();
    },
    beforeRouteEnter(to, from, next) {
      if (from.name !== 'topic') {
          // delete data before enter router
          if (window.window.sessionStorage.tab) {
              window.window.sessionStorage.removeItem('topics');
              window.window.sessionStorage.removeItem('searchKey');
              window.window.sessionStorage.removeItem('tab');
          }
      }
      next();
  },
    created(){
      

    },
    methods:{
      // 获取title文字
      getTitleStr(tab) {
          let str = '';
          switch (tab) {
              case 'share':
                  str = '分享';
                  break;
              case 'ask':
                  str = '问答';
                  break;
              case 'job':
                  str = '招聘';
                  break;
              case 'good':
                  str = '精华';
                  break;
              default:
                  str = '全部';
                  break;
          }
          return str;
      },
      // 获取不同tab的样式或者标题
      getTabInfo(tab, good, top, isClass) {
          return getTabInfo(tab, good, top, isClass);
      },
      getTopics(){
        //let params = this.searchKey;
        let params = $.param(this.searchKey);
        this.$http.get('https://cnodejs.org/api/v1/topics?'+params)
        .then(res => {
          this.topics=res.data.data;
          this.success=true;
        })
        .catch(err => {
          //console.log(err);
        });
      },
      loadMore () {
        this.loading = true
        setTimeout(() => {
            this.searchKey.limit += 20;
            this.getTopics();
            this.loading = false;
        }, 1500)
      },
      refresh () {
        this.refreshing = true;
        setTimeout(() => {
          this.getTopics();
          this.refreshing = false;
        }, 1500)
      }
    },
    watch: {
        // 切换页面
        '$route' (to, from) {
            this.success=false;
            this.searchKey.tab = to.query.tab;
            this.searchKey.limit = 20;
            this.getTopics();
        }
    },
}
</script>

<style scoped>
.demo-infinite-container{
  width: 100%;
  overflow: auto;
  height: 100vh;
  /*-webkit-overflow-scrolling: touch;*/
}
.demo-refresh-container{
  position: relative;
  user-select: none;
  overflow: auto;
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
.listpage{
  margin: -40px 0px 0px 0px;
}
.list-item{

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
    margin-right: 5px;
    margin-top: -3px;
    margin-bottom: 86px;
    padding: 6px 12px;
    color: #fff;
    font-size: 10px;
    font-weight: 400;
    border-radius: 4px;
    background-color: #e7e7e7;
    text-align: center;
    vertical-align: middle;
}

[title='top']:before{
  background: #ff5252;
  content: '置顶';
}
[title='ask']:before{
  background: #795548;
  content: '问答';
}
[title='share']:before{
  background: #00bcd4;
  content: '分享';
}
[title='job']:before{
  background: #ff9e80;
  content: '招聘';
}
[title='good']:before{
  background: #00e676;
  content: '精华';
}
[title='default']:before{
  display: none;
}
.contents{
  padding-top: 5px;
  display: flex;
  margin-bottom: -23px;
}
.info {
  display: block;
  flex: 1;
  margin-top: -10px; 
  margin-bottom:10px;
}
.name{
 display: block;
 flex: 1;
 float:left;
 text-align:left;
}
.status{
  float:right;
  text-align:right;
  display: block;
}
time{
/*    display: block; */
/*    flex: 1; */
}
#backtotop {
    background-color: #f5f5f5;
    border: 1px solid #ccc;
    border-right: 0;
}

#backtotop {
    width: 24px;
    color: gray;
    padding: 12px 0 12px 5px;
    display: none;
    position: fixed;
    cursor: pointer;
    text-align: center;
    z-index: 20;
    background-color: #fff;
    border-radius: 12px 0 0 12px;
}
</style>