import { CreateWorkitemRequestFieldValueList } from "@alicloud/devops20210625";
import { QuickPickItem } from "vscode";
import YunxiaoClient from "./client";
import { MultiStepInput } from "./components/multiStepInput";
import { getAliyunId, getOrganizationId } from "./extension";
import { getWorkItemTypeIdentifier } from "./workitem";

export async function createWorkItem(client: YunxiaoClient) {
    const title = "创建云效工作项";
    const workItemTypes = [{ label: "需求", description: "Req" }, { label: "任务", description: "Task" }, { label: "缺陷", description: "Bug" }];
    const organizationId = getOrganizationId();
    const aliyunId = getAliyunId();
    if (!organizationId || !aliyunId) {
        return;
    }
    interface QuickPickState {
        title: string;
        step: number;
        totalSteps: number;
        project: QuickPickItem; // 所属的项目
        subject: string;
        description: string;
        category: string; // 工作项类型：Task/Req/Bug
        workItemType: string; // 工作项小类型
    }

    // 开始多步Input
    async function collectInputs() {
        const state = {} as Partial<QuickPickState>;
        await MultiStepInput.run(input => chooseProject(input, state));
        return state as QuickPickState;
    }
    async function chooseProject(input: MultiStepInput, state: Partial<QuickPickState>) {
        if (!organizationId) {
            return;
        }
        let projects = await client.listProjects(organizationId);
        let items: QuickPickItem[] = [];
        projects.forEach(p => {
            if (p.name) {
                items.push({
                    label: p.name,
                    description: p.identifier,
                });
            }
        });
        state.project = await input.showQuickPick({
            title,
            step: 1,
            totalSteps: 4,
            items: items,
            placeholder: "选择工作项所属项目",
            validate: validateInputIsEmpty,
            shouldResume: shouldResume
        });
        return (input: MultiStepInput) => chooseWorkItemType(input, state);
    }

    async function chooseWorkItemType(input: MultiStepInput, state: Partial<QuickPickState>) {
        let type = await input.showQuickPick({
            title,
            step: 2,
            totalSteps: 4,
            items: workItemTypes,
            placeholder: "选择工作项类型",
            validate: validateInputIsEmpty,
            shouldResume: shouldResume
        });
        state.category = type.description;
        state.workItemType = getWorkItemTypeIdentifier(type.description);

        return (input: MultiStepInput) => inputSubject(input, state);
    }

    async function inputSubject(input: MultiStepInput, state: Partial<QuickPickState>) {
        state.subject = await input.showInputBox({
            title,
            step: 3,
            totalSteps: 4,
            value: '',
            prompt: "输入工作项标题",
            validate: validateInputIsEmpty,
            shouldResume: shouldResume
        });
        return (input: MultiStepInput) => inputDescription(input, state);
    }

    async function inputDescription(input: MultiStepInput, state: Partial<QuickPickState>) {
        state.description = await input.showInputBox({
            title,
            step: 4,
            totalSteps: 4,
            value: '',
            prompt: "输入工作项描述",
            validate: dontValidateInputIsEmpty,
            shouldResume: shouldResume
        });
    }

    function shouldResume() {
        return new Promise<boolean>((resolve, reject) => {
        });
    }

    async function validateInputIsEmpty(inputStr: string) {
        return inputStr === '' ? 'input is empty' : undefined;
    }

    async function dontValidateInputIsEmpty(inputStr: string) {
        return undefined;
    }

    const state = await collectInputs();
    let defaultFieldValueList: CreateWorkitemRequestFieldValueList[] = [new CreateWorkitemRequestFieldValueList({
        fieldIdentifier: "priority",
        value: "4e3221ee4299cca11772b3c147",
    })];
    if (!state.project.description) {
        state.project.description = "";
    }
    return await client.createWorkItem(organizationId, state.project.description, aliyunId, state.category, state.workItemType, state.subject, state.description, defaultFieldValueList);
}