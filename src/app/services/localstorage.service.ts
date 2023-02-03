import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalstorageService<T> {
  constructor() {}

  setItem(name: string, item: T) {
    localStorage.setItem(name, JSON.stringify(item));
  }

  getItem(name: string) {
    const data = JSON.parse(localStorage.getItem(name)!);
    return data;
  }
}
