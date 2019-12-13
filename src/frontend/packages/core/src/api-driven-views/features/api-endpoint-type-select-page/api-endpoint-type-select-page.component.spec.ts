import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiEndpointTypeSelectPageComponent } from './api-endpoint-type-select-page.component';
import { ApiDrivenViewsModule } from '../../api-driven-views.module';
import { StoreModule } from '@ngrx/store';
import { appReducers } from '../../../../../store/src/reducers.module';
import { RouterTestingModule } from '@angular/router/testing';
import { CoreModule } from '../../../core/core.module';
import { SharedModule } from '../../../shared/shared.module';
import { createBasicStoreModule } from '@stratos/store/testing';
import { TabNavService } from '../../../../tab-nav.service';
import { EntityCatalogModule } from '../../../../../store/src/entity-catalog.module';
import { generateStratosEntities } from '../../../base-entity-types';

describe('ApiEndpointTypeSelectPageComponent', () => {
  let component: ApiEndpointTypeSelectPageComponent;
  let fixture: ComponentFixture<ApiEndpointTypeSelectPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        EntityCatalogModule.forFeature(generateStratosEntities),
        CoreModule,
        RouterTestingModule,
        SharedModule,
        createBasicStoreModule(),
        ApiDrivenViewsModule,
      ],
      providers: [TabNavService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiEndpointTypeSelectPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
