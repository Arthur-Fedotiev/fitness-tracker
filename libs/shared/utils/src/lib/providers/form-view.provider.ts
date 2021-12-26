import { Provider, Optional } from '@angular/core';
import { ControlContainer, NgForm, NgModelGroup } from '@angular/forms';

export const formViewProvider: Provider = {
  provide: ControlContainer,
  useFactory: _formViewProviderFactory,
  deps: [
    [new Optional(), NgForm],
    [new Optional(), NgModelGroup],
  ],
};

export function _formViewProviderFactory(
  ngForm: NgForm,
  ngModelGroup: NgModelGroup,
) {
  return ngModelGroup || ngForm || null;
}
