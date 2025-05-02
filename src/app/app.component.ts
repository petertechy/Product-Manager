import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./components/navbar/navbar.component";

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  template: `
  <app-navbar />
  <div class="page-container">
    <router-outlet></router-outlet>
  </div>
`,
})
export class AppComponent {}
