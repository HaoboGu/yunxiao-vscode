import * as vscode from "vscode";
import YunxiaoClient from './client';
import { login, setOrganizationId } from './login';
import WorkItem from "./workitem";
import { YunxiaoWorkitemProvider } from './workItemProvider';
import { nextState, prevState } from "./workItemState";

export let provider: YunxiaoWorkitemProvider;
export let apiClient: YunxiaoClient;
export let currentOrgId: string;
export function activate(context: vscode.ExtensionContext) {
	// Set context for package.json
	vscode.commands.executeCommand('setContext', 'yunxiao.statusWithNext', [
		"待处理",
		"待修复",
		"再次打开",
		"处理中",
		"开发中",
		"测试中",
		"设计中",
		"暂不修复",
		"已修复",
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
		"已完成",
		"已关闭"
	]);

	// login command
	let loginCmd = vscode.commands.registerCommand('yunxiao.login', async () => {
		let credential = await login(context);
		if (credential) {
			initializeYunxiaoWorkItemTree(credential.accessKeyId, credential.accessKeySecret, credential.organizationId);
		}
	});

	// Create yunxiao work item tree
	createYunxiaoView(context);

	// Commands
	let refreshTreeCmd = vscode.commands.registerCommand('yunxiao.refreshTree', () => {
		if (provider) {
			provider.refresh();
		}
	});
	let createWorkItemCmd = vscode.commands.registerCommand('yunxiao.createWorkItem', () => { });
	let setOrganizationIdCmd = vscode.commands.registerCommand('yunxiao.setOrganizationId', async () => {
		await setOrganizationId();
		createYunxiaoView(context);
	});
	let nextStateCmd = vscode.commands.registerCommand('yunxiao.nextState', async (workItem: WorkItem) => {
		let result = await nextState(workItem);
		if (result) {
			workItem.update(result);
			provider.refreshItem(workItem);
		}
	});
	let prevStateCmd = vscode.commands.registerCommand('yunxiao.prevState', async (workItem: WorkItem) => {
		let result = await prevState(workItem);
		if (result) {
			workItem.update(result);
			provider.refreshItem(workItem);
		}
	});

	context.subscriptions.push(loginCmd, refreshTreeCmd, createWorkItemCmd, setOrganizationIdCmd, prevStateCmd, nextStateCmd);
}

export function deactivate() { }

function createYunxiaoView(context: vscode.ExtensionContext) {
	// Auto-login using stored info
	let accessKeyId: string | undefined = context.globalState.get("yunxiao.accessKeyId");
	let accessKeySecret: string | undefined = context.globalState.get("yunxiao.accessKeySecret");
	if (accessKeyId && accessKeySecret) {
		let organizationId: string | undefined = vscode.workspace.getConfiguration().get("yunxiao.organizationId");
		if (organizationId) {
			currentOrgId = organizationId;
			initializeYunxiaoWorkItemTree(accessKeyId, accessKeySecret, organizationId);
		} else {
			vscode.window.showErrorMessage("请使用setOrganizationId命令设置云效企业ID");
		}
	} else {
		vscode.window.showErrorMessage("请正确设置云效登录信息");
	}
}

function initializeYunxiaoWorkItemTree(accessKeyId: string, accessKeySecret: string, organizationId: string) {
	apiClient = new YunxiaoClient(accessKeyId, accessKeySecret);
	provider = new YunxiaoWorkitemProvider(organizationId);
	vscode.window.registerTreeDataProvider('yunxiao-workitems', provider);
	provider.refresh();
}
