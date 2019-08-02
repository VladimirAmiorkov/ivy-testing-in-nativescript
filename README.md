# Repo build step
Execute:
- `npm run prepare-repo`

## Test with local packages:
- Start `ngcc` with `npm run start-ngcc`
- Observe the output of the compilation and hope for no errors :)

## Test with latest online packages:
- Update the deps of the test project by executing `npm run use-latest-deps`
- Start `ngcc` with `npm run start-ngcc`
- Observe the output of the compilation and hope for no errors :)

To reset the project and start from scratch simply execute `npm run cleanup` (this removed the node_modules of the test project, make sure to call `npm run install-test-proj-deps` after it)

# Notes/questions
The only package we are planning to update for the moment and make compatible with Ivy is `nativescript-anguar` because it is the main package that contains Angular related code. In the future we want all plugins that contains Angular directives to be Ivy compatible in the same way (example `nativescript-picker` https://github.com/NativeScript/nativescript-picker/tree/master/src/angular)
We are aiming to use the “CommonJS” path of Ivy support using `ngcc`
 
## Current issues:
- The `nativescript-anuglar` package requires the addition of `ngcc-config.js` file in its root. We are not sure how that file should be structured and what it needs to include ( Do we need all entry points to be listed with their corresponding `main` and `typings` ?)
- After adding a “not full” `ngcc-config.js`file and running ngcc (./node_modules/.bin/ivy-ngcc), it errors with error that some of the imports in the files of `nativescript-angular` cannot be resolved and are null. Those imports are from our other package `tns-core-modules`, issue is those entries are not “full”, meaning they are not separated in a directory that contains an individual package.json. Example layout base (https://github.com/NativeScript/NativeScript/tree/e72aaca12d4db003508affcf4b9d2116f14ad36c/tns-core-modules/ui/layouts) . We can but should we make those into valid entry points (ngcc-wise) so that ngcc does not stop compilation and raise an error ?
- If the above is all solved we are hitting error while fist entry in the `ngcc-config.js` is being processed that looks to be false error or not fully described as seen in this TODO comment (https://github.com/angular/angular/blob/4495a46b998f02a0f021f88559630adad91ed982/packages/compiler-cli/src/ngtsc/annotations/src/ng_module.ts#L420), because the array that ngcc is complaining about is indeed an Array (https://github.com/NativeScript/nativescript-angular/blob/a025a0935a8463828f35ac46ad3f5bbf05bd2e0e/nativescript-angular/common.ts#L19-L22):
Error is:
 
“Expected array when reading the NgModule.declarations of NativeScriptCommonModule”
 
 
### Current testing environment:

NativeScript-like app with Angular (package.json containing the deps of a real {N} + Angular app) created from template (tns create test-ivy —ng) with removed {N} related files/folders (not important for `ngcc`) and updated to the following dependencies:
Dependencies:
```
"dependencies": {
  "@angular/animations": "~8.1.0",
  "@angular/common": "~8.1.0",
  "@angular/compiler": "~8.1.0",
  "@angular/core": "~8.1.0",
  "@angular/forms": "~8.1.0",
  "@angular/http": "8.0.0-beta.10",
  "@angular/platform-browser": "~8.1.0",
  "@angular/platform-browser-dynamic": "~8.1.0",
  "@angular/router": "~8.1.0",
  "nativescript-angular": "file:../../../Desktop/Work/nativescript-angular/nativescript-angular/nativescript-angular-8.1.0.tgz",
  "nativescript-theme-core": "~1.0.4",
  "reflect-metadata": "~0.1.12",
  "rxjs": "~6.5.0",
  "tns-core-modules": "6.0.1",
  "zone.js": "~0.9.1"
}
```
 
ngcc-config.js:

```
module.exports = {
    entryPoints: {
        '.':
        {
            override:
            {
                main: "./index.js",
                typings: "./index.d.ts"
            }
        }
    }
}
```



{
  "nativescript": {
    "id": "org.nativescript.testivy",
    "tns-android": {
      "version": "6.0.0"
    },
    "tns-ios": {
      "version": "6.0.0"
    }
  },
  "description": "NativeScript Application",
  "license": "SEE LICENSE IN <your-license-filename>",
  "repository": "<fill-your-repository-here>",
  "dependencies": {
    "@angular/animations": "~8.1.0",
    "@angular/common": "~8.1.0",
    "@angular/compiler": "~8.1.0",
    "@angular/core": "~8.1.0",
    "@angular/forms": "~8.1.0",
    "@angular/http": "8.0.0-beta.10",
    "@angular/platform-browser": "~8.1.0",
    "@angular/platform-browser-dynamic": "~8.1.0",
    "@angular/router": "~8.1.0",
    "nativescript-angular": "file:../../../Desktop/Work/nativescript-angular/nativescript-angular/nativescript-angular-8.2.0.tgz",
    "nativescript-theme-core": "~1.0.4",
    "reflect-metadata": "~0.1.12",
    "rxjs": "~6.5.0",
    "tns-core-modules": "file:../../../Desktop/Work/NativeScript/bin/dist/tns-core-modules-6.1.0.tgz",
    "zone.js": "~0.9.1"
  },
  "devDependencies": {
    "@angular/compiler-cli": "~8.1.0",
    "@ngtools/webpack": "~8.1.0",
    "nativescript-dev-webpack": "1.0.0",
    "typescript": "3.4.5"
  }
}
