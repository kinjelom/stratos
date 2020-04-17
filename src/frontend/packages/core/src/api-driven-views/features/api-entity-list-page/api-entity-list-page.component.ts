import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StratosBaseCatalogEntity } from '../../../../../store/src/entity-catalog/entity-catalog-entity';
import { entityCatalog } from '../../../../../store/src/entity-catalog/entity-catalog';

@Component({
  selector: 'app-api-entity-list-page',
  templateUrl: './api-entity-list-page.component.html',
  styleUrls: ['./api-entity-list-page.component.scss']
})
export class ApiEntityListPageComponent implements OnInit {
  public catalogEntity: StratosBaseCatalogEntity;
  constructor(
    public route: ActivatedRoute
  ) { }

  ngOnInit() {
    const endpointType = this.route.parent ? this.route.parent.snapshot.params.endpointType : null;
    const entityType = this.route.snapshot.params.entityType;
    this.catalogEntity = entityCatalog.getEntity(endpointType, entityType);
  }

}
