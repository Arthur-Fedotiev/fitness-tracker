import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search.component';
import {
  NgAisInstantSearchModule,
  NgAisSearchBoxModule,
  NgAisConfigureModule,
  NgAisHighlightModule,
  NgAisInfiniteHitsModule,
} from 'angular-instantsearch';
import { MaterialModule } from '@fitness-tracker/shared-ui-material';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [SearchComponent],
  imports: [
    CommonModule,
    NgAisInstantSearchModule,
    MaterialModule,
    NgAisSearchBoxModule,
    FlexLayoutModule,
    NgAisConfigureModule,
    NgAisHighlightModule,
    NgAisInfiniteHitsModule,
  ],
  exports: [SearchComponent],
})
export class SearchModule {}
