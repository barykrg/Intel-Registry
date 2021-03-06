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

	getChildren(element?: Dependency): vscode.ProviderResult<Dependency[]>{
		
		//this.data=images;
		//return element?Promise.resolve([]):Promise.resolve(this.generate());
		//let data = JSON.parse(fs.readFileSync("src/file.json", 'utf-8'));
		const images:Dependency[]=[];
		images.push(new Dependency("","Reference Implementations","","",this.getRI()));
		images.push(new Dependency("","sdks","","",this.getdks()));
		//images.push(this.getdks());
		//console.log(images);
		return element===undefined?images:element.children;

	}
	getdks():Dependency[]|undefined
	{
		let data = JSON.parse(fs.readFileSync("src/file.json", 'utf-8'));
		const sdks:Dependency[]=[];
		//console.log(data.sdk);
		for(let sd of data.sdk)
		{
			//console.log(sd.name+" "+sd.label+" "+sd.documentation);
			sdks.push(new Dependency(sd.name,sd.label,sd.documentation,"Image"));
		}
		return sdks.length===0?undefined:sdks;
	}
	getRI():Dependency[]|undefined
	{
		let data = JSON.parse(fs.readFileSync("src/file.json", 'utf-8'));
		const ris:Dependency[]=[];
		//console.log(data.sdk);
		for(let ri of data.reference_Implementations)
		{
			ris.push(new Dependency(ri.name,ri.label,ri.documentation,"Image"));
		}
		return ris.length===0?undefined:ris;
	}
	public pull(item:Dependency)
	{
		//vscode.window.showInformationMessage(item.buildCommand);
		//vscode.window.showInformationMessage(`docker pull ${item.name}`);
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
