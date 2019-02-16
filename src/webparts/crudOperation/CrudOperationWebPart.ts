import { Version, EnvironmentType, Environment } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';
import {
  SPHttpClient,
  SPHttpClientResponse
} from "@microsoft/sp-http";
import { SPComponentLoader } from '@microsoft/sp-loader';
import * as jQuery from "jquery";
import * as bootstrap from "bootstrap";
import * as toastr from "toastr";


import styles from './CrudOperationWebPart.module.scss';
import * as strings from 'CrudOperationWebPartStrings';


import { ISPListItem } from './ListItemModel';
import { SPHttpClientConfiguration } from '@microsoft/sp-http';
import mockHttpClient from './mockHttpClient';

export interface ICrudOperationWebPartProps {
  description: string;
}

export interface ISPListItems {
  value: ISPListItem[];
}

export default class CrudOperationWebPart extends BaseClientSideWebPart<ICrudOperationWebPartProps> {

  public constructor() {
    super();
    SPComponentLoader.loadCss('https://stackpath.bootstrapcdn.com/bootswatch/4.2.1/lumen/bootstrap.min.css');
    SPComponentLoader.loadCss('https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css');
  }

  


  
  public render(): void {

    jQuery(document).ready(()=>{
      this.domElement.innerHTML = `
      <div class="container">
        <h1>SharePoint Crud Operations</h1>
        <div class="row">
        <div class="form-group col-md-6">
          <lable for="txtTitle">Title</lable>
          <input type="text" id="txtTitle" class="form-control"/>
        </div>
        <div class="col-md-12">
        <input type="submit" class="btn btn-primary" value="Create" id="btnCreate"/>
        <input type="button" class="btn btn-primary" value="Update" id="btnUpdate"/>
        <input type="button" class="btn btn-primary" value="Delete" id="btnDelete"/>
        </div>
        <div class="col-md-12" id="tblbody">
       </div>
        </div>
      </div>

      `;
    document.getElementById('btnCreate').addEventListener('click', () => this.CreateSPItem());
    document.getElementById('btnUpdate').addEventListener('click', () => this.UpdateSPItem());
    document.getElementById('btnDelete').addEventListener('click', () => this.DeleteSPItem());
    this._renderItems();
    
    });

    

  }


  private _getMockListData(): Promise<ISPListItems> {
    return mockHttpClient.get().then((data: ISPListItem[]) => {
      var listData: ISPListItems = { value: data };
      return listData;
    }) as Promise<ISPListItems>;

  }

  private _renderItems(): void {

    if (Environment.type === EnvironmentType.Local) {
      this._getMockListData().then((response) => {
        this.renderTable(response.value);
      });

    }
    else if (Environment.type == EnvironmentType.SharePoint ||
      Environment.type == EnvironmentType.ClassicSharePoint) {
      this._getListItems().then(response => {
        this.renderTable(response);
      });
    }


  }
  DeleteSPItem(): any {
    if (this.domElement.querySelector('input[name = "rdoId"]:checked')) {
      var itemid = this.domElement.querySelector('input[name = "rdoId"]:checked')["value"];
      this._deleteListItem(itemid).then(response => {
        toastr.success('Item deleted with item id :' + itemid);
        this._renderItems();

      });
    }
    else {
      toastr.error('Please select the radio button to delete the record');
    }

  }
  UpdateSPItem(): any {
    if (!this.domElement.querySelector('#txtTitle')['value']) {
      toastr.error('Please enter the title value');
    }
    else {
      if (this.domElement.querySelector('input[name = "rdoId"]:checked')['checked']) {
        let title: string = this.domElement.querySelector('#txtTitle')['value'];
        var itemid = this.domElement.querySelector('input[name = "rdoId"]:checked')["value"];
        this._updateListItem(itemid, title).then(response => {
          this.domElement.querySelector('#txtTitle')['value']="";
          toastr.success('Item updated with item id :' + itemid);
          
          this._renderItems();
        });
      }
      else {
        toastr.error("Please select the radio button to update the record");
      }

    }

  }
  CreateSPItem(): any {
    if (!this.domElement.querySelector('#txtTitle')['value']) {
      
        toastr.error("Please enter the title");
    }
    else {
      let title: string = this.domElement.querySelector('#txtTitle')['value'];
      this._createListItem(title).then(response => {
        this.domElement.querySelector('#txtTitle')['value']="";
        toastr.success('Item Created with title :' + title);
        
        this._renderItems();
      });
    }

  }

