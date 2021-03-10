import * as vscode from 'vscode';
import * as fs from 'fs';
import * as child from 'child_process'; 
import * as inputs from './inputs';

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

	getChildren(element?: Dependency): vscode.ProviderResult<Dependency[]>{
		
		const images:Dependency[]=[];
		images.push(new Dependency("","Reference Implementation","","",this.getRI()));
		images.push(new Dependency("","Sdks","","",this.getdks()));
		return element===undefined?images:element.children;

	}
	getdks():Dependency[]|undefined
	{
		let data = inputs.global;
		const sdks:Dependency[]=[];
		for(let sd of data.sdk)
		{
			sdks.push(new Dependency(sd.name,sd.label,sd.documentation,"Image"));
		}
		return sdks.length===0?undefined:sdks;
	}
	getRI():Dependency[]|undefined
	{
		let data = inputs.global;
		const ris:Dependency[]=[];
		let map = new Map();
		for(let ri of data.reference_Implementations)
		{
			if(!map.has(ri.name.en))
			{
				map.set(ri.name.en,[ri.image]);
			}
			else
			{
				map.set(ri.name.en,map.get(ri.name.en).concat([ri.image]));
			}
		}
		for(let i of map.keys())
		{
			let risImage:Dependency[]=[];
			ris.push(new Dependency(map.get(i).join(","),i,"https://www.google.com","Image"));
		}
		return ris.length===0?undefined:ris;
	}
	public pull(item:Dependency)
	{
		//vscode.window.showInformationMessage(item.buildCommand);
		//vscode.window.showInformationMessage(`docker pull ${item.name}`);
		if(item.name.split(',').length>1)
		{
			vscode.window.showInformationMessage(`This is a dummy Pull of ${item.name}`);
			return;
		}
		child.exec(`docker pull ${item.name}`,(error)=>{
			if(error)
			{
				vscode.window.showErrorMessage("Error while getting the application");
				return;
			}
			vscode.window.showInformationMessage(`${item.label} pull successfull`);
		});
	}
	public readme(item:Dependency)
	{
		vscode.env.openExternal(vscode.Uri.parse(item.documentation));
	}

}

export class Dependency extends vscode.TreeItem {
	children : Dependency[]|undefined;
	constructor(
		public readonly name :string,
		public readonly label: string,
		public readonly documentation:string,
		public readonly contextValue:string,
		children?:Dependency[]
	) {
		super(label,
			children===undefined ? vscode.TreeItemCollapsibleState.None:vscode.TreeItemCollapsibleState.Collapsed
			);
			this.children = children;

	}

}
