import Vue from 'vue'
import Router from 'vue-router'
import Head from '@/components/Head'
import Index from '@/pages/index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },{
      path: '/topicList',
      name: 'topicList',
      component(resolve) {
        require.ensure(['@/pages/topicList'], () => {
            resolve(require('@/pages/topicList'));
        });
      }
    },{
      path: '/topics/:id',
      name: 'topics',
      component(resolve) {
        require.ensure(['@/pages/topics'], () => {
            resolve(require('@/pages/topics'));
        });
      }
    },{
      path: '/userinfo/:loginname',
      name: 'userinfo',
      component(resolve) {
        require.ensure(['@/pages/userinfo'], () => {
            resolve(require('@/pages/userinfo'));
        });
      }
    },{
      path: '/login',
      name: 'login',
      component(resolve) {
        require.ensure(['@/pages/login'], () => {
            resolve(require('@/pages/login'));
        });
      }
    },{
      path: '/message',
      name: 'message',
      component(resolve) {
        require.ensure(['@/pages/message'], () => {
            resolve(require('@/pages/message'));
        });
      }
    },{
      path: '/collections',
      name: 'collections',
      component(resolve) {
        require.ensure(['@/pages/collections'], () => {
            resolve(require('@/pages/collections'));
        });
      }
    },{
      path: '/addTopic',
      name: 'addTopic',
      component(resolve) {
        require.ensure(['@/pages/addTopic'], () => {
            resolve(require('@/pages/addTopic'));
        });
      }
    },{
      path: '/editTopic/:id',
      name: 'editTopic',
      component(resolve) {
        require.ensure(['@/pages/editTopic'], () => {
            resolve(require('@/pages/editTopic'));
        });
      }
    },{
      path: '/aboutMe',
      name: 'aboutMe',
      component(resolve) {
        require.ensure(['@/pages/aboutMe'], () => {
            resolve(require('@/pages/aboutMe'));
        });
      }
    }
  ]
})
