import { KubernetesPod } from './../../store/kube.types';
import { KubernetesNode } from './../../../../../../../../../custom-src/frontend/app/custom/kubernetes/store/kube.types';
import { GetKubernetesApps } from './../../store/kubernetes.actions';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { KubernetesEndpointService } from '../../services/kubernetes-endpoint.service';
import { HttpClient } from '@angular/common/http';
import { PaginatedAction } from '../../../../../../store/src/types/pagination.types';
import { entityFactory } from '../../../../../../store/src/helpers/entity-factory';
import { getPaginationObservables } from '../../../../../../store/src/reducers/pagination-reducer/pagination-reducer.helper';
import { map, startWith, tap } from 'rxjs/operators';
import { Observable, combineLatest, interval, Subscription } from 'rxjs';
import { PaginationMonitorFactory } from '../../../../shared/monitors/pagination-monitor.factory';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../../store/src/app-state';
import { GetKubernetesPods, GetKubernetesNodes } from '../../store/kubernetes.actions';
import { getEndpointType } from '../../../../features/endpoints/endpoint-helpers';
import { ISimpleUsageChartData, IChartThresholds } from '../../../../shared/components/simple-usage-chart/simple-usage-chart.types';
interface IEndpointDetails {
  imagePath: string;
  label: string;
  name: string;
}
@Component({
  selector: 'app-kubernetes-summary',
  templateUrl: './kubernetes-summary.component.html',
  styleUrls: ['./kubernetes-summary.component.scss']
})
export class KubernetesSummaryTabComponent implements OnInit, OnDestroy {
  public podCount$: Observable<number>;
  public nodeCount$: Observable<number>;
  public appCount$: Observable<number>;
  public highUsageColors = {
    domain: ['#00000026', '#00af00']
  };
  public normalUsageColors = {
    domain: ['#00af00', '#00af002e']
  };
  public endpointDetails$: Observable<IEndpointDetails> = this.kubeEndpointService.endpoint$.pipe(
    map(endpoint => {
      const { imagePath, label } = getEndpointType(endpoint.entity.cnsi_type, endpoint.entity.sub_type);
      return {
        imagePath,
        label,
        name: endpoint.entity.name,
      };
    })
  );
  source: SafeResourceUrl;

  dashboardLink: string;
  public podCapacity$: Observable<ISimpleUsageChartData>;
  public diskPressure$: Observable<ISimpleUsageChartData>;
  public memoryPressure$: Observable<ISimpleUsageChartData>;
  public outOfDisk$: Observable<ISimpleUsageChartData>;
  public nodesReady$: Observable<ISimpleUsageChartData>;
  public networkUnavailable$: Observable<ISimpleUsageChartData>;

  public pressureChartThresholds: IChartThresholds = {
    danger: 90,
    warning: 0,
  };

  public nominalPressureChartThresholds: IChartThresholds = {
    warning: 100,
    inverted: true
  };

  public criticalPressureChartThresholds: IChartThresholds = {
    danger: 0
  };

  public criticalPressureChartThresholdsInverted: IChartThresholds = {
    danger: 100,
    inverted: true
  };

  private polls: Subscription[] = [];


  constructor(
    public kubeEndpointService: KubernetesEndpointService,
    public httpClient: HttpClient,
    public paginationMonitorFactory: PaginationMonitorFactory,
    private store: Store<AppState>,
    private ngZone: NgZone
  ) { }

  private getPaginationObservable(action: PaginatedAction) {
    const paginationMonitor = this.paginationMonitorFactory.create(
      action.paginationKey,
      entityFactory(action.entityKey)
    );

    this.ngZone.runOutsideAngular(() => {
      this.polls.push(
        interval(5000).subscribe(() => {
          this.ngZone.run(() => {
            this.store.dispatch(action);
          });
        })
      );
    });

    return getPaginationObservables({
      store: this.store,
      action,
      paginationMonitor
    }).entities$
  }

  private getCountObservable(entities$: Observable<any[]>) {
    return entities$.pipe(
      map(entities => entities.length),
      startWith(null)
    );
  }
  private getPodCapacity(nodes$: Observable<KubernetesNode[]>, pods$: Observable<KubernetesPod[]>) {
    return combineLatest(nodes$, pods$).pipe(
      map(([nodes, pods]) => ({
        total: nodes.reduce((cap, node) => {
          return cap + parseInt(node.status.capacity.pods, 10);
        }, 0),
        used: pods.length
      }))
    );
  }

  private getNodeStatusCount(nodes$: Observable<KubernetesNode[]>, conditionType: string, countStatus = 'False') {
    return nodes$.pipe(
      map(nodes => ({
        total: nodes.length,
        used: nodes.reduce((cap, node) => {
          const conditionStatus = node.status.conditions.find(con => con.type === conditionType);
          if (conditionType === 'Ready') {
            console.log(conditionStatus);
            console.log(countStatus)
          }
          if (!conditionStatus || !conditionStatus.status || conditionStatus.status === countStatus) {
            return cap;
          }
          return ++cap;
        }, 0)
      }))
    );
  }

  ngOnInit() {
    const guid = this.kubeEndpointService.baseKube.guid;

    const podCountAction = new GetKubernetesPods(guid);
    const nodeCountAction = new GetKubernetesNodes(guid);
    const appCountAction = new GetKubernetesApps(guid);
    const applications$ = this.getPaginationObservable(appCountAction);
    const pods$ = this.getPaginationObservable(podCountAction);
    const nodes$ = this.getPaginationObservable(nodeCountAction);

    this.podCount$ = this.getCountObservable(pods$);
    this.nodeCount$ = this.getCountObservable(nodes$);
    this.appCount$ = this.getCountObservable(applications$);

    this.podCapacity$ = this.getPodCapacity(nodes$, pods$);
    this.diskPressure$ = this.getNodeStatusCount(nodes$, 'DiskPressure');
    this.memoryPressure$ = this.getNodeStatusCount(nodes$, 'MemoryPressure');
    this.outOfDisk$ = this.getNodeStatusCount(nodes$, 'OutOfDisk');
    this.networkUnavailable$ = this.getNodeStatusCount(nodes$, 'NetworkUnavailable', 'True');
    this.nodesReady$ = this.getNodeStatusCount(nodes$, 'Ready');

    this.dashboardLink = `/kubernetes/${guid}/dashboard`;
  }

  ngOnDestroy() {
    if (this.polls && this.polls.length) {
      this.polls.forEach(sub => sub.unsubscribe());
    }
  }

  public getDashboard() {
    const guid = this.kubeEndpointService.baseKube.guid;
    this.httpClient.get(`/pp/v1/kubedash/${guid}/status`).subscribe(a => {
      console.log('Kube dashboard status');
      console.log(a);
    });
  }

}
