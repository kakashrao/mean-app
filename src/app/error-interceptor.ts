import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { catchError, Observable, throwError } from "rxjs";
import { ErrorComponent } from "./posts/error/error.component";

@Injectable()
export class ErrorIntercepter implements HttpInterceptor {

  constructor(private dialog: MatDialog) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(
      catchError((error : HttpErrorResponse) => {
        console.log(error);
        let errorMessage = "An unknow error occured!!"

        if(error.error.message) {
          errorMessage = error.error.message;
        }

        this.dialog.open(ErrorComponent, {
          data: {message: errorMessage}
        });
        return throwError(error);
      })
    )
  }
}
