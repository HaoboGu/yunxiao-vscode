import WorkItem from './workitem';
import * as vscode from "vscode";
import YunxiaoClient from './client';
import { ListWorkitemsResponseBodyWorkitems } from "@alicloud/devops20210625";
import path = require("path");

export class YunxiaoWorkitemProvider implements vscode.TreeDataProvider<WorkItem> {
    private client: YunxiaoClient;
    private organizationId: string;
    constructor(client: YunxiaoClient, organizationId: string) {
        this.client = client;
        this.organizationId = organizationId;
    }

    getTreeItem(element: WorkItem): vscode.TreeItem {
        return element;
    }

    // getChildren for current tree item
    getChildren(element?: WorkItem): Thenable<WorkItem[]> {
        if (!element) {
            // If element is empty, get the first layer
            return this.getFirstLayer();
        }
        if (element.contextValue === "yunxiao.firstLayer") {
            switch (element.label) {
                case "任务": {
                    return this.client.listWorkItems(this.organizationId, "1fd3ef025d5b53084b390abbd6", "Task");
                }
                case "需求": {
                    return this.client.listWorkItems(this.organizationId, "1fd3ef025d5b53084b390abbd6", "Req");
                }
                case "缺陷": {
                    return this.client.listWorkItems(this.organizationId, "1fd3ef025d5b53084b390abbd6", "Bug");
                }
            }
        }
        return Promise.resolve([]);
    }

    // Currently, the first layer of our workitem tree view has three items: 任务、需求、缺陷
    private getFirstLayer(): Thenable<WorkItem[]> {
        let task = new WorkItem(new ListWorkitemsResponseBodyWorkitems({
            subject: "任务",
        }));
        task.contextValue = "yunxiao.firstLayer";
        task.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
        task.iconPath = {
            light: path.join(__filename, "..", "..", "resource", "detail.svg"),
            dark: path.join(__filename, "..", "..", "resource", "detail.svg"),
        };

        let req = new WorkItem(new ListWorkitemsResponseBodyWorkitems({
            subject: "需求",
        }));
        req.contextValue = "yunxiao.firstLayer";
        req.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
        req.iconPath = {
            light: path.join(__filename, "..", "..", "resource", "project.svg"),
            dark: path.join(__filename, "..", "..", "resource", "project.svg"),
        };

        let bug = new WorkItem(new ListWorkitemsResponseBodyWorkitems({
            subject: "缺陷",
        }));
        bug.contextValue = "yunxiao.firstLayer";
        bug.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
        bug.iconPath = {
            light: path.join(__filename, "..", "..", "resource", "bug.svg"),
            dark: path.join(__filename, "..", "..", "resource", "bug.svg"),
        };
        let workItemClasses: WorkItem[] = [task, req, bug];

        return Promise.resolve(workItemClasses);
    }

    private _onDidChangeTreeData: vscode.EventEmitter<WorkItem | undefined | null | void> = new vscode.EventEmitter<WorkItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<WorkItem | undefined | null | void> = this._onDidChangeTreeData.event;

    // Refresh the whole workitem tree view
    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    // Refresh a workitem and it's children in the tree view
    refreshItem(item: WorkItem): void {
        this._onDidChangeTreeData.fire(item);
    }
}