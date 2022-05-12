import AliyunOpenApiClient, * as Yunxiao from "@alicloud/devops20210625";
import * as OpenApi from "@alicloud/openapi-client";
import Project from './project';
import WorkItem from './workitem';

export let currentUser: string = "";
export default class YunxiaoClient {
    private apiClient: AliyunOpenApiClient | undefined;

    constructor(accessKeyId: string, accessKeySecret: string) {
        let config = new OpenApi.Config({
            accessKeyId: accessKeyId,
            accessKeySecret: accessKeySecret,
        });
        // 访问的域名
        config.endpoint = `devops.cn-hangzhou.aliyuncs.com`;
        this.apiClient = new AliyunOpenApiClient(config);
    }

    public async listProjects(organizationId: string): Promise<Project[]> {
        let request = new Yunxiao.ListProjectsRequest({
            category: "Project"
        });
        let response = await this.apiClient?.listProjects(organizationId, request);
        if (response?.body.success && response.body.projects) {
            return response.body.projects.map(project => new Project(project));
        } else if (!response?.body.success) {
            console.log("Calling Aliyun open api fails, error message: ", response?.body.errorMsg);
        }
        return [];
    }

    public async listWorkItems(organizationId: string, projectIdentifier: string, workItemType: string) {
        let request = new Yunxiao.ListWorkitemsRequest({
            category: workItemType,
            spaceIdentifier: projectIdentifier,
            spaceType: "Project"
        });
        let response = await this.apiClient?.listWorkitems(organizationId, request);
        if (response?.body.success && response.body.workitems) {
            return response.body.workitems.map(item => new WorkItem(item));
        } else if (!response?.body.success) {
            console.log("Calling Aliyun open api fails, error message: ", response?.body.errorMsg);
        }
        return [];
    }

    public async updateWorkItemStatus(organizationId: string, workItem: WorkItem, statusIdentifier: string) {
        let request = new Yunxiao.UpdateWorkItemRequest({
            propertyKey: "status",
            propertyValue: statusIdentifier,
            identifier: workItem.identifier,
            fieldType: "status",
        });
        let response = await this.apiClient?.updateWorkItem(organizationId, request);
        if (response?.body.success && response.body.workitem) {
            return response.body.workitem;
        } else if (!response?.body.success) {
            console.log("Calling Aliyun open api fails, error message: ", response?.body.errorMsg);
        }
        return undefined;
    }

    public async listWorkItemAllFields(organizationId: string, spaceIdentifier: string, workItemTypeIdentifier: string) {
        let request = new Yunxiao.ListWorkItemAllFieldsRequest({
            spaceIdentifier: spaceIdentifier,
            spaceType: "Project",
            workitemTypeIdentifier: workItemTypeIdentifier
        });
        let response = await this.apiClient?.listWorkItemAllFields(organizationId, request);
        if (response?.body.success && response.body.fields) {
            return response.body.fields;
        } else if (!response?.body.success) {
            console.log("Calling Aliyun open api fails, error message: ", response?.body.errorMsg);
        }
        return undefined;
    }

    public async createWorkItem(organizationId: string, spaceIdentifier: string, assignedTo: string, category: string, workItemType: string, subject: string, description: string, fieldValueList: Yunxiao.CreateWorkitemRequestFieldValueList[]) {
        let request = new Yunxiao.CreateWorkitemRequest({
            ak: new Yunxiao.CreateWorkitemRequestAk({ issue: new Yunxiao.CreateWorkitemRequestAkIssue({}) }),
            workitem: new Yunxiao.CreateWorkitemRequestWorkitem({}),
            assignedTo: assignedTo,
            category: category,
            description: description,
            subject: subject,
            fieldValueList: fieldValueList,
            spaceIdentifier: spaceIdentifier,
            space: spaceIdentifier,
            spaceType: "Project",
            workitemType: workItemType,
        });
        let response = await this.apiClient?.createWorkitem(organizationId, request);
        if (response?.body.success && response.body.workitem) {
            return response.body.workitem;
        } else if (!response?.body.success) {
            console.log("Calling Aliyun open api fails, error message: ", response?.body.errorMsg);
        }
        return undefined;
    }
}
