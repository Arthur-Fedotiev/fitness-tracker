import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchModule } from './search/search.module';

@NgModule({
  imports: [CommonModule, SearchModule],
  exports: [SearchModule],
})
export class SharedUiComponentsModule {}
