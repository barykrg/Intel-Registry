import * as vscode from 'vscode';
import * as fs from 'fs';

export class DepNodeProvider implements vscode.TreeDataProvider<Dependency> {

	private _onDidChangeTreeData: vscode.EventEmitter<Dependency | undefined | void> = new vscode.EventEmitter<Dependency | undefined | void>();
	readonly onDidChangeTreeData: vscode.Event<Dependency | undefined | void> = this._onDidChangeTreeData.event;

	constructor() {
	}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: Dependency): vscode.TreeItem {
		return element;
	}

	getChildren(element?: Dependency): Thenable<Dependency[]> {
		
		return element?Promise.resolve([]):Promise.resolve(this.generate());

	}
	private generate():Dependency[]
	{
		const images:Dependency[]= [];
		for(var image of this.getImage())
		{
			images.push(new Dependency(image['name'],vscode.TreeItemCollapsibleState.None,"this is tooltip"));
		}
		return images;
	}
	private getImage()
	{
		var data2 = JSON.parse(fs.readFileSync("/home/barun/intelregistry/src/image.json", 'utf-8'));
		console.log(data2);
		return data2;
	}

}

export class Dependency extends vscode.TreeItem {

	constructor(
		public readonly label: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public tooltip?:string
	) {
		super(label,collapsibleState);

	}

}
