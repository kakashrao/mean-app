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

  isLoading: boolean = false;

  ngOnInit(): void {
    this.isLoading = true;
    this.getAllPosts();
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((posts) => {
        this.isLoading = false;
        this.posts = posts;
      });
  }

  getAllPosts() {
    this.postsService.getPosts();
  }

  onPostDelete(postId: string | undefined | null) {
    this.postsService.deletePost(postId);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
