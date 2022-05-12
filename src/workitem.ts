import { ListWorkitemsResponseBodyWorkitems, UpdateWorkItemResponseBodyWorkitem } from "@alicloud/devops20210625";
import { TreeItem, TreeItemCollapsibleState } from "vscode";
import path = require("path");

export default class WorkItem extends TreeItem {
    assignedTo?: string;
    categoryIdentifier?: string;
    creator?: string;
    document?: string;
    gmtCreate?: number;
    gmtModified?: number;
    identifier?: string;
    logicalStatus?: string;
    modifier?: string;
    parentIdentifier?: string;
    serialNumber?: string;
    spaceIdentifier?: string;
    spaceName?: string;
    spaceType?: string;
    status?: string;
    statusIdentifier?: string;
    statusStageIdentifier?: string;
    subject?: string;
    updateStatusAt?: number;
    workitemTypeIdentifier?: string;
    constructor(rawWorkItem: ListWorkitemsResponseBodyWorkitems | UpdateWorkItemResponseBodyWorkitem) {
        if (!rawWorkItem.subject) {
            rawWorkItem.subject = "";
        }
        super(rawWorkItem.subject, TreeItemCollapsibleState.None);
        this.assignedTo = rawWorkItem.assignedTo;
        this.categoryIdentifier = rawWorkItem.categoryIdentifier; // Task/Req/Bug
        this.creator = rawWorkItem.creator;
        this.document = rawWorkItem.document;
        this.gmtCreate = rawWorkItem.gmtCreate;
        this.gmtModified = rawWorkItem.gmtModified;
        this.identifier = rawWorkItem.identifier;
        this.logicalStatus = rawWorkItem.logicalStatus;
        this.modifier = rawWorkItem.modifier;
        this.parentIdentifier = rawWorkItem.parentIdentifier;
        this.serialNumber = rawWorkItem.serialNumber;
        this.spaceIdentifier = rawWorkItem.spaceIdentifier;
        this.spaceName = rawWorkItem.spaceName;
        this.spaceType = rawWorkItem.spaceType;
        this.status = rawWorkItem.status;
        this.statusIdentifier = rawWorkItem.statusIdentifier;
        this.statusStageIdentifier = rawWorkItem.statusStageIdentifier;
        this.subject = rawWorkItem.subject;
        this.updateStatusAt = rawWorkItem.updateStatusAt;
        this.workitemTypeIdentifier = rawWorkItem.workitemTypeIdentifier;
        // Set tree view item's info
        this.updateIcon();
        this.contextValue = rawWorkItem.status;
        this.description = this.status;
        this.id = this.identifier;
    }

    /**
     * Update current workitem's icon
     */
    public updateIcon() {
        let iconPath = path.join(__filename, "..", "..", "resource", "question-circle.svg");
        switch (this.status) {
            case "待处理":
            case "待修复":
            case "再次打开": {
                iconPath = path.join(__filename, "..", "..", "resource", "play-circle.svg");
                break;
            }
            case "处理中":
            case "开发中":
            case "测试中":
            case "设计中": {
                iconPath = path.join(__filename, "..", "..", "resource", "time-circle.svg");
                break;
            }
            case "已修复":
            case "已完成":
            case "已关闭": {
                iconPath = path.join(__filename, "..", "..", "resource", "check-circle.svg");
                break;
            }
            case "暂不修复":
            case "已取消": {
                iconPath = path.join(__filename, "..", "..", "resource", "minus-circle.svg");
                break;
            }
            default: {
                iconPath = path.join(__filename, "..", "..", "resource", "question-circle.svg");
                break;
            }
        }
        this.iconPath = {
            light: iconPath,
            dark: iconPath,
        };
    }

    public update(rawWorkItem: UpdateWorkItemResponseBodyWorkitem) {
        if (!rawWorkItem.subject) {
            rawWorkItem.subject = "";
        }
        this.label = rawWorkItem.subject;
        this.assignedTo = rawWorkItem.assignedTo;
        this.categoryIdentifier = rawWorkItem.categoryIdentifier; // Task/Req/Bug
        this.creator = rawWorkItem.creator;
        this.document = rawWorkItem.document;
        this.gmtCreate = rawWorkItem.gmtCreate;
        this.gmtModified = rawWorkItem.gmtModified;
        this.identifier = rawWorkItem.identifier;
        this.logicalStatus = rawWorkItem.logicalStatus;
        this.modifier = rawWorkItem.modifier;
        this.parentIdentifier = rawWorkItem.parentIdentifier;
        this.serialNumber = rawWorkItem.serialNumber;
        this.spaceIdentifier = rawWorkItem.spaceIdentifier;
        this.spaceName = rawWorkItem.spaceName;
        this.spaceType = rawWorkItem.spaceType;
        this.status = rawWorkItem.status;
        this.statusIdentifier = rawWorkItem.statusIdentifier;
        this.statusStageIdentifier = rawWorkItem.statusStageIdentifier;
        this.subject = rawWorkItem.subject;
        this.updateStatusAt = rawWorkItem.updateStatusAt;
        this.workitemTypeIdentifier = rawWorkItem.workitemTypeIdentifier;
        // Set tree view item's info
        this.updateIcon();
        this.contextValue = rawWorkItem.status;
        this.description = this.status;
        this.id = this.identifier;
    }
}

export function getWorkItemTypeIdentifier(workItemType: string | undefined) {
    switch (workItemType) {
        case "Task": {
            return "ba102e46bc6a8483d9b7f25c";
        }
        case "Req": {
            // 产品类需求
            return "9uy29901re573f561d69jn40";
        }
        case "Bug": {
            // 缺陷
            // TODO: check create it
            return "37da3a07df4d08aef2e3b393";
        }
    }
    return "ba102e46bc6a8483d9b7f25c";
}
