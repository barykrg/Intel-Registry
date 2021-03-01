'use strict';

import * as vscode from 'vscode';

import * as cataloguetree from './installedApplicationtree';

import * as installedapplicationtree from './containertree'

export function activate(context: vscode.ExtensionContext) {

	const catalogueImages = new cataloguetree.DepNodeProvider();
	vscode.window.registerTreeDataProvider('catalogue', catalogueImages);

	const downloadedImages = new installedapplicationtree.DepNodeProvider();
	vscode.window.registerTreeDataProvider('installedApplication', downloadedImages);


	vscode.commands.registerCommand('intelregistry.refresh', () => catalogueImages.refresh());
	vscode.commands.registerCommand('intelregistry.pull', () => catalogueImages.refresh());
	vscode.commands.registerCommand('intelregistry.run', () => catalogueImages.refresh());
	vscode.commands.registerCommand('intelregistry.remove', () => catalogueImages.refresh());
}