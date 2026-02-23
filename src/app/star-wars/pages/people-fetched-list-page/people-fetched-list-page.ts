import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Person, ResourceList } from '../../types/api';

@Component({
  selector: 'app-people-fetched-list-page',
  imports: [AsyncPipe],
  templateUrl: './people-fetched-list-page.html',
  styleUrl: './people-fetched-list-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeopleFetchedListPage {
  protected readonly data$ = fetch('https://swapi.dev/api/people').then(
    (res) => res.json() as Promise<ResourceList<Person>>,
  );
}
