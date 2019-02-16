import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './SpGetDataWebPart.module.scss';
import * as strings from 'SpGetDataWebPartStrings';
import {
  SPHttpClient,
  SPHttpClientResponse,
  SPHttpClientConfiguration
} from '@microsoft/sp-http';
import {
  Environment,
  EnvironmentType
} from '@microsoft/sp-core-library';
import { SPComponentLoader } from '@microsoft/sp-loader';
import * as jQuery from "jquery";
import * as bootstrap from "bootstrap";
SPComponentLoader.loadCss('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css');
import mockHttpClient from './mockHttpClient';

export interface ISpGetDataWebPartProps {
  description: string;
}
export interface ISPLists {
  value: ISPList[];
}
export interface ISPList {
  Title: string;
  Id: string;
}

export default class SpGetDataWebPart extends BaseClientSideWebPart<ISpGetDataWebPartProps> {

  public render(): void {
    //let cssURL = "../node_modules/bootstrap/dist/css/bootstrap.min.css";
    //SPComponentLoader.loadCss(cssURL);
    //SPComponentLoader.loadCss('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css');
    this.domElement.innerHTML = `
    <div class='jumbotron'>
      <div class="container">
      <h2>SharePoint List Data</h2>
        <div id="spListContainer" />
        </div>
        </div>
      `;

    this._renderListAsync();
  }

  private _getListData(): Promise<ISPLists> {

    return this.context.spHttpClient.get(this.context.pageContext.web.absoluteUrl + `/_api/web/lists/getByTitle('TestList')/items?$select=Title,Description&$top=100`, SPHttpClient.configurations.v1).
      then((respone: SPHttpClientResponse) => {
        return respone.json();
      });

  }
  private _getMockListData(): Promise<ISPLists> {
    return mockHttpClient.get()
      .then((data: ISPList[]) => {
        var listData: ISPLists = { value: data };
        return listData;
      }) as Promise<ISPLists>;
  }
  private _renderList(items: ISPList[]): void {
    let html: string = '';
    items.forEach((item: ISPList) => {
      html += `
      
    <ul class="list-group">
      <li class="list-group-item">
        ${item.Title}
      </li>
    </ul>
    
    `;
    });

    const listContainer: Element = this.domElement.querySelector('#spListContainer');
    listContainer.innerHTML = html;
  }
  private _renderListAsync(): void {
    // Local environment
    if (Environment.type === EnvironmentType.Local) {
      this._getMockListData().then((response) => {
        this._renderList(response.value);
      });
    } else if (Environment.type == EnvironmentType.SharePoint ||
      Environment.type == EnvironmentType.ClassicSharePoint) {
      this._getListData()
        .then((response) => {
          this._renderList(response.value);
        });
    }

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
