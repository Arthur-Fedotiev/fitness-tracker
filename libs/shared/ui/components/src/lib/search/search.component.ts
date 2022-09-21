import { DomPortal, TemplatePortal } from '@angular/cdk/portal';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  TemplateRef,
  ViewChild,
  AfterViewInit,
  ViewContainerRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { NgAisInstantSearch } from 'angular-instantsearch';

@Component({
  selector: 'ft-search',
  templateUrl: './search.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements AfterViewInit {
  @ViewChild('templatePortalContent')
  templatePortalContent!: TemplateRef<unknown>;

  @Input() public searchConfig: NgAisInstantSearch['config'] | null = null;

  @Output() public readonly hitSelected: EventEmitter<unknown> =
    new EventEmitter();

  public portalContent!: TemplatePortal<any>;

  constructor(private vcr: ViewContainerRef) {}

  public ngAfterViewInit() {
    this.portalContent = new TemplatePortal(
      this.templatePortalContent,
      this.vcr,
    );
  }

  public selected($event: unknown): void {
    this.hitSelected.emit($event);
  }
}
