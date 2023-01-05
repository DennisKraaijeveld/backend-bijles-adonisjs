/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import HealthCheck from '@ioc:Adonis/Core/HealthCheck'

// Users Routes

// Routes which should be accessible without onboarding middleware
Route.group(() => {
  Route.get('/profile', 'UsersController.getProfile').as('profile')

  Route.post('register', 'AuthUsersController.register').as('register')
  Route.post('login', 'AuthUsersController.login').as('login')
  Route.post('logout', 'AuthUsersController.logout').as('logout')

  Route.post('/verify-email', 'VerifyEmailsController.verifyEmail').as('verify.email')

  Route.post('/onboarding/update-profile', 'OnboardingController.updateProfile').as(
    'onboarding_completed'
  )
}).prefix('api/v1/users/')

// Routes which should be accessible only after onboarding middleware
Route.group(() => {
  Route.get('/search-tutors', 'TutorSearchController.nearbyTutors').as('search.tutors')
})
  .prefix('api/v1/users/')
  .middleware('auth')
  .middleware('onboarding')

// Admins Routes
Route.group(() => {
  Route.post('register', 'AuthAdminsController.register').as('register.admin')
  Route.post('login', 'AuthAdminsController.login').as('login.admin')
  Route.post('logout', 'AuthAdminsController.logout').as('logout.admin')
}).prefix('api/v1/admins/')

Route.get('health', async ({ response }) => {
  const report = await HealthCheck.getReport()

  return report.healthy ? response.ok(report) : response.badRequest(report)
})
