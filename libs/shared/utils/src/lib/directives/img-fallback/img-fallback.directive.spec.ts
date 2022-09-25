import { ImgFallbackDirective } from './img-fallback.directive';

describe('ImgFallbackDirective', () => {
  it('should create an instance', () => {
    const directive = new ImgFallbackDirective(
      { setAttribute: jest.fn() } as any,
      { nativeElement: {} },
    );
    expect(directive).toBeTruthy();
  });
});
