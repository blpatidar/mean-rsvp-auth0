import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from './../../auth/auth.service';
import { ApiService } from './../../core/api.service';
import { UtilsService } from './../../core/utils.service';
import { FilterSortService } from './../../core/filter-sort.service';
import { Subscription } from 'rxjs/Subscription';
import { RsvpModel} from './../../core/models/rsvp.model';

@Component({
  selector: 'app-user',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {
  pageTitle = 'UserList';
  eventsSub: Subscription;
  eventList: RsvpModel[];
  filteredEvents: RsvpModel[];
  loading: boolean;
  error: boolean;
  query = '';

  constructor(
    private title: Title,
    public auth: AuthService,
    private api: ApiService,
    public utils: UtilsService,
    public fs: FilterSortService) { }

  ngOnInit() {
    this.title.setTitle(this.pageTitle);
    this._getEventList();
  }

  private _getEventList() {
    this.loading = true;
   
    this.eventsSub = this.api
      .getRsvpsName$()
      .subscribe(
        res => {
          alert(res[0].name)
          this.eventList = res;
          this.filteredEvents = res;
          this.loading = false;
        },
        err => {
          console.error(err);
          this.loading = false;
          this.error = true;
        }
      );
  }

  searchEvents() {
    this.filteredEvents = this.fs.search(this.eventList, this.query, '_id', 'mediumDate');
  }

  resetQuery() {
    this.query = '';
    this.filteredEvents = this.eventList;
  }

  ngOnDestroy() {
    this.eventsSub.unsubscribe();
  }

}
