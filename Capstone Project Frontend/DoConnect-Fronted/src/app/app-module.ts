import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing-module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {App} from './app';
import { LoginComponent } from './components/login.component/login.component';
import { RegisterComponent } from './components/register.component/register.component';
import { QuestionListComponent } from './components/question-list.component/question-list.component';
import { AnswerListComponent } from './components/answer-list.component/answer-list.component';
import { AnswerFormComponent } from './components/answer-form.component/answer-form.component';
import { QuestionFormComponent } from './components/question-form.component/question-form.component';
import { AdminDashboardComponent } from './components/admin-dashboard.component/admin-dashboard.component';

import { ProfileComponent } from './components/profile.component/profile.component';
import { UserManagement } from './components/user-management/user-management';
import { SearchQuestionComponent } from './components/search-question.component/search-question.component';


@NgModule({
  declarations: [
    App,
    LoginComponent,
    RegisterComponent,
    QuestionListComponent,
    AnswerListComponent,
    AnswerFormComponent,
    QuestionFormComponent,
    AdminDashboardComponent,
    
      ProfileComponent,
            UserManagement,
            SearchQuestionComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
