import { ListWorkitemsResponseBodyWorkitems } from "@alicloud/devops20210625";
import path = require("path");
import { TreeItem, TreeItemCollapsibleState } from "vscode";

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
    constructor(rawWorkItem: ListWorkitemsResponseBodyWorkitems) {
        if (!rawWorkItem.subject) {
            rawWorkItem.subject = "";
        }
        super(rawWorkItem.subject, TreeItemCollapsibleState.None);
        this.assignedTo = rawWorkItem.assignedTo;
        this.categoryIdentifier = rawWorkItem.categoryIdentifier;
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
        this.updateIcon();
    }

    /**
     * Update current workitem's icon
     */
    public updateIcon() {
        let iconPath = path.join(__filename, "..", "..", "resource", "new.svg");
        switch (this.status) {
            case "待处理":
            case "待修复":
            case "再次打开": {
                iconPath = path.join(__filename, "..", "..", "resource", "new.svg");
                break;
            }
            case "处理中":
            case "开发中":
            case "测试中":
            case "设计中": {
                iconPath = path.join(__filename, "..", "..", "resource", "doing.svg");
                break;
            }
            case "已修复":
            case "已完成": {
                iconPath = path.join(__filename, "..", "..", "resource", "done.svg");
                break;
            }
            case "暂不修复":
            case "已取消": {
                iconPath = path.join(__filename, "..", "..", "resource", "closed.svg");
                break;
            }
            default: {
                iconPath = path.join(__filename, "..", "..", "resource", "question.svg");
                break;
            }
        }
        this.iconPath = {
            light: iconPath,
            dark: iconPath,
        };
    }
}