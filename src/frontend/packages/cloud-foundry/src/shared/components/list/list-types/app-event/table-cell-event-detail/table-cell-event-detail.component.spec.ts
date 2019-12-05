import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValuesPipe } from '../../../../../../../../core/src/shared/pipes/values.pipe';
import { EntityInfo } from '../../../../../../../../store/src/types/api.types';
import { TableCellEventDetailComponent } from './table-cell-event-detail.component';

describe('TableCellEventDetailComponent', () => {
  let component: TableCellEventDetailComponent<EntityInfo>;
  let fixture: ComponentFixture<TableCellEventDetailComponent<EntityInfo>>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TableCellEventDetailComponent, ValuesPipe]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent<TableCellEventDetailComponent<EntityInfo>>(TableCellEventDetailComponent);
    component = fixture.componentInstance;
    component.row = {
      entity: {
        metadata: {}
      }
    } as EntityInfo;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
