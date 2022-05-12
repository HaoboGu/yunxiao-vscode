import * as vscode from "vscode";
import YunxiaoClient from "./client";
import { MultiStepInput } from './components/multiStepInput';
import { YunxiaoWorkitemProvider } from "./workItemProvider";

export async function login(context: vscode.ExtensionContext) {
    const title = "设置yunxiao-vscode";
    interface QuickPickState {
        title: string;
        step: number;
        totalSteps: number;
        accessKeyId: string;
        accessKeySecret: string;
        organizationId: string;
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
            totalSteps: 3,
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
            totalSteps: 3,
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
            totalSteps: 3,
            value: '',
            prompt: "输入云效企业ID",
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
    if (state.accessKeyId && state.accessKeySecret) {
        context.globalState.update("yunxiao.accessKeyId", state.accessKeyId);
        context.globalState.update("yunxiao.accessKeySecret", state.accessKeySecret);
        if (state.organizationId) {
            // save organizationId to config
            vscode.workspace.getConfiguration().update("yunxiao.organizationId", state.organizationId, vscode.ConfigurationTarget.Global);
            return {
                accessKeyId: state.accessKeyId,
                accessKeySecret: state.accessKeySecret,
                organizationId: state.organizationId,
            };

        } else {
            vscode.window.showErrorMessage("请使用setOrganizationId命令设置云效企业ID");
        }
    } else {
        vscode.window.showErrorMessage("请正确设置云效登录信息");
    }
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