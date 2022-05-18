import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { map, Observable } from 'rxjs';

import { ProcessHTTPMsgService } from './process-httpmsg.service';

import { Promotion } from '../shared/promotion';
import { baseURL } from '../shared/baseurl';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  constructor(private http: HttpClient,
    private processHTTPMsg: ProcessHTTPMsgService) { }

  getPromotions(): Observable<Promotion[]> {
    return this.http
    .get<Promotion[]>(baseURL + 'promotions')
    .pipe(catchError(this.processHTTPMsg.handleError));
  }

  getPromotion(id: string): Observable<Promotion> {
    return this.http
    .get<Promotion>(baseURL + 'promotions/' + id)
    .pipe(catchError(this.processHTTPMsg.handleError));
  }

  getFeaturedPromotion(): Observable<Promotion> {
    return this.http
    .get<Promotion[]>(baseURL + 'promotions?featured=true')
    .pipe(map((promotions) => promotions[0]))
    .pipe(catchError(this.processHTTPMsg.handleError));
  }
}
