import axios from "axios"
import { CircleProjectResponse } from '../common/models/CircleProjectResponse'
import { CircleBuildResponse } from '../common/models/CirlceBuildResponse'
import { GithubBuildResponse } from '../common/models/GithubBuildResponse'
import { GithubProjectResponse } from '../common/models/GithubProjectResponse'

const baseUrlCircleCI = "https://circleci.com/api/v1.1/"
const baseUrlGithub = "https://api.github.com/"

export const requestProjectInfoCircleCi = async (apiToken: string): Promise<CircleProjectResponse> => {
  try {
    const response = await axios.get<CircleProjectResponse>(`${baseUrlCircleCI}projects/`, {
      headers: {
        Accept: "application/json",
        "Circle-Token": apiToken
      }
    })
    return response.data;
  } catch (e) {
    return Promise.reject("Failed when requesting project info from CircleCI: " + e)
  }
}

export const requestBuildInfoCircleCi = async (apiToken: string, workspaceAndRepo: string): Promise<CircleBuildResponse[]> => {
  const url = `${baseUrlCircleCI}project/${workspaceAndRepo}?limit=10&shallow=true`
  try {
    const response = await axios.get<CircleBuildResponse[]>(url, {
      headers: {
        Accept: "application/json",
        "Circle-Token": apiToken
      }
    })
    return response.data
  } catch (e) {
    return Promise.reject("Failed when requesting build info from CircleCI: " + e)
  }
}

const requestProjectInfoGithubPage = async (url: string, apiToken: string): Promise<GithubProjectResponse[]> => {
  try {
    const response = await axios.get<GithubProjectResponse[]>(url, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "Authorization": `Bearer ${apiToken}`
      }
    })
    return response.data;
  } catch (e) {
    return Promise.reject("Failed when requesting project info from Github: " + e)
  }
}

export const requestProjectInfoGithub = async (apiToken: string): Promise<GithubProjectResponse[]> => {
  const response: GithubProjectResponse[] = []
  let empty = false
  let page = 1
  while (!empty) {
    const urlPage = `${baseUrlGithub}user/repos?per_page=100&sort=full_name&page=${page}`
    const pageResponse = await requestProjectInfoGithubPage(urlPage, apiToken)
    if (!pageResponse || pageResponse.length === 0) {
      empty = true
      break
    }
    response.push(...pageResponse)
    page++;
  }

  return response
}

export const requestBuildInfoGithubActions = async (apiToken: string, workspaceAndRepo: string): Promise<GithubBuildResponse> => {
  const url = `${baseUrlGithub}repos/${workspaceAndRepo}/actions/runs?per_page=10`
  try {
    const response = await axios.get<GithubBuildResponse>(url, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `Bearer ${apiToken}`
      }
    })
    return response.data;
  } catch (e) {
    return Promise.reject("Failed when requesting build info from Github: " + e)
  }
}



