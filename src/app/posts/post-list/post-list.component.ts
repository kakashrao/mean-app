import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent implements OnInit, OnDestroy {
  constructor(private postsService: PostsService) {}

  // posts = [
  //   { title: 'First post', content: "This is the first post's content" },
  //   { title: 'Second post', content: "This is the second post's content" },
  //   { title: 'Third post', content: "This is the third post's content" },
  // ];
  posts: Post[] = [];
  private postsSub: Subscription = new Subscription();

  ngOnInit(): void {
    this.posts = this.postsService.getPosts();
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((posts) => {
        this.posts = posts;
      });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
