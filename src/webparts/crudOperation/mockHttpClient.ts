import { ISPListItem } from "./ListItemModel";


export default class mockHttpClient{
    private static _items: ISPListItem[] = [{ Title: 'Mock List', Id: 1 },
    { Title: 'Mock List 2', Id: 2 },
    { Title: 'Mock List 3', Id: 3 }];
    public static get(): Promise<ISPListItem[]> {
        return new Promise<ISPListItem[]>((resolve) => {
                resolve(mockHttpClient._items);
            });
        }

}