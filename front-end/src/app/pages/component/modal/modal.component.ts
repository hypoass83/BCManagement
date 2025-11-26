import { Component, Input, Output, EventEmitter, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
})
export class ModalComponent implements AfterViewInit, OnDestroy {
  @Input() modalId!: string;            // 👈 ton ID (ex: "job-create-form")
  @Input() title = '';                  // 👈 titre dynamique
  @Output() close = new EventEmitter<void>();
  @Input() width = '50%';

  private modalElement?: HTMLElement;

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    this.modalElement = document.getElementById(this.modalId) as HTMLElement;
  }

  open() {
    if (this.modalElement) {
      this.modalElement.classList.remove('hidden');
    }
  }

  closeModal() {
    if (this.modalElement) {
      this.modalElement.classList.add('hidden');
      this.close.emit();
    }
  }

  ngOnDestroy(): void {
    this.close.emit();
  }
}
