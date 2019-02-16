## helloworld-webpart
This is typescript based project helps you to get started with SharePoint Framework. This solution containing CRUD operations performed on SharePoint List.
Create custom SharePoint list named "TestList" with default Title field. Add some custom data in it.
Before making this spfx solution to work, make sure that you set up your development environment first.For that follow this detailed steps provided on url https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-development-environment.

### Building the code
1. Download the code and fire the command "npm install" to install all the dependencies of this project.
2. Developer certificate has to be installed ONLY once in your development environment, for that fire the command "gulp trust-dev-cert"
3. For building the project, fire the command "gulp serve" to run webpart in local workbench.
4. Add the "crudOperation" web part in local workbench to test the web part.

### Production Build
1.To host all the web part assets on Office 365 CDN, make sure that you have enabled public CDN settings from the tenant level.
  for enabling and configuring office 365 settings,follow the detailed steps https://docs.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/hosting-webpart-from-office-365-cdn.
2.For Production build fire the command "gulp bundle --ship".
3.For Package solution fire the command "gulp package-solution --ship".
4.Upload or drag and drop the newly created client-side solution package to the app catalog in your tenant.
5.Notice how the domain list in the prompt says SharePoint Online. This is because the content is either served from the Office 365 CDN or from the app catalog, depending on the tenant settings. Select Deploy.
6.Open the site and install the solution helloworld-webpart-client-side-solution.
7.After the solution has been installed, select Add a page from the gear menu, and select "crudOperation" web part from the modern page web part picker to add your custom web part to page.

Note :
If you would not have CDN enabled in your tenant, and the includeClientSideAssets setting would be truein the package-solution.json, the loading URL for the assets would be dynamically updated and pointing directly to the ClientSideAssets folder located in the app catalog site collection. In this example case, the URL would be https://sppnp.microsoft.com/sites/apps/ClientSideAssets/. This change is automatic depending on your tenant settings and it does not require any changes in the actual solution package.


This package produces the following:Crud-Operation

* lib/* - intermediate-stage commonjs build artifacts
* dist/* - the bundled script, along with other resources
* deploy/* - all resources which should be uploaded to a CDN.

# Crud-Operation-SPFX

