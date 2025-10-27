import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomComment } from '../models/comment';
import { LoggerService } from 'src/app/services/logger.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private baseUrl: string = 'http://localhost:5203/comments';

  constructor(private http: HttpClient, private logger: LoggerService) {
    this.logger.logInfo('CommentService initialized');
  }

  getCommentsByProductId(productId: number): Observable<CustomComment[]> {
    this.logger.logInfo('Fetching comments by product id', { productId });
    return this.http.get<CustomComment[]>(`${this.baseUrl}/product/${productId}`);
  }

  getCommentById(id: number): Observable<CustomComment | null> {
    this.logger.logInfo('Fetching comment by id', { id });
    return this.http.get<CustomComment>(`${this.baseUrl}/${id}`);
  }

  addComment(comment: CustomComment): Observable<CustomComment> {
    this.logger.logInfo('Adding comment', comment);
    return this.http.post<CustomComment>(this.baseUrl, comment);
  }

  updateComment(id: number, comment: CustomComment): Observable<CustomComment> {
    this.logger.logInfo('Updating comment', { id, comment });
    return this.http.put<CustomComment>(`${this.baseUrl}/${id}`, comment);
  }

  deleteComment(id: number): Observable<void> {
    this.logger.logInfo('Deleting comment', { id });
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}