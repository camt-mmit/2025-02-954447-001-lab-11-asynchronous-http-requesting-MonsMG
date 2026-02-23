import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, input, linkedSignal } from '@angular/core';
import { FormField, disabled, form, submit } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { purnEmptyProperties } from '../../helpers';
import { Person, ResourceList } from '../../types';

@Component({
  selector: 'app-people-http-resource-list-page',
  imports: [FormField],
  templateUrl: './people-http-resource-list-page.html',
  styleUrl: './people-http-resource-list-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeopleHttpResourceListPage {
  // class body page 1
  readonly search = input<string>();
  protected readonly resource = httpResource<ResourceList<Person>>(() => ({
    url: 'https://swapi.dev/api/people',
    params: this.search() ? { search: this.search()! } : {},
  })).asReadonly();
  protected readonly form = form(
    linkedSignal(() => ({ search: this.search() ?? '' })),
    (path) => {
      disabled(path, () => this.resource.isLoading());
    },
  );
  // class body page 2
  private readonly router = inject(Router);

  protected async onSearch(): Promise<void> {
    await submit(
      this.form,
      async (form) =>
        void this.router.navigate([], {
          queryParams: purnEmptyProperties(form().value()),
          replaceUrl: true,
        }),
    );
  }
  protected async clearSearch(): Promise<void> {
    this.form.search().value.set('');
    await this.onSearch();
  }
}
