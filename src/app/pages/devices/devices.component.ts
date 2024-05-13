import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { filter, map } from 'rxjs';
import { DataService } from '../../сore/services/data.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

export class Device {
  public name: string = "";
  public deviceType: string = "";
  public connectionType: string = "";
  public weight: number = 0;
  public size: string = "";
  constructor (name: string, devicType: string, connectionType: string, weight: number, size: string) {
    this.name = name;
    this.deviceType = devicType;
    this.connectionType = connectionType;
    this.weight = weight;
    this.size = size;
  }
}

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrl: './devices.component.css'
})
export class DevicesComponent implements AfterViewInit, OnInit {
  devices: Device[] = [];
  updatingId: number = -1;

  constructor (private elementRef: ElementRef, private dataService: DataService<Device> ) {}

  form: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    deviceType: new FormControl('', Validators.required),
    connectionType: new FormControl('', Validators.required),
    weight: new FormControl('', Validators.required),
    size: new FormControl('', Validators.required)
  });

  clearForm(): void {
    this.updatingId = -1;
    this.form.setValue({
      "name": '',
      "deviceType": '',
      "connectionType": '',
      "weight": '',
      "size": ''
    });
  }

  updateDevice(id: number): void {
    console.log(`Device ${this.devices[id].name} has been updated.`);
    this.updatingId = id;
    this.form.setValue({
      "name": this.devices[id].name,
      "deviceType": this.devices[id].deviceType,
      "connectionType": this.devices[id].connectionType,
      "weight": this.devices[id].weight,
      "size": this.devices[id].size
    });
    this.dataService.saveProduct('devices', this.devices);
  }

  deleteDevice(id: number): void {
    console.log(`Device ${this.devices[id].name} has been deleted.`);
    this.devices.splice(id, 1);
    this.dataService.saveProduct('devices', this.devices);
  }

  ngAfterViewInit() {
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#F5FEFD';
  }

  ngOnInit(): void {
    this.dataService.getProduct('assets/devices.json', 'devices')
    .pipe(
      filter(data => data != null),
      map((data => (data.map(device => ({...device})))))
    )
    .subscribe((devices) => {
        this.devices = devices;
        let exists = localStorage.getItem('devices');
        if (exists == null) {
          let dataString: string = JSON.stringify(this.devices);
          localStorage.setItem('devices', dataString);
        }
    });
  }

  onSubmit(): void {
    const value = this.form.value;
    if (this.updatingId == -1)
      this.devices.push(new Device(value.name, value.deviceType, value.connectionType, value.weight, value.size));
    else
      this.devices[this.updatingId] = new Device(value.name, value.deviceType, value.connectionType, value.weight, value.size);
    this.clearForm();
    this.dataService.saveProduct('devices', this.devices);
  }

  onNameChange(): void {
    console.log(`Device ${this.devices[-1].name} has been addded.`);
  }
}
