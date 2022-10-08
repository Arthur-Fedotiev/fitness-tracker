import { Pipe, PipeTransform, NgModule } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

export class TranslateServiceStub {
  public get(key: any): any {
    return of(key);
  }
}

@Pipe({ name: 'translate' })
export class TranslatePipeStub implements PipeTransform {
  public transform(key: any): any {
    return key;
  }
}

@NgModule({
  declarations: [TranslatePipeStub],
  providers: [{ provide: TranslateService, useClass: TranslateServiceStub }],
  exports: [TranslatePipeStub],
})
export class TranslateTestingModule {}
