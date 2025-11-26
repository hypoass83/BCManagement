import { Component, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent {
  @Input() title!: string;
  @Input() title1!:string;
  @Input() activeitem!: string;

  constructor(private titleService: Title) {}

  ngOnInit(): void {
    if (this.title) {
      this.titleService.setTitle("Valdoz - "+this.activeitem +" > "+this.title);
    }
  }
}
