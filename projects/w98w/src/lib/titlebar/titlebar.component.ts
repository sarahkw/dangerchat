import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { GenImg } from '../genimg';

@Component({
  selector: 'w98w-titlebar',
  templateUrl: './titlebar.component.html',
  styleUrls: ['./titlebar.component.scss']
})
export class TitlebarComponent implements OnInit {

  readonly GENIMG = GenImg;

  @Input() iconSrc!: string;
  @Input() label = "";

  @HostBinding('class') readonly hbClass = "w98w-titlebar";

  ngOnInit(): void {
    console.assert(!!this.iconSrc);
  }

}
