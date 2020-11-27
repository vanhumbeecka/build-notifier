<template>
  <el-table
      ref="build-table"
      :data="buildInfo"
      :show-header="false"
      style="width: 100%;"
      cell-class-name="bn-cell">
    <el-table-column
        label="Name">
      <template slot-scope="scope">
        <span v-if="!scope.row">-</span>
        <build-text
            v-else
            :repository-builds="scope.row"
            :active-data-bar="activeDataBar"
            :active-repository-id="activeRepositoryId">
        </build-text>
      </template>
    </el-table-column>
    <el-table-column
        label="Build info"
        width="150">
      <template slot-scope="scope">
        <div v-if="!scope.row">
          Error loading data
        </div>
        <v-chart v-else
                 :ref="chartRef(scope.row)"
                 :options="chartOptions(scope.row)"
                 @click="handleClick"
                 @mouseover="handleMouseOver"
                 @mouseout="handleMouseOut"
                 autoresize>
        </v-chart>
      </template>
    </el-table-column>
  </el-table>
</template>
<script lang="ts">
import { EChartOption } from 'echarts'
import 'echarts/lib/chart/bar'
import { shell } from 'electron'
import moment from 'moment'
import ECharts from 'vue-echarts'
import { Component, Vue } from 'vue-property-decorator'
import { RefType } from '../api/models/BitbucketPipelineResponse'
import { EChartMouseEvent } from '../common/models/EChartMouseEvent'
import { getBuildColor, sortBuilds } from '../common/utils'
import BuildRowTextComponent from '../components/BuildRowText.vue'
import { AppModule, ManageModule } from '../store'
import { DataBar, EmptyDataBar, isEmptyDataBar } from '../store/models/data-bar'
import { RepositoryBuilds } from '../store/models/repository-builds'

@Component({
  name: 'build', components: {
    'v-chart': ECharts, 'build-text': BuildRowTextComponent
  }
})
export default class BuildComponent extends Vue {

  private graphData: Map<string, DataBar[]> = new Map<string, DataBar[]>()
  private activeDataBar: DataBar = EmptyDataBar
  private activeRepositoryId = ''

  mounted() {
    ManageModule.listenToMyBuildInfo()
  }

  get buildInfo(): RepositoryBuilds[] {
    const info = ManageModule.buildInfo
    const order = AppModule.buildOrder
    return [...info].sort(sortBuilds(order))
  }

  get hasActiveDataBarForRepository(): (repositoryBuilds: RepositoryBuilds) => boolean {
    return (repositoryBuilds: RepositoryBuilds) => {
      if (this.activeRepositoryId !== repositoryBuilds.repository.id) {
        return false
      }
      return !isEmptyDataBar(this.activeDataBar)
    }
  }

  public handleClick($event: EChartMouseEvent) {
    const info = this.buildInfo.find(b => b.repository.id === $event.seriesName)
    if (!info) {
      return
    }
    const buildId = $event.name
    const build = info.builds.find(b => b.id === buildId)
    if (!build) {
      return
    }
    shell.openExternal(build.href)
  }

  public handleMouseOver($event: EChartMouseEvent): void {
    const repositoryId = $event.seriesName
    const buildId = ($event.data as EChartOption.SeriesBar.DataObject).name
    if (!buildId || !repositoryId) {
      return
    }

    const original = this.graphData.get(repositoryId)
    if (!original) {
      return
    }

    const dataBar = original.find(d => d.build?.id === buildId)
    if (!dataBar) {
      return
    }

    this.activeDataBar = dataBar
    this.activeRepositoryId = repositoryId
  }

  public handleMouseOut($event: EChartMouseEvent): void {
    this.activeDataBar = EmptyDataBar
    this.activeRepositoryId = ''
  }

