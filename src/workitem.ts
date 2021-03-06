import { CreateWorkitemResponseBodyWorkitem, ListWorkitemsResponseBodyWorkitems, UpdateWorkItemResponseBodyWorkitem } from "@alicloud/devops20210625";
import { TreeItem, TreeItemCollapsibleState } from "vscode";
import path = require("path");

export default class WorkItem extends TreeItem {
    assignedTo?: string;
    categoryIdentifier?: string;  // Task/Req/Bug
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
    constructor(rawWorkItem: ListWorkitemsResponseBodyWorkitems | UpdateWorkItemResponseBodyWorkitem | CreateWorkitemResponseBodyWorkitem) {
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
            case "待确认":
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