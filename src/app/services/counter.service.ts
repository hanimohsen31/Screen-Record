import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CounterService {
  constructor(private HttpClient: HttpClient) {}

  counter = 0;

  getCounter() {
    let url =
      'https://screen-recorder-500-default-rtdb.firebaseio.com/screenRecorder.json';
    return this.HttpClient.get(url);
  }

  updateCounter() {
    let url =
      'https://screen-recorder-500-default-rtdb.firebaseio.com/screenRecorder.json';
    return this.HttpClient.put(url, { counter: +this.counter + 1 });
  }

  handleCounter() {
    this.getCounter().subscribe({
      next: (res: any) => (
        (this.counter = res?.counter || 0),
        this.updateCounter().subscribe({
          next: (res: any) => console.log('You Are Visitor No:', res?.counter),
          error: (err: any) => console.log('errror in updating counter'),
        })
      ),
      error: (err: any) => console.log('errror in getting counter'),
    });
  }
}
