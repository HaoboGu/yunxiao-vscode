// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import YunxiaoClient from './client';
import { login } from './login';
import { YunxiaoWorkitemProvider } from './workitemProvider';
export function activate(context: vscode.ExtensionContext) {
	let loginCmd = vscode.commands.registerCommand('yunxiao.login', async () => {
		await login(context);
		let accessKeyId: string | undefined = context.globalState.get("yunxiao.accessKeyId");
		let accessKeySecret: string | undefined = context.globalState.get("yunxiao.accessKeySecret");
		if (accessKeyId && accessKeySecret) {
			let client = new YunxiaoClient(accessKeyId, accessKeySecret);
			let organizationId: string | undefined = vscode.workspace.getConfiguration("yunxiao").get("organizationId");
			if (!organizationId) {
				vscode.window.showErrorMessage("请使用setOrganizationId命令设置云效企业ID");
			} else {
				let provider: YunxiaoWorkitemProvider = new YunxiaoWorkitemProvider(client, organizationId);
				vscode.window.registerTreeDataProvider('yunxiao-workitems', provider);
				provider.refresh();
			}
		}
	});

	let accessKeyId: string | undefined = context.globalState.get("yunxiao.accessKeyId");
	let accessKeySecret: string | undefined = context.globalState.get("yunxiao.accessKeySecret");
	if (accessKeyId && accessKeySecret) {
		let client = new YunxiaoClient(accessKeyId, accessKeySecret);
		let organizationId: string | undefined = vscode.workspace.getConfiguration().get("yunxiao.organizationId");
		if (!organizationId) {
			vscode.window.showErrorMessage("请使用setOrganizationId命令设置云效企业ID");
		} else {
			let provider: YunxiaoWorkitemProvider = new YunxiaoWorkitemProvider(client, organizationId);
			vscode.window.registerTreeDataProvider('yunxiao-workitems', provider);
			provider.refresh();
		}
	}

	let refreshTreeCmd = vscode.commands.registerCommand('yunxiao.refreshTree', () => { });
	let createWorkItemCmd = vscode.commands.registerCommand('yunxiao.createWorkItem', () => { });

	context.subscriptions.push(loginCmd, refreshTreeCmd, createWorkItemCmd);
}

// this method is called when your extension is deactivated
export function deactivate() { }
