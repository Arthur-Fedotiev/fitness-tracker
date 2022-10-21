import { E2eDirective } from './e2e.directive';

describe('E2eDirective', () => {
  it('should create an instance', () => {
    const directive = new E2eDirective('test');
    expect(directive.cy).toEqual('test');
  });
});
