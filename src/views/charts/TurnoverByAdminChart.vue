<template>
  <section class="chart-container">
    <div id="chartPie" style="width:100%; height:400px;"></div>
  </section>
</template>

<script>
import echarts from "echarts";
import {
  statisticsTurnoverByAdmin
} from "../../api/api";
export default {
  data() {
    return {
      chartPie: null
    };
  },

  methods: {
    // 按照费用类型对查询到的营业额进行分组
    statisticsTurnoverByAdminInfo() {
      statisticsTurnoverByAdmin()
        .then(res => {
          let _this = this;
          console.log(res.data.data)
          _this.chartData = res.data.data;
          this.drawPieChart();
        })
        .catch(() => {
          this.$message({
            type: "error",
            showClose: true,
            message: "请求异常!"
          });
        });
    },

    drawPieChart() {
      this.chartPie = echarts.init(document.getElementById("chartPie"));
      // 绘制图表
      this.chartPie.setOption({
        title: {
          text: "按费用类型分组的营业额数据（单位：元）",
          x: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        toolbox: {
          show: true,
          //left: 'left',
          x: 1200,
          y: 50,
          feature: {
            dataView: { show: true, readOnly: false },
            //magicType : {show: true, type: ['line', 'bar']},
            //restore : {show: true},
            saveAsImage: { show: true }
          }
        },
        legend: {
          orient: "vertical",
          x: 250,
          y: 50
        },
        series: [
          {
            name: "营业额数据(单位：元)",
            type: "pie",
            radius: "70%",
            center: ["50%", "60%"],
            data: [],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      });
      this.chartPie.showLoading(); //数据加载完之前先显示一段简单的loading动画
      let res = [];
      for (let i = 0; i < this.chartData.length; i++) {
        res.push({
          name: this.chartData[i].keyCode,
          value: this.chartData[i].feeValue
        });
      }
      this.chartPie.hideLoading(); //隐藏加载动画
      this.chartPie.setOption({
        series: [
          {
            data: res
          }
        ]
      });
    },
  },
  mounted: function() {
    this.statisticsTurnoverByAdminInfo();
  },
};
</script>

<style scoped>
.chart-container {
  width: 100%;
  float: center;
}
/*.chart div {
        height: 400px;
        float: left;
    }*/

/* .el-col {
  padding: 30px 20px; */
/* } */
</style>
