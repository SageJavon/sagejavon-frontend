import type { App } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'
import { ChatLayout } from '@/views/chat/layout'

const routes: RouteRecordRaw[] = [
    {
    path: '/',
    name: 'Root',
    component: () => import('@/views/welcome/index.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/chat',
    name: 'Chat',
    component: ChatLayout,
    redirect: '/chat',
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: '/knowledge/skills',
        name: 'knowledgeSkills',
        component: () => import('@/views/knowledge-skills/index.vue'),
      },
      {
        path: '/chat/:uuid?',
        name: 'Chat',
        component: () => import('@/views/chat/index.vue'),
      },
      {
        path: '/person/study',
        name: 'personStudy',
        component: () => import('@/views/person-study/index.vue'),
      },
      {
        path: '/program/list',
        name: 'programList',
        component: () => import('@/views/program-list/index.vue'),
      },
      {
        path: '/program/detail',
        name: 'programDetail',
        component: () => import('@/views/program-detail/index.vue'),
      },
      {
        path: '/choice/exercise',
        name: 'choiceExercise',
        component: () => import('@/views/choice-exercise/index.vue'),
      },
      {
        path: '/program/exercise',
        name: 'programExercise',
        component: () => import('@/views/program-exercise/index.vue'),
      },
      {
        path: '/recommend/exercise',
        name: 'recommendExercise',
        component: () => import('@/views/recommend-exercise/index.vue'),
      },
      {
        path: '/choice/detail',
        name: 'choiceDetail',
        component: () => import('@/views/choice-detail/index.vue'),
      },
      {
        path: '/history',
        name: 'history',
        component: () => import('@/views/history/index.vue'),
      },
    ],
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/exception/404/index.vue'),
  },
  {
    path: '/500',
    name: '500',
    component: () => import('@/views/exception/500/index.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    redirect: '/404',
  },
  {
    path: '/knowledge/graph',
    name: 'knowledgeGraph',
    component: () => import('@/views/knowledge-graph/Edit/index.vue'),
  }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

router.beforeEach((to, from, next) => {
  // 检查路由是否需要身份验证
  if (to.meta.requiresAuth) {
    // 如果需要验证身份，则检查用户是否已登录
    if (isLoggedIn()) {
      // 用户已登录，继续导航
      next()
    }
    else {
      // 用户未登录，重定向到登录页面
      next('/login')
    }
  }
  else {
    // 路由不需要验证身份，继续导航
    next()
  }
})

export async function setupRouter(app: App) {
  app.use(router)
  await router.isReady()
}

// 假设你有一个用于检查用户是否已登录的工具函数
export function isLoggedIn(): boolean {
  return localStorage.getItem('user-token') !== null // 假设你将用户登录的 token 存储在 localStorage 中
}
