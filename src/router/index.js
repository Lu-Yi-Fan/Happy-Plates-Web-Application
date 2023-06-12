import { createRouter, createWebHistory } from 'vue-router';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import LandingPage from '@/views/LandingPage.vue'

import SignUpPage from '@/views/SignUpPage.vue'
import QuestionnairePage from '@/views/QuestionnairePage.vue'

import LoginPage from '@/views/LoginPage.vue'
import HomePage from '@/views/HomePage.vue'
import DashboardPage from '@/views/DashboardPage.vue'
import FoodLogPage from '@/views/FoodLogPage.vue'
import ExerciseLogPage from '@/views/ExerciseLogPage.vue'
import ProfilePage from '@/views/ProfilePage.vue'
import AddFoodPage from '@/views/AddFoodPage.vue'
import AddExerPage from '@/views/AddExerPage.vue'
import CalendarPage from '@/views/CalendarPage.vue'
import QuickAddCustom from '@/views/QuickAddCustom.vue'
import EditFoodPage from '@/views/EditFoodPage.vue'
import EditCustomFoodPage from '@/views/EditCustomFoodPage.vue'
import EditProfilePage from '@/views/EditProfilePage.vue'
import EditExerPage from '@/views/EditExerPage.vue'
import NotFound from '@/components/NotFound.vue'
import { nextTick } from 'vue';


const routes = [
  {
    path: '/',
    name: 'LandingPage',
    component: LandingPage,
  },
  {
    path: '/SignUpPage',
    name: 'SignUpPage',
    component: SignUpPage
  },
  {
    path: '/LoginPage',
    name: 'LoginPage',
    component: LoginPage
  },
  {
    path: '/HomePage',
    name: 'HomePage',
    component: HomePage
  },
  {
    path: '/DashboardPage',
    name: 'Dashboard',
    component: DashboardPage
  },
  {
    path: '/CalendarPage',
    name: 'CalendarPage',
    component: CalendarPage
  },
  {
    path: '/FoodLogPage',
    name: 'FoodLog',
    component: FoodLogPage
  },
  {
    path: '/ExerciseLogPage',
    name: 'ExerciseLog',
    component: ExerciseLogPage
  },
  {
    path: '/ProfilePage',
    name: 'ProfilePage',
    component: ProfilePage
  },

  {
    path: '/AddExerPage',
    name: 'AddExerPage',
    component: AddExerPage
  },

  {
    path: '/QuestionnairePage',
    name: 'QuestionnairePage',
    component: QuestionnairePage
  },

  {
    path: '/EditProfilePage',
    name: 'EditProfilePage',
    component: EditProfilePage
  },

  {
    path: '/QuickAddCustom',
    name: 'QuickAddCustom',
    component: QuickAddCustom
  },

  {
    path: '/AddFoodPage',
    name: 'AddFoodPage',
    component: AddFoodPage
  },

  {
    path: '/EditFoodPage',
    name: 'EditFoodPage',
    component: EditFoodPage
  },

  {
    path: '/EditCustomFoodPage',
    name: 'EditCustomFoodPage',
    component: EditCustomFoodPage
  },

  {
    path: '/EditExerPage',
    name: 'EditExerPage',
    component: EditExerPage
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: NotFound,
  }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

        


export default router

