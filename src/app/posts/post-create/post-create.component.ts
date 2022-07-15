import { Component } from '@angular/core';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss'],
})
export class PostCreateComponent {
  enteredValue: string = "The User's post";
  newPost = '';

  onAddPost() {
    this.newPost = this.enteredValue;
  }
}
