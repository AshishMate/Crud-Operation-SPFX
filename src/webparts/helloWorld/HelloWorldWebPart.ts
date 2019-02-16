import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneCheckbox,
  PropertyPaneDropdown,
  PropertyPaneToggle
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './HelloWorldWebPart.module.scss';
import * as strings from 'HelloWorldWebPartStrings';
import{ SPComponentLoader } from '@microsoft/sp-loader';

import * as jQuery from "jquery";
import * as bootstrap from "bootstrap";
SPComponentLoader.loadCss('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css');

//require('../../../node_modules/bootstrap/dist/css/bootstrap.min.css');
//import 'jquery';
//require('bootstrap');




export interface IHelloWorldWebPartProps {
   description: string;
   test: string;
   test1: boolean;
   test2: string;
   test3: boolean;
}

export default class HelloWorldWebPart extends BaseClientSideWebPart<IHelloWorldWebPartProps> {
  public constructor(){
  super();
  

  }

  public render(): void {
    //D:\WSSCC\SPFX\helloworld-webpart\node_modules\bootstrap\dist\css\bootstrap.min.css
    //let cssURL = "../node_modules/bootstrap/dist/css/bootstrap.min.css";
   //SPComponentLoader.loadCss(cssURL);
   
    //this.domElement.innerHTML = require("./Views/Temp.html");

    this.domElement.innerHTML=require("./Views/Temp.html");
    
    //require("./Views/Temp.html");
    
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
                  label: 'description'
                }),
                PropertyPaneTextField('test',{
                  label:'Multi-line text field',
                  multiline:true
                }),
                PropertyPaneCheckbox('test1', {
                  text: 'Checkbox'
                }),
                PropertyPaneDropdown('test2', {
                  label: 'Dropdown',
                  options: [
                    { key: '1', text: 'One' },
                    { key: '2', text: 'Two' },
                    { key: '3', text: 'Three' },
                    { key: '4', text: 'Four' }
                  ]}),
                PropertyPaneToggle('test3', {
                  label: 'Toggle',
                  onText: 'On',
                  offText: 'Off'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
