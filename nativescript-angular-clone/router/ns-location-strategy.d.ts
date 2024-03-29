import { LocationStrategy } from "@angular/common";
import { UrlSegmentGroup, ActivatedRouteSnapshot } from "@angular/router";
import { NavigationTransition, Frame } from "tns-core-modules/ui/frame";
import { FrameService } from "../platform-providers";
export declare class Outlet {
    showingModal: boolean;
    modalNavigationDepth: number;
    parent: Outlet;
    isPageNavigationBack: boolean;
    outletKeys: Array<string>;
    frames: Array<Frame>;
    path: string;
    pathByOutlets: string;
    states: Array<LocationState>;
    isNSEmptyOutlet: boolean;
    shouldDetach: boolean;
    constructor(outletKey: string, path: string, pathByOutlets: string, modalNavigationDepth?: number);
    containsFrame(frame: Frame): boolean;
    peekState(): LocationState;
    containsTopState(stateUrl: string): boolean;
    getFrameToBack(): Frame;
}
export interface NavigationOptions {
    clearHistory?: boolean;
    animated?: boolean;
    transition?: NavigationTransition;
}
export interface LocationState {
    segmentGroup: UrlSegmentGroup;
    isRootSegmentGroup: boolean;
    isPageNavigation: boolean;
    frame?: Frame;
}
export declare class NSLocationStrategy extends LocationStrategy {
    private frameService;
    private outlets;
    private currentOutlet;
    private popStateCallbacks;
    private _currentNavigationOptions;
    private currentUrlTree;
    _modalNavigationDepth: number;
    constructor(frameService: FrameService);
    path(): string;
    prepareExternalUrl(internal: string): string;
    pushState(state: any, title: string, url: string, queryParams: string): void;
    pushStateInternal(state: any, title: string, url: string, queryParams: string): void;
    replaceState(state: any, title: string, url: string, queryParams: string): void;
    forward(): void;
    back(outlet?: Outlet, frame?: Frame): void;
    canGoBack(outlet?: Outlet): boolean;
    onPopState(fn: (_: any) => any): void;
    getBaseHref(): string;
    private callPopState;
    toString(): string;
    _beginBackPageNavigation(frame: Frame): void;
    _finishBackPageNavigation(frame: Frame): void;
    _beginModalNavigation(frame: Frame): void;
    _closeModalNavigation(): void;
    _beginPageNavigation(frame: Frame): NavigationOptions;
    _setNavigationOptions(options: NavigationOptions): void;
    _getOutlets(): Array<Outlet>;
    updateOutletFrame(outlet: Outlet, frame: Frame, isEmptyOutletFrame: boolean): void;
    clearOutlet(frame: Frame): void;
    getSegmentGroupFullPath(segmentGroup: UrlSegmentGroup): string;
    getRouteFullPath(currentRoute: any): string;
    getPathByOutlets(urlSegmentGroup: any): string;
    findOutlet(outletKey: string, activatedRouteSnapshot?: ActivatedRouteSnapshot): Outlet;
    private findOutletByModal;
    private getOutletByFrame;
    private updateStates;
    private updateParentsStates;
    private createOutlet;
    private getSegmentGroupByOutlet;
    private updateSegmentGroup;
    private upsertModalOutlet;
    private getOutletKey;
    ngOnDestroy(): void;
}
