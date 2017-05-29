<template>
	<div class="aboutMe">
		<Heads page-type="关于我" class="head-title"></Heads>	
  		<!-- <div style="background:white;height:35px;"></div><br> -->
  		<div class="about-list">
			<mu-content-block>
			 <h2>关于项目</h2>
			    本项目采用<a target="_blank" href="https://cn.vuejs.org">Vue</a>全家桶以及<a target="_blank" href="http://www.muse-ui.org">muse-ui</a>,并根据Cnode提供的<a target="_blank" href="https://cnodejs.org/api">API</a>进行编写！
			    <mu-divider/> 
			    <h4 style="margin-bottom:-1px;">我的GitHub</h4>
					<mu-icon-button href="https://github.com/xieww" >
			      		<img style="width:20px;height:20px;" src="https://assets-cdn.github.com/favicon.ico" alt="">
			    	</mu-icon-button>如果觉得我做的还不错，请给个star。
			    <mu-divider/>
			    <h4>相关技术</h4>
			    <a target="_blank" href="https://cn.vuejs.org">Vue</a> | vueRouter | axios | vuex<br>
			    <a target="_blank" href="http://www.muse-ui.org">Muse-UI</a><br>
			    <a target="_blank" href="http://momentjs.cn/">momentjs</a>:JavaScript日期处理类库
			    <mu-divider/>
			    <h4>具体功能</h4>
			    <p>登录、退出、浏览主题、新建评论、点赞、收藏主题、新建主题、修改主题、收藏主题、查看已读和未读消息、标记单个或者多个消息为已读、查看个人信息、下拉刷新、加载动画</p>
			    <mu-divider/>
			    <h4>当前版本</h4>
			     V2.0
			    <p class="p1">温馨提示：未登录下只能进行浏览操作，若想体验完整功能请登录操作。</p>
			 </mu-content-block>
  		</div>
  		<backTop></backTop>
  	</div>
</template>

<script>
import Heads  from '../components/Head.vue';
import BackTop  from '../components/backTop.vue';

export default{
	components:{
	    Heads,BackTop
	},
}
</script>
<style scoped>
.about-list{
	text-align: left;
	/* align:left; */
	margin-left: 15px;
}
.p1{
	color: #f50057;
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