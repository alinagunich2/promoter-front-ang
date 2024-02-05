import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleCartComponent } from './components/article-cart/article-cart.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PopupComponent } from './components/popup/popup.component';
import { RouterModule } from '@angular/router';
import { TypeFilterComponent } from './components/type-filter/type-filter.component';
import { CommentCartComponent } from './components/comment-cart/comment-cart.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';



@NgModule({
  declarations: [
    ArticleCartComponent,
    PopupComponent,
    TypeFilterComponent,
    CommentCartComponent
    
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatProgressSpinnerModule
    
  ],
  exports: [
    ArticleCartComponent,
    PopupComponent,
    TypeFilterComponent,
    CommentCartComponent
  ]
})
export class SharedModule { }
