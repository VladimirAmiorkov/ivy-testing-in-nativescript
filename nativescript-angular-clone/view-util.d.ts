import { View } from "tns-core-modules/ui/core/view";
import { Placeholder } from "tns-core-modules/ui/placeholder";
import { ContentView } from "tns-core-modules/ui/content-view";
import { LayoutBase } from "tns-core-modules/ui/layouts/layout-base";
import { InvisibleNode, NgView, ViewExtensions } from "./element-registry";
import { Device } from "tns-core-modules/platform";
export declare type ViewExtensions = ViewExtensions;
export declare type NgView = NgView;
export declare type NgLayoutBase = LayoutBase & ViewExtensions;
export declare type NgContentView = ContentView & ViewExtensions;
export declare type NgPlaceholder = Placeholder & ViewExtensions;
export declare type BeforeAttachAction = (view: View) => void;
export declare function isLayout(view: any): view is NgLayoutBase;
export declare function isContentView(view: any): view is NgContentView;
export declare class ViewUtil {
    private isIos;
    private isAndroid;
    constructor(device: Device);
    insertChild(parent: View, child: View, previous?: NgView, next?: NgView): void;
    private addToQueue;
    private appendToQueue;
    private addToVisualTree;
    private insertToLayout;
    private findNextVisual;
    removeChild(parent: View, child: View): void;
    private removeFromQueue;
    private findPreviousElement;
    private getPreviousVisualElement;
    getChildIndex(parent: any, child: NgView): number;
    private removeFromVisualTree;
    private removeLayoutChild;
    createComment(): InvisibleNode;
    createText(): InvisibleNode;
    createView(name: string): NgView;
    private ensureNgViewExtensions;
    private setNgViewExtensions;
    setProperty(view: NgView, attributeName: string, value: any, namespace?: string): void;
    private runsIn;
    private setPropertyInternal;
    private getProperties;
    private cssClasses;
    addClass(view: NgView, className: string): void;
    removeClass(view: NgView, className: string): void;
    private setClasses;
    private syncClasses;
    setStyle(view: NgView, styleName: string, value: any): void;
    removeStyle(view: NgView, styleName: string): void;
}