  private renderTable(items: ISPListItem[]): void {
    let htmlString: string = `<table class="table table-hover">
    <thead>
      <tr>
        <td>#</td>
        <th>Id</th>
        <th>Title</th>
      </tr>
    </thead>
    <tbody>`;

    if (items.length > 0) {

      items.forEach((item: ISPListItem) => {
        htmlString += `<tr>
        <td><input type="radio" id="rdoId" name="rdoId" value="${item.Id}"></td>
        <td>${item.Id}</td>
        <td>${item.Title}</td>
        </tr>
        `;
      })

    }
    else {
      htmlString += "No Records Found";

    }
    htmlString += `</tbody><table>`;
    const listContainer: Element = this.domElement.querySelector('#tblbody');
    listContainer.innerHTML = htmlString;

  }

  private _getItemEntityType(): Promise<string> {
    const endpoint: string = this.context.pageContext.web.absoluteUrl + `/_api/web/lists/getbyTitle('TestList')/ListItemEntityTypeFullName`;
    return this.context.spHttpClient.get(endpoint, SPHttpClient.configurations.v1).then(response => {
      return response.json();
    }).then(jsonResponse => {
      return jsonResponse.ListItemEntityTypeFullName;
    }) as Promise<string>
  }

  private _getListItems(): Promise<ISPListItem[]> {
    const endpoint: string = this.context.pageContext.web.absoluteUrl + `/_api/web/lists/getbyTitle('TestList')/items?$select=Title,Id`;

    return this.context.spHttpClient.get(endpoint, SPHttpClient.configurations.v1).then(response => {
      return response.json();
    }).then(jsonResponse => {
      return jsonResponse.value;
    }) as Promise<ISPListItem[]>

  }

  private _createListItem(title: string): Promise<SPHttpClientResponse> {
    const endpoint: string = this.context.pageContext.web.absoluteUrl + `/_api/web/lists/getbyTitle('TestList')/items`;

    return this._getItemEntityType().then(spEntityType => {
      const request: any = {};
      request.body = JSON.stringify({
        Title: title,
        '@odata.type': spEntityType
      });
      return this.context.spHttpClient.post(endpoint, SPHttpClient.configurations.v1, request);
    });

  }

  private _updateListItem(itemid: string, title: string): Promise<SPHttpClientResponse> {

    const endpoint: string = this.context.pageContext.web.absoluteUrl + `/_api/web/lists/getbyTitle('TestList')/items(${itemid})`;

    return this.context.spHttpClient.get(endpoint, SPHttpClient.configurations.v1).
      then(response => {
        return response.json();
      }).
      then((listItem: ISPListItem) => {

        listItem.Title = title;
        const request: any = {};
        request.headers = {
          'X-Http-Method': 'MERGE',
          'IF-MATCH': (listItem as any)['@odata.etag']
        };
        request.body = JSON.stringify(listItem);

        const urlString: string = this.context.pageContext.web.absoluteUrl + `/_api/web/lists/getbyTitle('TestList')/items(${listItem.Id})`;

        return this.context.spHttpClient.post(urlString, SPHttpClient.configurations.v1, request);
      });


  }

  private _deleteListItem(itemid: string): Promise<SPHttpClientResponse> {
    const endpoint: string = this.context.pageContext.web.absoluteUrl + `/_api/web/lists/getbyTitle('TestList')/items(${itemid})`;
    const request: any = {};
    request.headers = {
      'X-Http-Method': 'DELETE',
      'IF-MATCH': '*'
    };
    return this.context.spHttpClient.post(endpoint, SPHttpClient.configurations.v1, request);

  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
