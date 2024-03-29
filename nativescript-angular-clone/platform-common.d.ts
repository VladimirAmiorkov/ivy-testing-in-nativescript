import "tns-core-modules/globals";
import "tns-core-modules/application";
import "./zone-js/dist/zone-nativescript";
import "./polyfills/array";
import "./polyfills/console";
import "./dom-adapter";
import { Type, Injector, CompilerOptions, PlatformRef, NgModuleFactory, NgModuleRef, EventEmitter, Sanitizer, InjectionToken, StaticProvider } from "@angular/core";
import { PageFactory } from "./platform-providers";
import "nativescript-intl";
export declare const onBeforeLivesync: EventEmitter<NgModuleRef<any>>;
export declare const onAfterLivesync: EventEmitter<{
    moduleRef?: NgModuleRef<any>;
    error?: Error;
}>;
/**
 * Options to be passed when HMR is enabled
 */
export interface HmrOptions {
    /**
     * A factory function that returns either Module type or NgModuleFactory type.
     * This needs to be a factory function as the types will change when modules are replaced.
     */
    moduleTypeFactory?: () => Type<any> | NgModuleFactory<any>;
    /**
     * A livesync callback that will be called instead of the original livesync.
     * It gives the HMR a hook to apply the module replacement.
     * @param bootstrapPlatform - A bootstrap callback to be called after HMR is done. It will bootstrap a new angular app within the exisiting platform, using the moduleTypeFactory to get the Module or NgModuleFactory to be used.
     */
    livesyncCallback: (bootstrapPlatform: () => void) => void;
}
export interface AppOptions {
    bootInExistingPage?: boolean;
    cssFile?: string;
    startPageActionBarHidden?: boolean;
    createFrameOnBootstrap?: boolean;
    hmrOptions?: HmrOptions;
}
export declare type PlatformFactory = (extraProviders?: StaticProvider[]) => PlatformRef;
export declare class NativeScriptSanitizer extends Sanitizer {
    sanitize(_context: any, value: string): string;
}
export declare class NativeScriptDocument {
    body: any;
    createElement(tag: string): void;
}
export declare const COMMON_PROVIDERS: ({
    provide: InjectionToken<PageFactory>;
    useValue: PageFactory;
} | {
    provide: typeof Sanitizer;
    useClass: typeof NativeScriptSanitizer;
    deps: any[];
} | {
    provide: InjectionToken<Document>;
    useClass: typeof NativeScriptDocument;
    deps: any[];
})[];
export declare class NativeScriptPlatformRef extends PlatformRef {
    private platform;
    private appOptions;
    private _bootstrapper;
    constructor(platform: PlatformRef, appOptions?: AppOptions);
    bootstrapModuleFactory<M>(moduleFactory: NgModuleFactory<M>): Promise<NgModuleRef<M>>;
    bootstrapModule<M>(moduleType: Type<M>, compilerOptions?: CompilerOptions | CompilerOptions[]): Promise<NgModuleRef<M>>;
    private bootstrapApp;
    onDestroy(callback: () => void): void;
    readonly injector: Injector;
    destroy(): void;
    readonly destroyed: boolean;
    private bootstrapNativeScriptApp;
    _livesync(): void;
    private createErrorUI;
    private createFrameAndPage;
}
