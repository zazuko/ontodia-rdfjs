import type * as O from 'ontodia'
import {rdf, rdfs} from '@tpluscode/rdf-ns-builders';
import {BlankNode, DatasetCore, Literal, NamedNode, Quad, Term} from 'rdf-js';
import TermSet from '@rdf-esm/term-set'
import TermMap from '@rdf-esm/term-map'
import $rdf from 'rdf-ext'
import clownface, { AnyContext, AnyPointer, GraphPointer } from 'clownface'
import DatasetExt from 'rdf-ext/lib/Dataset';

function toLanguage(pointer: GraphPointer<Literal>): O.LocalizedString {
    return {
        value: pointer.value,
        language: pointer.term.language
    }
}

function getLabels(element: GraphPointer) {
    return {values: element.out(rdfs.label, {language: '*'}).map(toLanguage)}
}

function getTypes(element: GraphPointer) {
    return element.in(rdf.type).map(type => type.value as O.ElementTypeIri)
}

function getProperties(element: GraphPointer<Term, DatasetExt>) {
    return [...element.dataset.match(element.term).toArray()
        .reduce((map, quad) => {
            if (!map.has(quad.predicate)) {
                map.set(quad.predicate, [])
            }
            map.get(quad.predicate)!.push(quad.object)

            return map
        }, new TermMap<Term, Term[]>()).entries()]
        .reduce<O.Dictionary<O.Property>>((props, [predicate, objects]) => {
            props[predicate.value] = {
                type: 'string',
                values: objects.map(object => {
                    return {
                        type: 'string',
                        value: object.value,
                        language: object.termType === 'Literal' ? object.language : ''
                    }
                })
            }

            return props
        }, {})
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
                    label: getLabels(clas),
                    children,
                    count: children.length,
                };
            })
        }

        return subClassesOf()
    }

    async elementInfo({elementIds}: { elementIds: O.ElementIri[] }): Promise<O.Dictionary<O.ElementModel>> {
        const els = this._pointer.namedNode(elementIds).toArray()

        return els.reduce<O.Dictionary<O.ElementModel>>((dict, element) => {
            dict[element.value] = {
                id: element.value as O.ElementIri,
                label: getLabels(element),
                types: getTypes(element),
                properties: getProperties(element)
            }

            return dict
        }, {})
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
