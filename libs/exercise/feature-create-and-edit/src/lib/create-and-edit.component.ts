import { Component, OnInit } from '@angular/core';
import { CreateAndEditFacade } from '@fitness-tracker/exercise/domain';

@Component({
  selector: 'exercise-create-and-edit',
  templateUrl: './create-and-edit.component.html',
  styleUrls: ['./create-and-edit.component.scss'],
})
export class CreateAndEditComponent implements OnInit {
  exerciseList$ = this.createAndEditFacade.exerciseList$;

  constructor(private createAndEditFacade: CreateAndEditFacade) {}

  ngOnInit() {
    this.load();
  }

  load(): void {
    this.createAndEditFacade.load();
  }
}
