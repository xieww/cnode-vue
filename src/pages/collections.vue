<template>
	<div class="collections">
		<Heads page-type="我的收藏" class="head-title"></Heads>	
  		<div style="background:white;height:35px;"></div><br>
  		<div class="collect-list">
			<mu-list v-if="collectLength>0" v-for="item in collection" :key="item.id">
			    <mu-list-item :title="item.title" :describeText="item.author.loginname" :to="{name:'topics',params:{id:item.id}}">
			      	<mu-avatar :src="item.author.avatar_url" slot="leftAvatar"/>
			      	<div class="span-time">{{changeTime(item.last_reply_at)}}</div>
			    </mu-list-item>
			   	<mu-divider/>
			</mu-list>
			<div class="noData" v-if="collectLength==0">暂无</div>
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
			collection:{},
			collectLength:-1
	    };
	},
    computed: {
	    ...mapGetters({
	        userInfo: 'getUserInfo'
	    })
    },
	mounted () {
		let loginname=this.userInfo.loginname;
        this.$http.get('https://cnodejs.org/api/v1/topic_collect/'+loginname)
        .then(res => {
          this.collection=res.data.data;
          this.collectLength=res.data.data.length
          this.success=true;
        })
        .catch(err => {
          //console.log(err);
        });
    },
	methods: {

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
.collect-list{
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
</style>