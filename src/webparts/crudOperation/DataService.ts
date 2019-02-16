import { ISPListItem } from "./ListItemModel";
import { SPHttpClient,
    SPHttpClientResponse,
    SPHttpClientConfiguration } from "@microsoft/sp-http";
    import {
        BaseClientSideWebPart
      } from '@microsoft/sp-webpart-base';

export interface DataService{
 _getListItems(url:string,listName:string,context:BaseClientSideWebPart<any>):Promise<ISPListItem[]>;
 _createListItem():Promise<SPHttpClientResponse>;
_updateListItem():Promise<SPHttpClientResponse>;
_deleteListItem():Promise<SPHttpClientResponse>;

}

export class SPDataService implements DataService{
    context: any;
   
    _getListItems(url:string,listName:string,context:BaseClientSideWebPart<any>): Promise<ISPListItem[]> {
        const endpoint:string=url+`/_api/web/lists/getbyTitle('`+listName+`')/items?$select=Title,Id`;
        //context.spHttpClient
        //SPHttpClient.ge
        throw new Error("Method not implemented.");
    }    _createListItem(): Promise<SPHttpClientResponse> {
        throw new Error("Method not implemented.");
    }
    _updateListItem(): Promise<SPHttpClientResponse> {
        throw new Error("Method not implemented.");
    }
    _deleteListItem(): Promise<SPHttpClientResponse> {
        throw new Error("Method not implemented.");
    }

}