import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { filter, map } from 'rxjs';
import { DataService } from '../../сore/services/data.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

export class VideoCard {
  public name: string = "";
  public graphicProcessor: string = "";
  public frequency: number = 0;
  public vram: number = 0;
  public outputs: string = "";
  constructor (name: string, graphicProcessor: string, frequency: number, vram: number, outputs: string) {
    this.name = name;
    this.graphicProcessor = graphicProcessor;
    this.frequency = frequency;
    this.vram = vram;
    this.outputs = outputs;
  }
}

@Component({
  selector: 'app-video-cards',
  templateUrl: './video-cards.component.html',
  styleUrl: './video-cards.component.css'
})
export class VideoCardsComponent implements AfterViewInit, OnInit {
  videoCards: VideoCard[] = [];
  updatingId: number = -1;

  constructor (private elementRef: ElementRef, private dataService: DataService<VideoCard> ) {}

  form: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    graphicProcessor: new FormControl('', Validators.required),
    frequency: new FormControl(0, Validators.required),
    vram: new FormControl(0, Validators.required),
    outputs: new FormControl('', Validators.required)
  });

  clearForm(): void {
    this.updatingId = -1;
    this.form.setValue({
      "name": '',
      "graphicProcessor": '',
      "frequency": '',
      "vram": '',
      "outputs": ''
    });
  }

  updateVideoCard(id: number): void {
    console.log(`Video card ${this.videoCards[id].name} has been updated.`);
    this.updatingId = id;
    this.form.setValue({
      "name": this.videoCards[id].name,
      "graphicProcessor": this.videoCards[id].graphicProcessor,
      "frequency": this.videoCards[id].frequency,
      "vram": this.videoCards[id].vram,
      "outputs": this.videoCards[id].outputs
    });
    this.dataService.saveProduct('videoCards', this.videoCards);
  }

  deleteVideoCard(id: number): void {
    console.log(`Video card ${this.videoCards[id].name} has been deleted.`);
    this.videoCards.splice(id, 1);
    this.dataService.saveProduct('videoCards', this.videoCards);
  }

  ngAfterViewInit() {
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#F5FEFD';
  }

  ngOnInit(): void {
    this.dataService.getProduct('assets/videoCards.json', 'videoCards')
    .pipe(
      filter(data => data != null),
      map((data => (data.map(videoCard => ({...videoCard})))))
    )
    .subscribe((videoCards) => {
        this.videoCards = videoCards;
        let exists = localStorage.getItem('videoCards');
        if (exists == null) {
          let dataString: string = JSON.stringify(this.videoCards);
          localStorage.setItem('videoCards', dataString);
        }
    });
  }

  onSubmit(): void {
    const value = this.form.value;
    if (this.updatingId == -1)
      this.videoCards.push(new VideoCard(value.name, value.graphicProcessor, value.frequency, value.vram, value.outputs));
    else
      this.videoCards[this.updatingId] = new VideoCard(value.name, value.graphicProcessor, value.frequency, value.vram, value.outputs);
    this.clearForm();
    this.dataService.saveProduct('videoCards', this.videoCards);
  }

  onNameChange(): void {
    console.log(`Video card ${this.videoCards[-1].name} has been added.`);
  }
}