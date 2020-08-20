import {Workspace, WorkspaceProps} from 'ontodia';
import {RdfjsProvider} from '@zazuko/ontodia-rdfjs-provider';
import { ClassAttributes } from 'react';
import { vocabularies } from '@zazuko/rdf-vocabularies'
import * as ns from '@tpluscode/rdf-ns-builders';

async function onWorkspaceMounted(workspace: Workspace) {
    if (!workspace) {
        return;
    }

    const { schema } = await vocabularies({ only: ['schema'] })
    const dataProvider = new RdfjsProvider({
        data: schema,
        rootClass: ns.schema.Thing,
    });

    workspace.getModel().importLayout({
        dataProvider,
    });
}

export const workspaceProps: WorkspaceProps & ClassAttributes<Workspace> = {
    ref: onWorkspaceMounted
}
