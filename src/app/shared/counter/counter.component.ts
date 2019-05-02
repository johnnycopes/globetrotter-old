import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss']
})
export class CounterComponent implements OnInit {
  @Input() text: string;
  @Input() current: number;
  @Input() total: number;
  @Input() wrapNumbers: boolean;
  @Input() boldNumbers: boolean;
  @Input() boldText: boolean;
  @Input() textFirst: boolean;

  constructor() { }

  ngOnInit() {
  }

}