  // https://echarts.apache.org/examples/en/editor.html?c=dataset-encode0&theme=light
  // https://echarts.apache.org/examples/en/editor.html?c=bar-waterfall2
  public chartOptions(repositoryBuilds: RepositoryBuilds): EChartOption {

    const data: DataBar[] = [...repositoryBuilds.builds].map(b => {
      const series: EChartOption.SeriesBar.DataObject & {branchName: string, refType: string, duration: number, createdOn: moment.Moment}= {
        value: b.duration,
        name: b.id as string,
        itemStyle: {
          color: getBuildColor(b)
        },
        branchName: b.branchOrTagName,
        refType: b.refType,
        duration: b.duration,
        createdOn: b.createdOn
      }

      return {
        build: b, seriesData: series
      }
    })

    this.graphData.set(repositoryBuilds.repository.id, data)

    return {
      tooltip: {
        trigger: 'item',
        confine: true,
      },
      grid: {
        containLabel: false,
        left: 0,
        right: 0,
        top: 5,
        bottom: 5
      }, xAxis: {
        type: 'category',
        show: false
      }, yAxis: {
        type: 'value',
        show: false
      }, series: [{
        emphasis: {
          itemStyle: {
            borderColor: '#222', borderWidth: 2
          }
        },
        id: repositoryBuilds.repository.id,
        name: repositoryBuilds.repository.id,
        type: 'bar',
        barWidth: '10',
        data: data.map(d => d.seriesData),
        tooltip: {
          textStyle: {
            fontFamily: "Helvetica Neue",
            fontSize: 10
          },
          formatter: (params: {data: {createdOn: moment.Moment, branchName: string, refType: string, duration: number}}): string => {
            let icon = ''
            const calendarIcon = `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="calendar" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-calendar fa-w-14 fa-fw"><path fill="currentColor" d="M12 192h424c6.6 0 12 5.4 12 12v260c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V204c0-6.6 5.4-12 12-12zm436-44v-36c0-26.5-21.5-48-48-48h-48V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H160V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H48C21.5 64 0 85.5 0 112v36c0 6.6 5.4 12 12 12h424c6.6 0 12-5.4 12-12z" class=""></path></svg>`
            if (params.data.refType === RefType.Tag) {
              icon += `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="tag" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-tag fa-w-16 fa-fw"><path fill="currentColor" d="M0 252.118V48C0 21.49 21.49 0 48 0h204.118a48 48 0 0 1 33.941 14.059l211.882 211.882c18.745 18.745 18.745 49.137 0 67.882L293.823 497.941c-18.745 18.745-49.137 18.745-67.882 0L14.059 286.059A48 48 0 0 1 0 252.118zM112 64c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48z" class=""></path></svg>`
            } else {
              icon += `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="code-branch" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="svg-inline--fa fa-code-branch fa-w-12 fa-fw"><path fill="currentColor" d="M384 144c0-44.2-35.8-80-80-80s-80 35.8-80 80c0 36.4 24.3 67.1 57.5 76.8-.6 16.1-4.2 28.5-11 36.9-15.4 19.2-49.3 22.4-85.2 25.7-28.2 2.6-57.4 5.4-81.3 16.9v-144c32.5-10.2 56-40.5 56-76.3 0-44.2-35.8-80-80-80S0 35.8 0 80c0 35.8 23.5 66.1 56 76.3v199.3C23.5 365.9 0 396.2 0 432c0 44.2 35.8 80 80 80s80-35.8 80-80c0-34-21.2-63.1-51.2-74.6 3.1-5.2 7.8-9.8 14.9-13.4 16.2-8.2 40.4-10.4 66.1-12.8 42.2-3.9 90-8.4 118.2-43.4 14-17.4 21.1-39.8 21.6-67.9 31.6-10.8 54.4-40.7 54.4-75.9zM80 64c8.8 0 16 7.2 16 16s-7.2 16-16 16-16-7.2-16-16 7.2-16 16-16zm0 384c-8.8 0-16-7.2-16-16s7.2-16 16-16 16 7.2 16 16-7.2 16-16 16zm224-320c8.8 0 16 7.2 16 16s-7.2 16-16 16-16-7.2-16-16 7.2-16 16-16z" class=""></path></svg>`
            }
            let seconds = Math.round(params.data.duration) % 60
            let secondsString = seconds.toString()
            if (seconds < 10) {
              secondsString = "0" + seconds
            }
            const minutes = Math.round(params.data.duration / 60 )
            const branchName = `<div>${icon}&nbsp;${params.data.branchName}</div>`
            const calendar = `<div>${calendarIcon}&nbsp;${moment(params.data.createdOn).fromNow()}</div>`
            const duration = `<div>${minutes}m ${secondsString}s</div>`
            return calendar + branchName + duration
          }
        }
      }]
    } as EChartOption
  }

  public chartRef(repositoryBuilds: RepositoryBuilds): string {
    return repositoryBuilds.repository.id
  }

}
</script>
<style>

.echarts {
  width: 100%;
  height: 80px;
}

</style>
