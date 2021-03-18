import * as vscode from 'vscode';
import * as fs from 'fs';
import * as child from 'child_process';
import * as inputs from './inputs';
import * as path from 'path';
import { stderr, stdout } from 'process';

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
		const sdks = this.getsdks();
		const ris = this.getris();

		
		images.push(new Dependency("Reference Implementation","ris",{},ris));
		images.push(new Dependency("Sdks","sdks",{},sdks));
		
		return element===undefined?images:element.children;
	}
	runDemo(item:Dependency)
	{
		let term =vscode.window.createTerminal("Demo");
		term.show(true);
		term.sendText(item.metaData.documentation);
	}
	getris():Dependency[]
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
			for(let j of map.get(i))
			{
				risImage.push(new Dependency(j,"risimage"));
			}
			ris.push(new Dependency(i,"image",{},[...risImage]));
		}
		return ris;
	}
	getsdks():Dependency[]
	{
		let data = inputs.global;
		let sdks:Dependency[]=[];
		let onSystem = new Set(this.getString());
		for(let i of data.sdk)
		{
			if(onSystem.has(i.name))
			{
				let sdksSampleFolder:Dependency[]=[];
				for(let j of i.samples)
				{
					let sdksSample:Dependency[]=[];
					for(let k of this.getSamples(i.name,j))
					{
						
						sdksSample.push(new Dependency(k.substr(k.lastIndexOf('/')+1),
						"sample",
						{documentation:"",path:k,name:i.label}));
					}
					sdksSampleFolder.push(new Dependency(j.substr(j.lastIndexOf('/')+1),"sampleFolder",{},[...sdksSample]));
				}
				let sdksDemoFolder:Dependency[]=[];
				let sdksSampleDirectory:Dependency[]=[];
				let sdksDemo:Dependency[]=[];
				for(let j of i.demos)
				{
					sdksDemo.push(new Dependency(j.name,"demo",{documentation:j.command}));
				}
				sdksDemoFolder.push(new Dependency("Demos","demoFolder",{},[...sdksDemo]));
				sdksSampleDirectory.push(new Dependency("Samples","sampleFolder",{},[...sdksSampleFolder]));
				sdksDemoFolder=sdksDemoFolder.concat(sdksSampleDirectory);
				sdks.push(new Dependency(i.label,"image",{documentation:i.documentation,path:"",name:i.name},[...sdksDemoFolder]));
			}
		}
		return sdks;
	}
	 getSamples(name:string,path:string):string[]
	{
		if(path.length===0) return [];
		const m = {"c":["common","hello_classification","hello_nv12_input_classification","object_detection_sample_ssd"],"cpp":["benchmark_app","classification_sample_async","common","hello_classification","hello_nv12_input_classification","hello_reshape_ssd"],"python":["classification_sample_async","hello_classification","hello_query_device","object_detection_sample_ssd","ngraph_function_creation_sample"]};
		 //let test = child.execSync(`docker run --rm ${name} ls -F ${path}`);
		 
		 /*
		 let arr:string []= test.toString().split('\n').filter((item)=>{
				return item.endsWith('/');
			});
		arr = arr.map((data)=> {return path+"/"+data.slice(0,-1);});
		console.log(arr);
		return arr;
		*/
		let parent = path.substr(path.lastIndexOf('/')+1);
		let arr = m[parent].map((data)=>{ return path+"/"+data});
	
		return arr;

	}
	
	public createEnvironment(item:Dependency)
	{
		if(item.metaData.name===undefined)
		{
			vscode.window.showInformationMessage(`Running ${item.label}`);
			return;
		}
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
			//console.log(`docker run -it --name ${item.label} -u 0 --rm --mount type=bind,source="${folderpath}",target=/tmp ${item.metaData.name}`);
			term.sendText(`docker run -it --name ${item.label} -u 0 --rm --mount type=bind,source="${folderpath}",target=/tmp ${item.metaData.name}`,true);
		})
		.then(undefined,err =>{vscode.window.showErrorMessage("Error while opening the folder"); return;});
	}
	public add(item:Dependency)
	{	
		child.exec(`docker exec ${item.metaData.name} cp -r ${item.metaData.path} /tmp`,(error)=>{
			if(error)
			{
				vscode.window.showErrorMessage("Please create development environment first");
				return;
			}
		});
	}
	
	private getString():string[]{
		return child.execSync(`docker images --format "{{.Repository}}"`,{encoding:"utf8"}).split('\n');
	}

}

export class Dependency extends vscode.TreeItem {
	children : Dependency[]|undefined;
	constructor(
		public readonly label: string,
		public readonly contextValue:string,
		public metaData ?: {documentation?:string,path?:string,name?:string},
		children?:Dependency[]
		
		
	) {
		super(label,
			children===undefined ? vscode.TreeItemCollapsibleState.None:vscode.TreeItemCollapsibleState.Collapsed
			);
			this.children = children;
		

	}
	iconPath = (this.contextValue=="samples"||this.contextValue=="risimage"||this.contextValue=="demo")?path.join(__filename,'..',"..",'media','package.svg'):
	path.join(__filename,'..',"..",'media','folder.svg');

}


