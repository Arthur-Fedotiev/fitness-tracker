import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search.component';
import { NgAisModule } from 'angular-instantsearch';
import { MaterialModule } from '@fitness-tracker/shared-ui-material';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [SearchComponent],
  imports: [CommonModule, NgAisModule, MaterialModule, FlexLayoutModule],
  exports: [SearchComponent],
})
export class SearchModule {}
