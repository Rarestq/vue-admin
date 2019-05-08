<template>
  <section>
    <br>
    <!--列表-->
    <el-table
      :data="luggageTypes"
      highlight-current-row
      v-loading="listLoading"
      style="width: 100%;"
    >
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="luggageTypeId" label="行李类型id" width="80" v-if="false"></el-table-column>
      <el-table-column prop="luggageType" label="行李类型" width="280" sortable></el-table-column>
      <el-table-column
        prop="gmtCreate"
        label="创建时间"
        :formatter="dateFormat"
        min-width="100"
        sortable
      ></el-table-column>
      <el-table-column
        prop="gmtModified"
        label="修改时间"
        :formatter="dateFormat"
        min-width="100"
        sortable
      ></el-table-column>
    </el-table>
  </section>
</template>

<script>
import util from "../../common/js/util";
import moment from "moment";
import { getLuggageTypes } from "../../api/api";

export default {
  data() {
    return {
      luggageTypes: [],
      listLoading: false
    };
  },
  methods: {
    // 时间格式化
    dateFormat: function(row, column) {
      // console.log(row, column);
      const date = row[column.property];
      if (date === undefined) {
        return "";
      }
      // 这里的格式根据需求修改
      return moment(date).format("YYYY-MM-DD HH:mm");
    },

    // 获取行李类型信息列表
    getLuggageType() {
      this.listLoading = true;
      getLuggageTypes().then(res => {
        if (res.data.success) {
          this.luggageTypes = res.data.data;
          this.listLoading = false;
          // this.$message({
          //   message: res.data.message,
          //   type: "success"
          // });
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
    this.getLuggageType();
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