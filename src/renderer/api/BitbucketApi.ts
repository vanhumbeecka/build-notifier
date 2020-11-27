import path from 'path'
import { AccountModule } from '../store'
import {BitbucketPipelineResponse} from './models/BitbucketPipelineResponse'
import {BitbucketRepositoryResponse} from './models/BitbucketRepositoriesResponse'
import {Repository, repositoryFromBitbucketProjects} from '../store/models/repository'
import {Build, buildFromBitbucketData} from '../store/models/build'
import {BuildApi} from './BuildApi'
import {Api} from '../../common/Api'
import { AxiosResponse } from 'axios'

export class BitbucketApi extends Api implements BuildApi {

    private readonly baseUrl: URL = new URL("https://api.bitbucket.org/2.0/")

    constructor() {
        super("bitbucket-cloud", () => AccountModule.bitbucketAuthHeader)
    }

    async requestUserData(): Promise<{ name: string; username: string }> {
        let response: {display_name: string, username: string}
        try {
            response = await this.get<any, {display_name: string, username: string}>(path.join(this.baseUrl.href, "/user"))
        } catch (e) {
            throw new Error('Could not fetch user data of bitbucket client ' + e.message)
        }

        return {
            name: response.display_name,
            username: response.username
        }
    }

    async requestBuildInfo(workspaceAndRepo: string): Promise<Build[]> {
        const url = `${this.baseUrl.href}repositories/${workspaceAndRepo}/pipelines/?sort=-created_on`
        let response: AxiosResponse<BitbucketPipelineResponse>
        try {
            response = await this.get<BitbucketPipelineResponse>(url)
        } catch(e) {
            throw new Error(`Could not fetch pipelines info from ${workspaceAndRepo}`)
        }

        return buildFromBitbucketData(response.data);
    }

    async requestProjectInfo(search: string): Promise<Repository[]> {
        const url = `${this.baseUrl.href}repositories/?role=member&q=name~"${search}"`
        let response: AxiosResponse<BitbucketRepositoryResponse>
        try {
            response = await this.get<BitbucketRepositoryResponse>(url)
        } catch (e) {
            throw new Error(`Could not fetch repository info`)
        }

        return repositoryFromBitbucketProjects(response.data)
    }


}

export const bitbucketApi = new BitbucketApi()
