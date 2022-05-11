import AliyunOpenApiClient, * as Yunxiao from '@alicloud/devops20210625';
import * as OpenApi from '@alicloud/openapi-client';
import Project from './project';
import WorkItem from './workitem';

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
        } else {
            console.log("Calling Aliyun open api fails, error message: ", response?.body.errorMsg);
            return [];
        }
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
        } else {
            console.log("Calling Aliyun open api fails, error message: ", response?.body.errorMsg);
            return [];
        }
    }
}
