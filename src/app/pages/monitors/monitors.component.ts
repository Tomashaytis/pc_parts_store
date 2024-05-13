import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { filter, map } from 'rxjs';
import { DataService } from '../../сore/services/data.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

export class Monitor {
    public name: string = "";
    public diagonal: string = "";
    public matrix: string = "";
    public frequency: string = "";
    public resolution: string = "";
    constructor(name: string, diagonal: string, matrix: string, frequency: string, resolution: string) {
      this.name = name;
      this.diagonal = diagonal;
      this.matrix = matrix;
      this.frequency = frequency;
      this.resolution = resolution;
    }
}

@Component({
  selector: 'app-monitors',
  templateUrl: './monitors.component.html',
  styleUrl: './monitors.component.css'
})
export class MonitorsComponent implements AfterViewInit, OnInit {
  monitors: Monitor[] = [];
  updatingId: number = -1;

  constructor (private elementRef: ElementRef, private dataService: DataService<Monitor> ) {}

  form: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    diagonal: new FormControl('', Validators.required),
    matrix: new FormControl('', Validators.required),
    frequency: new FormControl('', Validators.required),
    resolution: new FormControl('', Validators.required)
  });

  ngAfterViewInit() {
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#F5FEFD';
  }

  clearForm(): void {
    this.updatingId = -1;
    this.form.setValue({
      "name": '',
      "diagonal": '',
      "matrix": '',
      "frequency": '',
      "resolution": ''
    });
  }

  updateMonitor(id: number): void {
    console.log(`Monitor ${this.monitors[id].name} has been updated.`);
    this.updatingId = id;
    this.form.setValue({
      "name": this.monitors[id].name,
      "diagonal": this.monitors[id].diagonal,
      "matrix": this.monitors[id].matrix,
      "frequency": this.monitors[id].frequency,
      "resolution": this.monitors[id].resolution
    });
    this.dataService.saveProduct('monitors', this.monitors);
  }

  deleteMonitor(id: number): void {
    console.log(`Monitor ${this.monitors[id].name} has been deleted.`);
    this.monitors.splice(id, 1);
    this.dataService.saveProduct('monitors', this.monitors);
  }

  ngOnInit(): void {
    this.dataService.getProduct('assets/monitors.json', 'monitors')
    .pipe(
      filter(data => data != null),
      map((data => (data.map(monitor => ({...monitor})))))
    )
    .subscribe((monitors) => {
        this.monitors = monitors;
        let exists = localStorage.getItem('monitors');
        if (exists == null) {
          let dataString: string = JSON.stringify(this.monitors);
          localStorage.setItem('monitors', dataString);
        }
    });
  }

  onSubmit(): void {
    const value = this.form.value;
    if (this.updatingId == -1)
      this.monitors.push(new Monitor(value.name, value.diagonal, value.matrix, value.frequency, value.resolution));
    else
      this.monitors[this.updatingId] = new Monitor(value.name, value.diagonal, value.matrix, value.frequency, value.resolution);
    this.clearForm();
    this.dataService.saveProduct('monitors', this.monitors);
  }

  onNameChange(): void {
    console.log(`Monitor ${this.monitors[-1].name} has been added.`);
  }
}
