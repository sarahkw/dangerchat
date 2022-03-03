import { Component, OnDestroy, OnInit, Optional } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'demo-w98w';

  devicePixelRatio: number | undefined;

  ngOnInit(): void {

    const updatePixelRatio = () => {
      this.devicePixelRatio = window.devicePixelRatio;
      matchMedia(`(resolution: ${this.devicePixelRatio}dppx)`).addEventListener("change", updatePixelRatio, { once: true })
    }

    updatePixelRatio();

  }
}
