import {Workspace, WorkspaceProps} from 'ontodia';
import {RdfjsProvider} from '../../rdfjs-provider';
import { ClassAttributes } from 'react';

function onWorkspaceMounted(workspace: Workspace) {
    if (!workspace) {
        return;
    }

    const dataProvider = new RdfjsProvider();


    workspace.getModel().importLayout({
        dataProvider,
    });
}

export const workspaceProps: WorkspaceProps & ClassAttributes<Workspace> = {}
