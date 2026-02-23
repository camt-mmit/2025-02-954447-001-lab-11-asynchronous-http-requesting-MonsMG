import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ModuleActivatedRoute } from '../../tokens';

@Component({
  selector: 'app-star-wars-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './star-wars-root.html',
  styleUrl: './star-wars-root.scss',
  providers: [{
    provide: ModuleActivatedRoute,
    useFactory: () => inject(ActivatedRoute),
  }]
})
export class StarWarsRoot {
}
