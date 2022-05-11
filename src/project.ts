import { ListProjectsResponseBodyProjects } from "@alicloud/devops20210625";

/**
 * 云效项目
 */
export default class Project {
    public identifier?: string;
    public name?: string;
    constructor(data: ListProjectsResponseBodyProjects) {
        this.identifier = data.identifier;
        this.name = data.name;
    }
}