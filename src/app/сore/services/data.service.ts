import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable,  catchError, of } from "rxjs";

@Injectable({providedIn: 'root'})
export class DataService<T> {
    constructor(private http: HttpClient) { }

    getProduct(dataPath: string, dataName: string): Observable<Array<T>> {
        let dataString: string | null = localStorage.getItem(dataName);
        if (dataString == null) {
            console.log('Loading data from file ', dataPath);
            return this.http.get<Array<T>>(dataPath)
                .pipe(
                    catchError(err => {
                        console.log(err);
                        return of([]);
                    })
                );
        }
        else {
            console.log('Loading data from local storage by key', dataName);
            let data: Array<T> = JSON.parse(dataString);
            return new Observable<Array<T>>((observer) => {
                observer.next(data);
                observer.complete();
            });
        }
    }
    
    saveProduct(dataName: string, data: Array<T>): void {
        localStorage.removeItem(dataName);
        let dataString: string = JSON.stringify(data);
        localStorage.setItem(dataName, dataString);
        console.log('Saving data to local storage with key', dataName);
    }
}