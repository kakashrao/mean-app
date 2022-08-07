import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent implements OnInit, OnDestroy {
  constructor(private postsService: PostsService, private authService: AuthService) {}

  // posts = [
  //   { title: 'First post', content: "This is the first post's content" },
  //   { title: 'Second post', content: "This is the second post's content" },
  //   { title: 'Third post', content: "This is the third post's content" },
  // ];
  userId : string = '';
  posts: Post[] = [];
  private postsSub: Subscription = new Subscription();
  private authStatusSub: Subscription = new Subscription();
  userIsAuthenticated : boolean = false;

  totalPosts = 0;
  currentPage = 1;
  postsPerPage = 5;
  pageSizeOptions = [5, 10, 15, 20];
  isLoading: boolean = false;

  ngOnInit(): void {
    this.isLoading = true;
    this.getAllPosts();
    this.userId = this.authService.getUserId();
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((postsData : {posts: Post[], postCount: number}) => {
        this.isLoading = false;
        this.posts = postsData.posts;
        this.totalPosts = postsData.postCount;
      });

    this.userIsAuthenticated = this.authService.getIsAuthenticate();
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe((isAuthenticated) => {
      this.userId = this.authService.getUserId();
      this.userIsAuthenticated = isAuthenticated;
    })
  }

  getAllPosts() {
    this.postsService.getPosts(this.currentPage ,this.postsPerPage);
  }

  onPostDelete(postId: string | undefined | null) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe((response) => {
      this.getAllPosts();
    }, error => {
      this.isLoading = false;
    })
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }

  onChangePage(pageData: PageEvent) {
    // console.log(pageData);
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.getAllPosts();
  }

}
