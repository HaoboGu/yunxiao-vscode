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
            resolve(true);
        });
    }

    async function validateInputIsEmpty(inputStr: string) {
        return inputStr === '' ? 'input	 is empty' : undefined;
    }

    const state = await collectInputs();
    // save AK to global state
    context.globalState.update("yunxiao.accessKeyId", state.accessKeyId);
    context.globalState.update("yunxiao.accessKeySecret", state.accessKeySecret);
    // save organizationId to config
    vscode.workspace.getConfiguration().update("yunxiao.organizationId", state.organizationId, vscode.ConfigurationTarget.Global);
}