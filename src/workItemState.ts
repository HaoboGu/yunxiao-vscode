import { apiClient, globalOrganizationId } from "./extension";
import WorkItem from "./workitem";
import * as vscode from "vscode";

export async function nextState(workItem: WorkItem) {
    if (workItem.status && workItem.categoryIdentifier) {
        let nextStateIdentifier = getStateIdentifier(getNextState(workItem.status, workItem.categoryIdentifier));
        if (nextStateIdentifier) {
            return await apiClient.updateWorkItemStatus(globalOrganizationId, workItem, nextStateIdentifier);
        } else {
            vscode.window.showInformationMessage("无法获取下一个工作项状态");
        }
    } else {
        vscode.window.showInformationMessage("工作项的状态为空，或分类不支持");
    }
}

export async function prevState(workItem: WorkItem) {
    if (workItem.status && workItem.categoryIdentifier) {
        let prevStateIdentifier = getStateIdentifier(getPrevState(workItem.status, workItem.categoryIdentifier));
        if (prevStateIdentifier) {
            return await apiClient.updateWorkItemStatus(globalOrganizationId, workItem, prevStateIdentifier);
        } else {
            vscode.window.showInformationMessage("无法获取前一个工作项状态");
        }
    } else {
        vscode.window.showInformationMessage("工作项的状态为空，或分类不支持");
    }
}

export function getPrevState(currentStatus: string, workItemType: string): string {
    if (workItemType === "Task") {
        switch (currentStatus) {
            case "处理中": {
                return "待处理";
            }
            case "已完成": {
                return "处理中";
            }
        }
    } else if (workItemType === "Req") {
        switch (currentStatus) {
            case "设计中": {
                return "待处理";
            }
            case "开发中": {
                return "设计中";
            }
            case "测试中": {
                return "开发中";
            }
            case "已完成": {
                return "测试中";
            }
        }
    } else if (workItemType === "Bug") {
        switch (currentStatus) {
            case "再次打开": {
                return "已修复";
            }
            case "处理中": {
                return "待修复";
            }
            case "已关闭": {
                return "再次打开";
            }
        }
    }
    return "";
}

export function getNextState(currentStatus: string, workItemType: string): string {
    if (workItemType === "Task") {
        switch (currentStatus) {
            case "待处理": {
                return "处理中";
            }
            case "处理中": {
                return "已完成";
            }
            case "已取消": {
                return "待处理";
            }
        }
    } else if (workItemType === "Req") {
        switch (currentStatus) {
            case "待处理": {
                return "设计中";
            }
            case "设计中": {
                return "开发中";
            }
            case "开发中": {
                return "测试中";
            }
            case "测试中": {
                return "已完成";
            }
            case "已取消": {
                return "待处理";
            }
        }
    } else if (workItemType === "Bug") {
        switch (currentStatus) {
            case "再次打开":
            case "待修复": {
                return "处理中";
            }
            case "处理中": {
                return "已修复";
            }
            case "已修复": {
                return "已关闭";
            }
        }
    }
    return "";
}

function getStateIdentifier(state: string): string {
    switch (state) {
        case "待处理":
            return "100005";
        case "处理中":
            return "100010";
        case "待处理":
            return "100005";
        case "设计中":
            return "156603";
        case "开发中":
            return "142838";
        case "测试中":
            return "100012";
        case "已完成":
            return "100014";
        case "已取消":
            return "141230";
        case "待确认":
            return "28";
        case "再次打开":
            return "30";
        case "已修复":
            return "29";
        case "暂不修复":
            return "31";
        case "已关闭":
            return "100085";

    }
    return "100005";
}