import type * as O from 'ontodia'
import {rdf, rdfs, schema} from '@tpluscode/rdf-ns-builders';
import {BlankNode, DatasetCore, Literal, NamedNode, Quad} from 'rdf-js';
import TermSet from '@rdf-esm/term-set'
import $rdf from 'rdf-ext'
import clownface, {AnyContext, AnyPointer, GraphPointer, MultiPointer} from 'clownface'
import DatasetExt from 'rdf-ext/lib/Dataset';

function toLanguage(pointer: GraphPointer<Literal>): O.LocalizedString {
    return {
        value: pointer.value,
        language: pointer.term.language
    }
}

interface Options {
    data: Quad[] | DatasetCore
    rootClass?: NamedNode
}

export class RdfjsProvider implements O.DataProvider {
    private _pointer: AnyPointer<AnyContext, DatasetExt>
    private _rootClass?: GraphPointer

    constructor({ data, rootClass }: Options) {
        this._pointer = clownface({
            dataset: $rdf.dataset([...data]),
        })

        if (rootClass) {
            this._rootClass = this._pointer.node(rootClass)
        }
    }

    async classInfo(params: { classIds: O.ElementTypeIri[] }): Promise<O.ClassModel[]> {
        return [];
    }

    async classTree(): Promise<O.ClassModel[]> {
        const seen = new TermSet()

        const subClassesOf = (type: GraphPointer | undefined = this._rootClass): O.ClassModel[] => {
            let types: AnyPointer<(BlankNode | NamedNode)[]>
            if (type) {
                if (seen.has(type.term)) {
                    return []
                }

                types = this._pointer.has(rdfs.subClassOf, type)
                seen.add(type.term)
            } else {
                types = this._pointer.has(rdf.type, rdfs.Class)
            }

            return types.map((clas): O.ClassModel => {
                const children = subClassesOf(clas)

                return {
                    id: clas.value as O.ElementTypeIri,
                    label: {
                        values: clas.out(rdfs.label, {language: '*'}).map(toLanguage)
                    },
                    children,
                    count: children.length,
                };
            })
        }

        return subClassesOf()
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
