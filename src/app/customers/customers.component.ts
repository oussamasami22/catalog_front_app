import { Component } from '@angular/core';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent {
  showWarning: boolean = false;

  showWarningIcon() {
    this.showWarning = true;
    setTimeout(() => {
      this.showWarning = false;
    }, 2000);
  }
}
