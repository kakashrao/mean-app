import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private posts: Post[] = [];
  private postUpdated = new Subject<{ posts: Post[], postCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(page: number, pageSize: number) {
    this.http
      .get<{ message: string; posts: Post[]; maxPosts: number }>(
        environment.baseUrl + `/posts?page=${page}&pageSize=${pageSize}`
      )
      .pipe(
        map((postData) => {
          return  {
            posts : postData.posts.map((post: any) => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator
              };
            }),
            maxPosts: postData.maxPosts
          }
      })
      )
      .subscribe((transformedPostsData: any) => {
        this.posts = transformedPostsData.posts;
        this.postUpdated.next(
          {
            posts: [...this.posts],
            postCount: transformedPostsData.maxPosts
          })
      });
  }

  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }

  getPost(id: string | undefined | null) {
    return this.http.get(environment.baseUrl + '/posts/' + id);
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    postData.append("creator", '');

    this.http
      .post<{ message: string; post: Post }>(
        environment.baseUrl + '/posts',
        postData
      )
      .subscribe((res) => {
        this.router.navigate(['/']);
      });
  }

  updatePost(id: string | undefined | null, title: string, content: string, image: File | string) {

    let postData : Post | FormData;

    if(typeof(image) === 'object') {
      postData = new FormData();
      postData.append('id', id || new Blob());
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: ''
      }
    }

    this.http
      .put<{ message: string }>(environment.baseUrl + `/posts/${id}`, postData)
      .subscribe((res) => {
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string | undefined | null) {
    return this.http
      .delete<{ message: string }>(environment.baseUrl + `/posts/${postId}`)
  }
}
