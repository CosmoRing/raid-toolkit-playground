import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ClientService } from '../shared/services/client.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {

  constructor(private clientService: ClientService) { }

  ngOnInit(): void {
  }

  public forceRefresh() {
    this.clientService.refreshSubject.next(null);
  }

}
