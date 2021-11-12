// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'; 
import { createJsonServerFiles } from './lib/json-server-generator';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('harToApi.generate', async () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		let editor=vscode.window.activeTextEditor;
		let content = editor?.document.getText(); 
		if (!content){
			vscode.window.showInformationMessage('No content to render!');
			return;
		} 

		vscode.window.showInformationMessage('Generating files...');
		const createAction = await createJsonServerFiles(content);
		vscode.window.showInformationMessage(createAction.message);
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
