import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { filter, map } from 'rxjs';
import { DataService } from '../../сore/services/data.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

export class Processor {
  public name: string = "";
  public socket: string = "";
  public cores: number = 0;
  public frequency: number = 0;
  public turboFrequency: number = 0;
  constructor (name: string, socket: string, cores: number, frequency: number, turboFrequency: number) {
    this.name = name;
    this.socket = socket;
    this.cores = cores;
    this.frequency = frequency;
    this.turboFrequency = turboFrequency;
  }
}

@Component({
  selector: 'app-processors',
  templateUrl: './processors.component.html',
  styleUrl: './processors.component.css'
})
export class ProcessorsComponent implements AfterViewInit, OnInit {
  processors: Processor[] = [];
  updatingId: number = -1;

  constructor (private elementRef: ElementRef, private dataService: DataService<Processor>) {}

  form: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    socket: new FormControl('', Validators.required),
    cores: new FormControl(0, Validators.required),
    frequency: new FormControl(0, Validators.required),
    turboFrequency: new FormControl(0, Validators.required)
  });

  clearForm(): void {
    this.updatingId = -1;
    this.form.setValue({
      "name": '',
      "socket": '',
      "cores": '',
      "frequency": '',
      "turboFrequency": ''
    });
  }

  updateProcessor(id: number): void {
    console.log(`Processor ${this.processors[id].name} has been updated.`);
    this.updatingId = id;
    this.form.setValue({
      "name": this.processors[id].name,
      "socket": this.processors[id].socket,
      "cores": this.processors[id].cores,
      "frequency": this.processors[id].frequency,
      "turboFrequency": this.processors[id].turboFrequency
    });
    this.dataService.saveProduct('processors', this.processors);
  }

  deleteProcessor(id: number): void {
    console.log(`Processor ${this.processors[id].name} has been deleted.`);
    this.processors.splice(id, 1);
    this.dataService.saveProduct('processors', this.processors);
  }

  ngAfterViewInit() {
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#F5FEFD';
  }

  ngOnInit(): void {
    this.dataService.getProduct('assets/processors.json', 'processors')
    .pipe(
      filter(data => data != null),
      map((data => (data.map(processor => ({...processor})))))
    )
    .subscribe((processors) => {
        this.processors = processors;
        let exists = localStorage.getItem('processors');
        if (exists == null) {
          let dataString: string = JSON.stringify(this.processors);
          localStorage.setItem('processors', dataString);
        }
    });
  }

  onSubmit(): void {
    const value = this.form.value;
    if (this.updatingId == -1)
      this.processors.push(new Processor(value.name, value.socket, value.cores, value.frequency, value.turboFrequency));
    else
      this.processors[this.updatingId] = new Processor(value.name, value.socket, value.cores, value.frequency, value.turboFrequency);
    this.clearForm();
    this.dataService.saveProduct('processors', this.processors);
  }

  onNameChange(): void {
    console.log(`Processor ${this.processors[-1].name} has been added.`);
  }
}
