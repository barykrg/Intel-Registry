import * as vscode from 'vscode';
import * as fs from 'fs';
import * as child from 'child_process';
import * as inputs from './inputs';
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
		//const ris = this.getris();

		images.push(new Dependency("Sdks","sdks",{},sdks));
		//images.push(new Dependency("Reference Implementation","ris",{},ris));
		
		return element===undefined?images:element.children;
	}
	runDemo(item:Dependency)
	{
		let term =vscode.window.createTerminal("Demo");
		term.show(true);
		term.sendText(item.metaData.documentation);
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
				let sdksDemo:Dependency[]=[];
				for(let j of i.demos)
				{
					sdksDemo.push(new Dependency(j.name,"demo",{documentation:j.command}));
				}
				sdksDemoFolder.push(new Dependency("Demos","DemoFolder",{},[...sdksDemo]));
				sdksDemoFolder=sdksDemoFolder.concat(sdksSampleFolder);
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
		 
		 //let test = "common/ \nhelloWorld/";
		 /*
		 let arr:string []= test.toString().split('\n').filter((item)=>{
				return item.endsWith('/');
			});
		arr = arr.map((data)=> {return path+"/"+data.slice(0,-1);});
		console.log(arr);
		return arr;
		*/
		let parent = path.substr(path.lastIndexOf('/')+1);
		//console.log(parent);
		//console.log(m[parent]);
		let arr = m[parent].map((data)=>{ return path+"/"+data});
		//console.log(arr);		
		return arr;

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
			console.log(`docker run -it --name ${item.label} -u 0 --rm --mount type=bind,source="${folderpath}",target=/tmp ${item.metaData.name}`);
			//term.sendText(`docker run -it --name ${item.label} -u 0 --rm --mount type=bind,source="${folderpath}",target=/tmp ${item.metaData.name}`,true);
		})
		.then(undefined,err =>{vscode.window.showErrorMessage("Error while opening the folder"); return;});
	}
	public add(item:Dependency)
	{
		
		
		//console.log(arr);
		//console.log(`docker exec ${arr[0]} cp -r ${arr[1]}/${item.label} /tmp/${item.parents}`);

		console.log(`docker exec ${item.metaData.name} cp -r ${item.metaData.path} /tmp`);
		/*
		child.exec(`docker exec ${arr[0]} cp -r ${arr[1]} /tmp`,(error)=>{
			if(error)
			{
				vscode.window.showErrorMessage("Please create development environment first");
				return;
			}
		});*/
	}
	
	private getString():string[]{
		return child.execSync(`docker images --format "{{.Repository}}"`,{encoding:"utf8"}).split('\n');
		//return "";
	}

}

export class Dependency extends vscode.TreeItem {
	children : Dependency[]|undefined;
	constructor(
		public readonly label: string,
		public contextValue:string,
		public metaData : {documentation?:string,path?:string,name?:string},
		children?:Dependency[]
		
	) {
		super(label,
			children===undefined ? vscode.TreeItemCollapsibleState.None:vscode.TreeItemCollapsibleState.Collapsed
			);
			this.children = children;
		

	}

}
