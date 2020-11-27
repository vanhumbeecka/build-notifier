import moment from 'moment'
import { Build } from '../store/models/build'
import { OrderType } from '../store/models/order'
import { RepositoryBuilds } from '../store/models/repository-builds'


export const recentLastSort = (a: Build, b: Build): number => {
  if (moment(a.createdOn).isAfter(moment(b.createdOn))) {
    return 1;
  } else if (moment(a.createdOn).isBefore(moment(b.createdOn))) {
    return -1;
  }
  return 0;
}

export const buildFinishedOn = (build: Build): moment.Moment => {
  return moment(build.createdOn).add(build.duration, 'seconds')
}

export const sortBuilds = (order: OrderType) => (a: RepositoryBuilds, b: RepositoryBuilds): number => {
  switch (order) {
    case 'alphabetically':
      return a.repository.name > b.repository.name ? 1 : -1
    case 'most-recent':
    default:
      const buildA = buildFinishedOn(a.builds[a.builds.length - 1])
      const buildB = buildFinishedOn(b.builds[b.builds.length - 1])
      return buildA.isBefore(buildB) ? 1 : -1
  }
}


export const getBuildColor = (build: Build): string => {
  const $error = '#d62d20'
  const $hold = '#ffa700'
  const $ongoing = '#0057e7'
  const $good = '#008744'

  switch (build.outcome) {
    case 'SUCCESSFUL':
      return $good
    case 'FAILED':
      return $error
    case 'PAUSED':
      return $hold
    case 'ONGOING':
    case 'UNKNOWN':
    default:
      return $ongoing
  }
}
