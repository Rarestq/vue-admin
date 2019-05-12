<template>
  <section>
    <br>
    <!--列表-->
    <el-table
      :data="calculateRules"
      highlight-current-row
      v-loading="listLoading"
      style="width: 100%;"
    >
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="calculationRuleId" label="计费规则主键id" width="120" v-if="false"></el-table-column>
      <el-table-column prop="calculateRuleDesc" label="描述" width="180"></el-table-column>
      <el-table-column prop="luggageType" label="行李类型" width="180"></el-table-column>
      <el-table-column prop="calculationUnits" label="计费单位" width="180"></el-table-column>
      <el-table-column prop="feePerUnit" label="单位金额" width="180"></el-table-column>
      <el-table-column
        prop="gmtCreate"
        label="创建时间"
        :formatter="dateFormat"
        min-width="180"
      ></el-table-column>
    </el-table>
  </section>
</template>

<script>
import util from "../../common/js/util";
import moment from "moment";
import { getChargeCalculateRuleList } from "../../api/api";

export default {
  data() {
    return {
      calculateRules: [],
      listLoading: false
    };
  },
  methods: {
    // 时间格式化
    dateFormat: function(row, column) {
      const date = row[column.property];
      if (date === undefined) {
        return "";
      }
      // 这里的格式根据需求修改
      return moment(date).format("YYYY-MM-DD HH:mm");
    },

    // 获取计费规则列表
    getChargeCalculateRules() {
      this.listLoading = true;
      getChargeCalculateRuleList().then(res => {
        if (res.data.success) {
          this.calculateRules = res.data.data;
          this.listLoading = false;
        } else {
          this.$message({
            message: res.data.message,
            type: "error"
          });
        }
      });
    }
  },
  mounted() {
    this.getChargeCalculateRules();
  }
};
</script>

<style scoped>
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>