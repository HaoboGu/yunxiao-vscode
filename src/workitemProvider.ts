import WorkItem from './workitem';
import * as vscode from "vscode";
import { ListWorkitemsResponseBodyWorkitems } from "@alicloud/devops20210625";
import path = require("path");
import { apiClient } from './extension';
import Project from './project';

export class YunxiaoWorkItemProvider implements vscode.TreeDataProvider<WorkItem> {
    private organizationId: string;
    private projects: Project[];
    private _onDidChangeTreeData: vscode.EventEmitter<WorkItem | undefined | null | void> = new vscode.EventEmitter<WorkItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<WorkItem | undefined | null | void> = this._onDidChangeTreeData.event;

    constructor(organizationId: string) {
        this.organizationId = organizationId;
        this.projects = [];
    }

    getTreeItem(element: WorkItem): vscode.TreeItem {
        return element;
    }

    getParent(element?: WorkItem) {
        if (!element || element.contextValue === "yunxiao.topLayer") {
            return undefined;
        } else if (element.contextValue === "yunxiao.firstLayer") {
            if (element.spaceIdentifier) {
                let node = new WorkItem(new ListWorkitemsResponseBodyWorkitems({
                    subject: element.spaceName,
                    identifier: element.spaceIdentifier,
                }));
                node.spaceIdentifier = element.spaceIdentifier;
                node.contextValue = "yunxiao.topLayer";
                node.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
                node.iconPath = {
                    light: path.join(__filename, "..", "..", "resource", "yunxiao.svg"),
                    dark: path.join(__filename, "..", "..", "resource", "yunxiao.svg"),
                };
                return node;
            }
            return undefined;
        } else if (element.spaceIdentifier && element.categoryIdentifier) {
            // Get subject
            let subject = "任务";
            if (element.categoryIdentifier === "Bug") {
                subject = "缺陷";
            } else if (element.categoryIdentifier === "Req") {
                subject = "需求";
            }
            // Get Icon
            let icon = "detail.svg";
            if (element.categoryIdentifier === "Bug") {
                icon = "bug.svg";
            } else if (element.categoryIdentifier === "Req") {
                icon = "project.svg";
            }

            // 
            let parentNode = new WorkItem(new ListWorkitemsResponseBodyWorkitems({
                subject: subject,
                identifier: element.spaceIdentifier + "." + element.categoryIdentifier // Use space identifier + ".task" as this node's identifier
            }));
            parentNode.contextValue = "yunxiao.firstLayer";
            parentNode.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
            parentNode.iconPath = {
                light: path.join(__filename, "..", "..", "resource", icon),
                dark: path.join(__filename, "..", "..", "resource", icon),
            };
            parentNode.spaceIdentifier = element.spaceIdentifier;
            parentNode.spaceName = element.spaceName;
            return parentNode;
        }
    }

    // getChildren for current tree item
    getChildren(element?: WorkItem): Thenable<WorkItem[]> {
        if (!element) {
            // If element is empty, get the first layer
            return this.getTopLayer();
        } else if (element.contextValue === "yunxiao.topLayer") {
            return this.getFirstLayer(element);
        }
        else if (element.contextValue === "yunxiao.firstLayer") {
            switch (element.label) {
                case "任务": {
                    return this.getWorkItems("Task", element.spaceIdentifier);
                }
                case "需求": {
                    return this.getWorkItems("Req", element.spaceIdentifier);
                }
                case "缺陷": {
                    return this.getWorkItems("Bug", element.spaceIdentifier);
                }
            }
        }
        return Promise.resolve([]);
    }

    private async getTopLayer(): Promise<WorkItem[]> {
        if (this.projects.length === 0) {
            this.projects = await apiClient.listProjects(this.organizationId);
        }
        let projectNodes: WorkItem[] = [];
        for (let p of this.projects) {
            let node = new WorkItem(new ListWorkitemsResponseBodyWorkitems({
                subject: p.name,
                identifier: p.identifier,
            }));
            node.spaceIdentifier = p.identifier;
            node.spaceName = p.name;
            node.contextValue = "yunxiao.topLayer";
            node.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
            node.iconPath = {
                light: path.join(__filename, "..", "..", "resource", "yunxiao.svg"),
                dark: path.join(__filename, "..", "..", "resource", "yunxiao.svg"),
            };
            projectNodes.push(node);
        }
        return projectNodes;
    }

    // Currently, the first layer of our workitem tree view has three items: 任务、需求、缺陷
    private async getFirstLayer(element: WorkItem): Promise<WorkItem[]> {
        if (this.projects.length === 0) {
            this.projects = await apiClient.listProjects(this.organizationId);
        }
        let task = new WorkItem(new ListWorkitemsResponseBodyWorkitems({
            subject: "任务",
            identifier: element.identifier + ".Task" // Use space identifier + ".task" as this node's identifier
        }));
        task.contextValue = "yunxiao.firstLayer";
        task.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
        task.iconPath = {
            light: path.join(__filename, "..", "..", "resource", "detail.svg"),
            dark: path.join(__filename, "..", "..", "resource", "detail.svg"),
        };
        task.spaceIdentifier = element.spaceIdentifier;
        task.spaceName = element.subject;

        let req = new WorkItem(new ListWorkitemsResponseBodyWorkitems({
            subject: "需求",
            identifier: element.identifier + ".Req" // Use space identifier + ".task" as this node's identifier
        }));
        req.contextValue = "yunxiao.firstLayer";
        req.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
        req.iconPath = {
            light: path.join(__filename, "..", "..", "resource", "project.svg"),
            dark: path.join(__filename, "..", "..", "resource", "project.svg"),
        };
        req.spaceIdentifier = element.spaceIdentifier;
        req.spaceName = element.subject;

        let bug = new WorkItem(new ListWorkitemsResponseBodyWorkitems({
            subject: "缺陷",
            identifier: element.identifier + ".Bug" // Use space identifier + ".task" as this node's identifier
        }));
        bug.contextValue = "yunxiao.firstLayer";
        bug.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
        bug.iconPath = {
            light: path.join(__filename, "..", "..", "resource", "bug.svg"),
            dark: path.join(__filename, "..", "..", "resource", "bug.svg"),
        };
        bug.spaceIdentifier = element.spaceIdentifier;
        bug.spaceName = element.subject;

        let workItemClasses: WorkItem[] = [task, req, bug];

        return Promise.resolve(workItemClasses);
    }

    private async getWorkItems(workItemType: string, spaceIdentifier: string | undefined): Promise<WorkItem[]> {
        if (!spaceIdentifier) {
            return [];
        }
        return await apiClient.listWorkItems(this.organizationId, spaceIdentifier, workItemType);
    }

    // Refresh the whole workitem tree view
    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    // Refresh a workitem and it's children in the tree view
    refreshItem(item: WorkItem): void {
        this._onDidChangeTreeData.fire(item);
    }
}