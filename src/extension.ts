'use strict';

import * as vscode from 'vscode';

import * as cataloguetree from './cataloguetree';

import * as installedapplicationtree from './imagetree'

export function activate(context: vscode.ExtensionContext) {

	const catalogueImages = new cataloguetree.DepNodeProvider();
	vscode.window.registerTreeDataProvider('catalog', catalogueImages);
	vscode.commands.registerCommand('intelregistry.refreshcatalogue', () => catalogueImages.refresh());
	vscode.commands.registerCommand('intelregistry.pull', (item:cataloguetree.Dependency) => catalogueImages.pull(item));
	vscode.commands.registerCommand('intelregistry.readme', (item:cataloguetree.Dependency) => catalogueImages.readme(item));


	const downloadedImages = new installedapplicationtree.DepNodeProvider();
	vscode.window.registerTreeDataProvider('installedApplication', downloadedImages);
	vscode.commands.registerCommand('intelregistry.refreshdownload', () => downloadedImages.refresh());
	vscode.commands.registerCommand('intelregistry.createEnvironment',(item:installedapplicationtree.Dependency)=>downloadedImages.createEnvironment(item));
	vscode.commands.registerCommand('intelregistry.add', (item:installedapplicationtree.Dependency) => downloadedImages.add(item));
	//vscode.commands.registerCommand('intelregistry.readme', (item:installedapplicationtree.Dependency) => downloadedImages.readme(item));
}