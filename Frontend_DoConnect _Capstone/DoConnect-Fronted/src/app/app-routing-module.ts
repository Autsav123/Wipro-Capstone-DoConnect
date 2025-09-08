import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login.component/login.component';
import { RegisterComponent } from './components/register.component/register.component';
import { QuestionListComponent } from './components/question-list.component/question-list.component';
import { QuestionFormComponent } from './components/question-form.component/question-form.component';
import { AdminDashboardComponent } from './components/admin-dashboard.component/admin-dashboard.component';
import { UserManagement } from './components/user-management/user-management';
import { AdminGuard } from './guards/admin-guard';
import { ProfileComponent } from './components/profile.component/profile.component';
import { SearchQuestionComponent } from './components/search-question.component/search-question.component';
const routes: Routes = [
  {path:'questions',component:QuestionListComponent},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'ask', component: QuestionFormComponent },
  {path:'question-form',component:QuestionFormComponent},
  { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [AdminGuard] },
  { path: 'user-management', component: UserManagement, canActivate: [AdminGuard] },
  { path: 'search', component: SearchQuestionComponent },
   { path: '', redirectTo: '/login', pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
