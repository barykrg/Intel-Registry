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
		let data = JSON.parse(fs.readFileSync("src/file.json", 'utf-8'));
		//console.log(data);
		let current=this.getString();
		//return element?Promise.resolve([]):Promise.resolve(this.generate());
		for(let i of current)
		{
			if(i.toLowerCase().startsWith('openvino/ubuntu18_data_dev'))
			{
				images.push(new Dependency(i,'Image','.',[
					new Dependency('c','','.',this.cSamples()),
					new Dependency('cpp','','.',this.cppSamples()),
					new Dependency('python','','.',this.pythonSamples()),
					new Dependency('Documentation','Documentation')
					
				]));
			}
		}
		//return element!==undefined?Promise.resolve(element.children):Promise.resolve(images);
		return element!==undefined?element.children:images;
	}
	cSamples():Dependency[]|undefined{  
		const csamples:Dependency[] = [];
		
		child.exec(`docker run openvino/ubuntu18_data_dev ls -F /opt/intel/openvino/inference_engine/samples/c`,(error,stdout,stderr)=>{
			if(error)
			{
				return undefined;
			}
			//console.log(stdout);
			let arr:string[] = stdout.split('\n').filter((item)=>{
				return item.endsWith('/');
			});
			for(let sample of arr)
			{
				csamples.push(new Dependency(sample.substr(0,sample.length-1),"program",'c'));
			}
		});
		return csamples;
	}

	cppSamples():Dependency[]|undefined{  
		const cppsamples:Dependency[] = [];
		
		child.exec(`docker run openvino/ubuntu18_data_dev ls -F /opt/intel/openvino/inference_engine/samples/cpp`,(error,stdout,stderr)=>{
			if(error)
			{
				return undefined;
			}
			let arr:string[] = stdout.split('\n').filter((item)=>{
				return item.endsWith('/');
			});
			for(let sample of arr)
			{
				cppsamples.push(new Dependency(sample.substr(0,sample.length-1),"program",'cpp'));
			}
		});
		return cppsamples;
	}
	pythonSamples():Dependency[]|undefined{  
		const pythonsamples:Dependency[] = [];
		
		child.exec(`docker run openvino/ubuntu18_data_dev ls -F /opt/intel/openvino/inference_engine/samples/c`,(error,stdout,stderr)=>{
			if(error)
			{
				return undefined;
			}
			let arr:string[] = stdout.split('\n').filter((item)=>{
				return item.endsWith('/');
			});
			for(let sample of arr)
			{
				pythonsamples.push(new Dependency(sample.substr(0,sample.length-1),"program",'python'));
			}
		});
		return pythonsamples;
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
			//vscode.window.showInformationMessage(folderpath);
			vscode.workspace.updateWorkspaceFolders(0,0,{uri:vscode.Uri.file(folderpath)});
			let term = vscode.window.createTerminal("Docker Shell");
			term.show(true);
			term.sendText(`docker rm -f work`);
			term.sendText(`docker run -it --name work -u 0 --rm --mount type=bind,source="${folderpath}",target=/tmp ${item.label}`,true);
		})
		.then(undefined,err =>{vscode.window.showErrorMessage("Error while opening the folder"); return;});
	}
	public add(item:Dependency)
	{
		//vscode.window.showInformationMessage(`docker exec work cp -r /opt/intel/openvino/inference_engine/samples/${item.parents}/${item.label} /opt/intel/openvino/myDir/${item.label}`);
		child.exec(`docker exec work cp -r /opt/intel/openvino/inference_engine/samples/${item.parents}/${item.label} /opt/intel/openvino/myDir/${item.parents}`,(error)=>{
			if(error)
			{
				vscode.window.showErrorMessage("Please create development environment first");
				return;
			}
		});
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
	private getString():string[]{
		return child.execSync(`docker images --format "{{.Repository}}"`,{encoding:"utf8"}).split('\n');
		//return "";
	}
	private getImage()
	{
		var data2 = JSON.parse(fs.readFileSync("/home/barun/intelregistry/src/image.json", 'utf-8'));
		//console.log(data2);
		return data2;
	}

}

export class Dependency extends vscode.TreeItem {
	children : Dependency[]|undefined;
	constructor(
		//public readonly name:string,
		public readonly label: string,
		//public readonly samples:string[],
		//public readonly documentation,
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
