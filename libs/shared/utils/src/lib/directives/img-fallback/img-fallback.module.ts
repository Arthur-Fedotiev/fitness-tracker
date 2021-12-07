import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImgFallbackDirective } from './img-fallback.directive';



@NgModule({
  declarations: [
    ImgFallbackDirective
  ],
  exports: [
    ImgFallbackDirective
  ]
})
export class ImgFallbackModule { }
