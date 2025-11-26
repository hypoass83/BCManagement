import { Injectable, ComponentRef, ViewContainerRef, Injector, ComponentFactoryResolver, Type } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  private containerRef?: ViewContainerRef;
  private componentRef?: ComponentRef<any>;

  setContainerRef(containerRef: ViewContainerRef) {
    this.containerRef = containerRef;
  }

  open<T>(component: Type<T>, injector?: Injector) {
    if (!this.containerRef) {
      console.error('PopupService: ViewContainerRef non défini');
      return;
    }

    this.containerRef.clear();
    this.componentRef = this.containerRef.createComponent(component, { injector });
  }

  close() {
    this.componentRef?.destroy();
    this.containerRef?.clear();
  }
}
