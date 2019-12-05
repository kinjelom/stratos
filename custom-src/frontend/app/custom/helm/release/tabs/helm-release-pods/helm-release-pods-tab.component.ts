import { Component } from '@angular/core';

import { ListConfig } from '../../../../../shared/components/list/list.component.types';
import { HelmReleasePodsListConfig } from '../../../list-types/monocular-release-pods-list-config.service';

@Component({
  selector: 'app-helm-release-pods-tab',
  templateUrl: './helm-release-pods-tab.component.html',
  styleUrls: ['./helm-release-pods-tab.component.scss'],
  providers: [{
    provide: ListConfig,
    useClass: HelmReleasePodsListConfig,
  }]
})
export class HelmReleasePodsTabComponent { }
