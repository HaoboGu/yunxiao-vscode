import * as vscode from "vscode";
import { MultiStepInput } from './components/multiStepInput';

export async function login(context: vscode.ExtensionContext) {
    const title = "设置yunxiao-vscode";
    interface QuickPickState {
        title: string;
        step: number;
        totalSteps: number;
        accessKeyId: string;
        accessKeySecret: string;
        organizationId: string;
        aliyunId: string;
    }

    // 开始多步Input
    async function collectInputs() {
        const state = {} as Partial<QuickPickState>;
        await MultiStepInput.run(input => setAliyunAK(input, state));
        return state as QuickPickState;
    }

    async function setAliyunAK(input: MultiStepInput, state: Partial<QuickPickState>) {
        state.accessKeyId = await input.showInputBox({
            title,
            step: 1,
            totalSteps: 4,
            value: '',
            prompt: "输入阿里云AK",
            validate: validateInputIsEmpty,
            shouldResume: shouldResume
        });
        // Return next step
        return (input: MultiStepInput) => setAliyunSK(input, state);
    }

    async function setAliyunSK(input: MultiStepInput, state: Partial<QuickPickState>) {
        state.accessKeySecret = await input.showInputBox({
            title,
            step: 2,
            totalSteps: 4,
            value: '',
            prompt: "输入阿里云SK",
            validate: validateInputIsEmpty,
            shouldResume: shouldResume
        });
        // Return next step
        return (input: MultiStepInput) => setOrganizationId(input, state);
    }

    async function setOrganizationId(input: MultiStepInput, state: Partial<QuickPickState>) {
        state.organizationId = await input.showInputBox({
            title,
            step: 3,
            totalSteps: 4,
            value: '',
            prompt: "输入云效企业ID",
            validate: validateInputIsEmpty,
            shouldResume: shouldResume
        });
        return (input: MultiStepInput) => setAliyunId(input, state);
    }

    async function setAliyunId(input: MultiStepInput, state: Partial<QuickPickState>) {
        state.aliyunId = await input.showInputBox({
            title,
            step: 4,
            totalSteps: 4,
            value: '',
            prompt: "输入你的阿里云ID",
            validate: validateInputIsEmpty,
            shouldResume: shouldResume
        });
    }

    function shouldResume() {
        return new Promise<boolean>((resolve, reject) => {
        });
    }

    async function validateInputIsEmpty(inputStr: string) {
        return inputStr === '' ? 'input	 is empty' : undefined;
    }

    const state = await collectInputs();

    // save AK to global state, then create and register work item tree provider
    if (!state.accessKeyId || !state.accessKeySecret) {
        vscode.window.showErrorMessage("请正确设置阿里云AK/SK");
        return;
    }
    if (!state.organizationId) {
        vscode.window.showErrorMessage("请使用setOrganizationId命令设置云效企业ID");
        return;
    }
    if (!state.aliyunId) {
        vscode.window.showErrorMessage("请使用setAliyunId命令设置阿里云ID");
        return;
    }

    context.globalState.update("yunxiao.accessKeyId", state.accessKeyId);
    context.globalState.update("yunxiao.accessKeySecret", state.accessKeySecret);
    vscode.workspace.getConfiguration().update("yunxiao.organizationId", state.organizationId, vscode.ConfigurationTarget.Global);
    vscode.workspace.getConfiguration().update("yunxiao.aliyunId", state.aliyunId, vscode.ConfigurationTarget.Global);
    return {
        accessKeyId: state.accessKeyId,
        accessKeySecret: state.accessKeySecret,
        organizationId: state.organizationId,
        aliyunId: state.aliyunId,
    };
}

export async function setOrganizationId() {
    let organizationId = await vscode.window.showInputBox({
        title: "输入云效企业ID",
        value: '',
        ignoreFocusOut: true,
    });
    if (organizationId) {
        vscode.workspace.getConfiguration().update("yunxiao.organizationId", organizationId, vscode.ConfigurationTarget.Global);
    } else {
        vscode.window.showErrorMessage("请输入正确的云效企业ID");
    }
}

export async function setAliyunId() {
    let aliyunId = await vscode.window.showInputBox({
        title: "输入你的阿里云ID",
        value: '',
        ignoreFocusOut: true,
    });
    if (aliyunId) {
        vscode.workspace.getConfiguration().update("yunxiao.aliyunId", aliyunId, vscode.ConfigurationTarget.Global);
    } else {
        vscode.window.showErrorMessage("请输入正确的阿里云ID");
    }
}