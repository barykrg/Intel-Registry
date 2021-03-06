import * as vscode from 'vscode';
import * as fs from 'fs';
import * as child from 'child_process';

export class DepNodeProvider implements vscode.TreeDataProvider<Dependency> {

	private _onDidChangeTreeData: vscode.EventEmitter<Dependency | undefined | void> = new vscode.EventEmitter<Dependency | undefined | void>();
	readonly onDidChangeTreeData: vscode.Event<Dependency | undefined | void> = this._onDidChangeTreeData.event;

	private map = new Map();
	constructor() {
	}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: Dependency): vscode.TreeItem {
		return element;
	}

	 getChildren(element?: Dependency): vscode.ProviderResult<Dependency[]> {
		const images:Dependency[]=[];
		images.push(new Dependency("","Sdks","","",this.getsdks()));
		
		return element!==undefined?element.children:images;
	}
	getsdks():Dependency[]|undefined
	{
		const images:Dependency[]=[];
		let data = JSON.parse(fs.readFileSync("src/file.json", 'utf-8'));
		let map = new Map();
		for(let sd of data.sdk)
		{
			map.set(sd.name,{label:sd.label,samples:sd.samples});
		}
		let current=this.getString();
		for(let i of current)
		{
			if(map.has(i))
			{
				images.push(new Dependency(i,map.get(i).label,"Image",".",this.sampleProgram(i,map.get(i).samples,map.get(i).label)));
			}
		}
		return images;
	}
	sampleProgram(image:string,path,label:string):Dependency[]|undefined{
		const samples:Dependency[]=[];
		if(path.length===0) return undefined;
		for(let i of path)
		{
			let parent:string = i["link"].substr(i["link"].lastIndexOf('/')+1);
			samples.push(new Dependency(label+","+i["link"],parent,"program"));
		}
		return samples;
	}
	
	
	public createEnvironment(item:Dependency)
	{
		vscode.window.showOpenDialog({canSelectFolders:true})
		.then(folder =>
		{
			if(folder===undefined)
			{
				vscode.window.showErrorMessage("Error while opening the folder");
				return;
			}
			let folderpath = folder[0].fsPath;
			
			vscode.workspace.updateWorkspaceFolders(0,0,{uri:vscode.Uri.file(folderpath)});
			let term = vscode.window.createTerminal("Docker Shell");
			term.show(true);
			term.sendText(`docker rm -f ${item.label}`);
			//console.log(`docker run -it --name ${item.label} -u 0 --rm --mount type=bind,source="${folderpath}",target=/tmp ${item.label}`);
			term.sendText(`docker run -it --name ${item.label} -u 0 --rm --mount type=bind,source="${folderpath}",target=/tmp ${item.name}`,true);
		})
		.then(undefined,err =>{vscode.window.showErrorMessage("Error while opening the folder"); return;});
	}
	public add(item:Dependency)
	{
		const arr = item.name.split(',');
		//console.log(arr);
		//console.log(`docker exec ${arr[0]} cp -r ${arr[1]}/${item.label} /tmp/${item.parents}`);

		console.log(`docker exec ${arr[0]} cp -r ${arr[1]} /tmp`);
		child.exec(`docker exec ${arr[0]} cp -r ${arr[1]} /tmp`,(error)=>{
			if(error)
			{
				vscode.window.showErrorMessage("Please create development environment first");
				return;
			}
		});
	}
	
	private getString():string[]{
		return child.execSync(`docker images --format "{{.Repository}}"`,{encoding:"utf8"}).split('\n');
		//return "";
	}

}

export class Dependency extends vscode.TreeItem {
	children : Dependency[]|undefined;
	constructor(
		public readonly name:string,
		public readonly label: string,
		public contextValue:string,
		public parents?:string,
		children?:Dependency[],
		
	) {
		super(label,
			children===undefined ? vscode.TreeItemCollapsibleState.None:vscode.TreeItemCollapsibleState.Collapsed
			);
			this.children = children;

	}

}
