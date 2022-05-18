import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { map, Observable } from 'rxjs';

import { ProcessHTTPMsgService } from './process-httpmsg.service';

import { Leader } from '../shared/leader';
import { baseURL } from '../shared/baseurl';

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor(private http: HttpClient,
    private processHTTPMsg: ProcessHTTPMsgService) { }

  getLeaders(): Observable<Leader[]>{
    return this.http
    .get<Leader[]>(baseURL + 'leadership')
    .pipe(catchError(this.processHTTPMsg.handleError));
  }

  getFeaturedLeader(): Observable<Leader> {
    return this.http
    .get<Leader[]>(baseURL + 'leadership?featured=true')
    .pipe(map((leader) => leader[0]))
    .pipe(catchError(this.processHTTPMsg.handleError));
  }
}
