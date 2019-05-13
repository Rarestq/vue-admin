<template>
  <section class="chart-container">
    <div id="chartColumn" style="width:100%; height:400px;"></div>
  </section>
</template>

<script>
import echarts from 'echarts';
import {
  statisticsTurnoverByFeeType
} from "../../api/api";
export default {
  data() {
    return {
      chartColumn: null,
    };
  },

  methods: {
    // 按照费用类型对查询到的营业额进行分组
    statisticsTurnoverByFee() {
      statisticsTurnoverByFeeType()
        .then(res => {
          console.log(res.data.data)
          let _this = this;
          _this.chartData = res.data.data;
          this.drawColumnChart();
        })
        .catch(() => {
          this.$message({
            type: "error",
            showClose: true,
            message: "请求异常!"
          });
        });
    },

    drawColumnChart() {
      this.chartColumn = echarts.init(document.getElementById("chartColumn"));
      this.chartColumn.setOption({
        title: { text: "不同费用类型营业额柱状图(单位：元)" },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        toolbox: {
          show: true,
          x: 1300,
          y: 0,
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "bar"] },
            estore: { show: true },
            saveAsImage: { show: true }
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        legend: {
          data: []
        },
        xAxis: [
          {
            type: "category",
            data: [],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "按照费用类型对查询到的营业额进行分组",
            type: "bar",
            barWidth: "60%",
            data: []
          }
        ]
        
      });
      this.chartColumn.showLoading(); //数据加载完之前先显示一段简单的loading动画
      let names = []; // 费用类型数组（实际用来盛放X轴坐标值）
      let nums = []; // 营业额数组数组（实际用来盛放Y坐标值）
      for (let i = 0; i < this.chartData.length; i++) {
        names.push(this.chartData[i].keyCode); //挨个取出费用类型姓名并填入类别数组
        nums.push(this.chartData[i].feeValue); //挨个取出营业额并填入销量数组
      }

      this.chartColumn.hideLoading(); //隐藏加载动画
      this.chartColumn.setOption({
        //加载数据图表
        xAxis: {
          data: names
        },
        series: [
          {
            // 根据名字对应到相应的系列
            name: "营业额",
            type: "bar",
            data: nums
          }
        ],
      });
    },
  },
  mounted: function() {
    this.statisticsTurnoverByFee();
  },
  
};
</script>

<style scoped>
.chart-container {
  width: 100%;
  float: left;
}

.el-col {
  padding: 30px 20px;
}
</style>
