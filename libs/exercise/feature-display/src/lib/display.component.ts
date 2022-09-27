import { Component, OnInit } from '@angular/core';
import { DisplayFacade } from '@fitness-tracker/exercise/domain';

@Component({
  selector: 'exercise-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss'],
})
export class DisplayComponent implements OnInit {
  exerciseList$ = this.displayFacade.exerciseList$;

  constructor(private displayFacade: DisplayFacade) {}

  ngOnInit() {
    this.load();
  }

  load(): void {
    this.displayFacade.load();
  }
}
