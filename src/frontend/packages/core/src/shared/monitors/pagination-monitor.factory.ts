import { Injectable } from '@angular/core';
import { PaginationMonitor } from './pagination-monitor';
import { Store } from '@ngrx/store';
import { schema as normalizrSchema } from 'normalizr';
import { AppState } from '../../../../store/src/app-state';
import { EntitySchema } from '../../../../store/src/helpers/entity-factory';

@Injectable()
export class PaginationMonitorFactory {

  constructor(private store: Store<AppState>) { }

  private monitorCache: {
    [key: string]: PaginationMonitor
  } = {};

  public create<T = any>(
    paginationKey: string,
    schema: EntitySchema,
  ) {
    const cacheKey = paginationKey + schema.key;
    if (this.monitorCache[cacheKey]) {
      return this.monitorCache[cacheKey] as PaginationMonitor<T>;
    } else {
      const monitor = new PaginationMonitor<T>(
        this.store,
        paginationKey,
        schema
      );
      this.monitorCache[cacheKey] = monitor;
      return monitor;
    }
  }

}
