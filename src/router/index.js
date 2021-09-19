import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

let Chat = () => import('views/Chat/Chat.vue')
let Logon = () => import('views/Logon/Logon.vue')
let Contacts = () => import('views/Contacts/Contacts.vue')

const routes = [
  {
    path: '',
    redirect: '/logon'
  },
  {
    path: '/chat',
    name: 'Chat',
    component: Chat
  },
  {
    path: '/chat/:id',
    name: 'ChatId',
    component: Chat
  },
  {
    path: '/logon',
    name: 'Logon',
    component: Logon
  },
  {
    path: '/contacts',
    name: 'Contacts',
    component: Contacts
  },
  {
    path: '/contacts/:id',
    name: 'ContactsId',
    component: Contacts
  }
]


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
