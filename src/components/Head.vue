<template>
  <div class="hello">
    <mu-appbar>
      <mu-icon-button icon="menu" slot="left" @click="toggle()" /> 
      <span v-text="pageType"></span>
      <mu-icon-button v-if="!userInfo.loginname" :to="{'name':'login'}" slot="right">
          <img style="width:20px;height:20px;" src="https://assets-cdn.github.com/favicon.ico" alt="">
      </mu-icon-button>
    </mu-appbar>
    <mu-drawer :open="open" :docked="docked" @close="toggle()" width="145px" :page-type="pageType">
    <mu-menu @click.native="open = false" >
      <mu-menu-item v-if="!userInfo.loginname" title="登录" leftIcon="account_circle" :to="{'name':'login'}"/>
      <div v-if="userInfo.loginname">
        <mu-list>
        <mu-list-item :title="userInfo.loginname" leftIconColor="black" :to="{'name':'userinfo',params: { loginname: userInfo.loginname }}" @click.native="open = false">
        <div style="float:left;margin:-30px 7px 0px -5px;">
          <mu-avatar :src="userInfo.avatar_url" slot="leftAvatar"/>
        </div>    
        </mu-list-item> 
        </mu-list>
        <mu-menu-item title="收藏" leftIcon="favorite" style="margin-top:-28px;" leftIconColor="red" :to="{'name':'collections'}" @click.native="open = false"/>
        <mu-menu-item title="消息" leftIcon="notifications" leftIconColor="black" :to="{'name':'message'}" @click.native="open = false">
           <mu-badge :content="news" circle secondary slot="after" style="padding-right:14px;"/>
        </mu-menu-item>
        <mu-menu-item title="发帖" leftIcon="add_circle" leftIconColor="black" :to="{'name':'addTopic'}" @click.native="open = false"/>
        <mu-menu-item title="退出" leftIcon="exit_to_app" leftIconColor="black" @click="quitLogin"/>
      </div>
      
      <mu-divider />
      <mu-menu-item title="全部" leftIcon="reorder" leftIconColor="black" :to="{'name':'topicList',query:{tab:'all'}}"/>
      <mu-menu-item title="精华" leftIcon="thumb_up" leftIconColor="black" :to="{'name':'topicList',query:{tab:'good'}}" />
      <mu-menu-item title="分享" leftIcon="share" leftIconColor="black" :to="{'name':'topicList',query:{tab:'share'}}" />
      <mu-menu-item title="问答" leftIcon="question_answer" leftIconColor="black" :to="{'name':'topicList',query:{tab:'ask'}}"/>
      <mu-menu-item title="招聘" leftIcon="work" leftIconColor="black" :to="{'name':'topicList',query:{tab:'job'}}"/>
      <mu-divider />
      <mu-menu-item title="关于" leftIcon="info" leftIconColor="black" :to="{'name':'aboutMe'}"/>
      <mu-menu-item v-if="docked" @click.native="open = false" />
    </mu-menu>
    </mu-drawer>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
  name: 'hello',
  replace: true,
  props: {
    pageType: String,
  },
  data () {
    return {
      open: false,
      docked: true,
      news:'0'
    }
  },
  computed: {
      ...mapGetters({
          userInfo: 'getUserInfo'
      })
  },
  created(){
    let token = this.userInfo.token;
    //第一种
    //this.$http.get('https://cnodejs.org/api/v1/messages?accesstoken='+token)
    //第二种
    if(token){
      this.$http.get('https://cnodejs.org/api/v1/message/count?accesstoken='+token)
      .then(res => {
        let message = res.data.data;       
        this.news = message.toString();

        //第一种方法
        //console.log(res.data.data.hasnot_read_messages.length);
        //this.topics=res.data.data;
      })
      .catch(err => {
        console.log(err);
      });
    }
},
  methods: {
    toggle (flag) {
      this.open = !this.open;
      this.docked = !flag;
    },
    quitLogin(){
      this.docked = false;
      window.window.sessionStorage.removeItem("user");
      setTimeout(() => { 
        history.go(0);
      }, 200)
  }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
