import type * as O from 'ontodia'
import {rdfs, schema} from '@tpluscode/rdf-ns-builders';

export class RdfjsProvider implements O.DataProvider {
    async classInfo(params: { classIds: O.ElementTypeIri[] }): Promise<O.ClassModel[]> {
        return [];
    }

    async classTree(): Promise<O.ClassModel[]> {
        return [{
            id: schema.Person,
            count: 1,
            label: {
                values: [{
                    value: 'Person', language: 'en',
                }]
            },
            children: [],
        }];
    }

    async elementInfo(params: { elementIds: O.ElementIri[] }): Promise<O.Dictionary<O.ElementModel>> {
        return {};
    }

    async filter(params: O.FilterParams): Promise<O.Dictionary<O.ElementModel>> {
        return {};
    }

    async linkElements(params: O.LinkElementsParams): Promise<O.Dictionary<O.ElementModel>> {
        return {};
    }

    async linkTypes(): Promise<O.LinkType[]> {
        return [];
    }

    async linkTypesInfo(params: { linkTypeIds: O.LinkTypeIri[] }): Promise<O.LinkType[]> {
        return [];
    }

    async linkTypesOf(params: { elementId: O.ElementIri }): Promise<O.LinkCount[]> {
        return [];
    }

    async linksInfo(params: { elementIds: O.ElementIri[]; linkTypeIds: O.LinkTypeIri[] }): Promise<O.LinkModel[]> {
        return [];
    }

}
