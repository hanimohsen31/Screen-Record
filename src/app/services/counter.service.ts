import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { catchError, concatMap, map, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CounterService {
  constructor(private HttpClient: HttpClient) {}
  baseUrl =
    'https://screen-recorder-500-default-rtdb.firebaseio.com/screenRecorder.json';

  getCounter() {
    return this.HttpClient.get(this.baseUrl);
  }

  updateCounter(counter: number) {
    counter = +counter + 1;
    return this.HttpClient.put(this.baseUrl, { counter });
  }

  handleCounter$ = this.getCounter().pipe(
    concatMap((counter: any) =>
      counter ? this.updateCounter(counter?.counter) : this.updateCounter(0)
    ),
    catchError((error) => {
      throw new Error('Update Counter Error', error);
    }),
    tap((counter : any) => console.log(`You Are Visitor No: ${counter?.counter || 0}`))
  );
}
