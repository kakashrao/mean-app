import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { mimeType } from './mime-type.validator'
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss'],
})
export class PostCreateComponent implements OnInit, OnDestroy {
  constructor(
    private postsService: PostsService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  form: FormGroup = new FormGroup({});
  imagePreview: any;
  mode: string = 'create';
  postId: string | undefined | null;
  post: any;
  isLoading: boolean = false;
  private authStatusSub = new Subscription();

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe((authStatus) => {
      this.isLoading = false;
    })

    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, { validators: [Validators.required], asyncValidators: [mimeType] }),
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      console.log(paramMap);

      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe((postData: any) => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath,
            creator: postData.creator
          };

          // console.log(this.post);
          this.imagePreview = this.post.imagePath;

          this.form?.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath
          });
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  onImagePicked(event: any) {
    const file = event.target?.files[0];
    this.form.patchValue({ image: file });
    this.form.get('image')?.updateValueAndValidity();
    const reader = new FileReader();
    console.log(reader);
    reader.onload = () => {
      this.imagePreview = reader.result;
      console.log('img', this.imagePreview);
    };
    reader.readAsDataURL(file);
    console.log(reader);
  }

  onSavePost() {
    // console.log(form);
    if (this.form?.invalid) {
      return;
    }

    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addPost(
        this.form?.value.title,
        this.form?.value.content,
        this.form.value.image
      );
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form?.value.title,
        this.form?.value.content,
        this.form?.value.image
      );
    }

    this.form?.reset();
  }
}
