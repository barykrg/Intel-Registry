import * as vscode from 'vscode';
import * as fs from 'fs';
import * as child from 'child_process'; 

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
		
		//this.data=images;
		//return element?Promise.resolve([]):Promise.resolve(this.generate());
		return Promise.resolve([new Dependency('openvino','docker pull openvino/ubuntu18_data_dev')]);

	}
	private generate():Dependency[]
	{
		const images:Dependency[]= [];
		for(var image of this.getImage())
		{
			//images.push(new Dependency(image['name'],vscode.TreeItemCollapsibleState.None,"this is tooltip"));
		}
		return images;
	}
	private getImage()
	{
		var data = require("/home/barun/intelregistry/src/image.json");
		var data2 = JSON.parse(fs.readFileSync("/home/barun/intelregistry/src/image.json", 'utf-8'));
		console.log(data2);
		return data2;
	}
	public pull(item:Dependency)
	{
		//vscode.window.showInformationMessage(item.buildCommand);
		child.exec(item.buildCommand,(error)=>{
			if(error)
			{
				vscode.window.showErrorMessage("Error while getting the application");
			}
		});
	}

}

export class Dependency extends vscode.TreeItem {
	children : Dependency[]|undefined;
	constructor(
		public readonly label: string,
		public readonly buildCommand:string,
		public tooltip?:string,
		children?:Dependency[]
	) {
		super(label,
			children===undefined ? vscode.TreeItemCollapsibleState.None:vscode.TreeItemCollapsibleState.Collapsed
			);
			this.children = children;

	}

}
