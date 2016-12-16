import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  helpText: boolean = true;

  @HostListener('dblclick') doubleClick() {
    this.helpText = false;
  }

}
