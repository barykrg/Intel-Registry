'use strict';

import { pathToFileURL } from 'url';
import * as vscode from 'vscode';

import * as cataloguetree from './cataloguetree';

import * as installedapplicationtree from './imagetree'

export function activate(context: vscode.ExtensionContext) {

	console.log(context.extensionPath);
	let path=vscode.Uri.joinPath(vscode.Uri.parse(context.extensionPath),"media");
	console.log(path.toString());
	const catalogueImages = new cataloguetree.DepNodeProvider();
	vscode.window.createTreeView('catalog',{treeDataProvider:catalogueImages});
	//vscode.window.registerTreeDataProvider('catalog', catalogueImages);
	vscode.commands.registerCommand('intelregistry.refreshcatalogue', () => catalogueImages.refresh());
	vscode.commands.registerCommand('intelregistry.pull', (item:cataloguetree.Dependency) => catalogueImages.pull(item));
	vscode.commands.registerCommand('intelregistry.readme', (item:cataloguetree.Dependency) => catalogueImages.readme(item));
	vscode.commands.registerCommand('intelregistry.login', (item:cataloguetree.Dependency) => catalogueImages.logon(item));



	const downloadedImages = new installedapplicationtree.DepNodeProvider();
	vscode.window.createTreeView('installedApplication', {treeDataProvider:downloadedImages});
	//vscode.window.registerTreeDataProvider('installedApplication', downloadedImages);
	vscode.commands.registerCommand('intelregistry.refreshdownload', () => downloadedImages.refresh());
	vscode.commands.registerCommand('intelregistry.createEnvironment',(item:installedapplicationtree.Dependency)=>downloadedImages.createEnvironment(item));
	vscode.commands.registerCommand('intelregistry.add', (item:installedapplicationtree.Dependency) => downloadedImages.add(item));
	vscode.commands.registerCommand('intelregistry.runDemo', (item:installedapplicationtree.Dependency) => downloadedImages.runDemo(item));
}