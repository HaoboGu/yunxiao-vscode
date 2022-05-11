import * as vscode from "vscode";
import YunxiaoClient from './client';
import { login } from './login';
import { YunxiaoWorkitemProvider } from './workitemProvider';

export function activate(context: vscode.ExtensionContext) {
	vscode.commands.executeCommand('setContext', 'yunxiao.statusWithNext', [
		"待处理",
		"待修复",
		"再次打开",
		"处理中",
		"开发中",
		"测试中",
		"设计中",
		"暂不修复",
		"已取消"
	]);

	vscode.commands.executeCommand('setContext', 'yunxiao.statusWithPrev', [
		"再次打开",
		"处理中",
		"开发中",
		"测试中",
		"设计中",
		"暂不修复",
		"已取消",
		"已修复",
		"已完成"
	]);

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
	let setOrganizationIdCmd = vscode.commands.registerCommand('yunxiao.setOrganizationId', () => { });
	let nextStateCmd = vscode.commands.registerCommand('yunxiao.nextState', () => { });
	let prevStateCmd = vscode.commands.registerCommand('yunxiao.prevState', () => { });

	context.subscriptions.push(loginCmd, refreshTreeCmd, createWorkItemCmd, setOrganizationIdCmd, prevStateCmd, nextStateCmd);
}

// this method is called when your extension is deactivated
export function deactivate() { }
