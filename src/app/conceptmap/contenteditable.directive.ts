import { Directive, OnChanges, HostListener, ElementRef, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[cmContenteditableModel]'
})
export class ContenteditableDirective implements OnChanges {

  @Input() model: string;
  @Output() update = new EventEmitter();

  constructor(private element: ElementRef) { }

  ngOnChanges(changes: SimpleChanges) {
    this.refreshView();
  }

  @HostListener('blur') updateModel() {
    setTimeout(() => this.update.emit(this.element.nativeElement.innerHTML), 0);
  }

  refreshView() {
    this.element.nativeElement.innerHTML = this.model;
  }
}
