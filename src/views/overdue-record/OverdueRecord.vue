<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input
            size="42px"
            v-model="filters.condition"
            placeholder="可输入寄存记录编号或寄存人姓名(模糊查询)"
            clearable
          ></el-input>
        </el-form-item>
        <el-select v-model="filters.status" clearable placeholder="状态">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-form-item>
          <el-button type="primary" v-on:click="getOverdueRecords">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table
      :data="overdueRecords"
      highlight-current-row
      v-loading="listLoading"
      style="width: 100%;"
    >
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="luggageOverdueRecordId" label="行李逾期未取记录主键id" width="80" v-if="false"></el-table-column>
      <el-table-column prop="overdueRecordNo" label="逾期记录编号" width="180"></el-table-column>
      <el-table-column prop="luggageId" label="行李寄存主键id" width="80" v-if="false"></el-table-column>
      <el-table-column prop="luggageRecordNo" label="寄存记录编号" width="180"></el-table-column>
      <el-table-column label="行李类型" width="120">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.luggageType === '普通物件'">普通物件</el-tag>
          <el-tag type="warning" v-if="scope.row.luggageType === '易碎物件'">易碎物件</el-tag>
          <el-tag type="danger" v-if="scope.row.luggageType === '贵重物件'">贵重物件</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="depositorName" label="寄存人姓名" width="120"></el-table-column>
      <el-table-column prop="depositorPhone" label="寄存人电话" width="130"></el-table-column>
      <el-table-column label="状态" width="120">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.status === '已逾期'">已逾期</el-tag>
          <el-tag type="danger" v-if="scope.row.status === '已清理作废'">已清理作废</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" width="120"></el-table-column>
      <el-table-column prop="gmtCreate" label="创建时间" :formatter="dateFormat" min-width="180"></el-table-column>
      <el-table-column prop="gmtModified" label="修改时间" :formatter="dateFormat" min-width="180"></el-table-column>
    </el-table>

    <!--分页工具条-->
    <el-col :span="24" class="toolbar">
      <div style="float: right">
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 50, 100]"
          :page-size="pageSize"
          :page-count="pages"
          :total="total"
        ></el-pagination>
      </div>
    </el-col>
  </section>
</template>

<script>
import util from "../../common/js/util";
import moment from "moment";
import { getOverdueRecordListPage } from "../../api/api";

export default {
  data() {
    return {
      options: [
        {
          value: "1",
          label: "已逾期"
        },
        {
          value: "2",
          label: "已清理作废"
        }
      ],
      value: "",
      filters: {
        condition: "",
        status: null
      },
      overdueRecords: [],
      total: 0,
      pages: 1,
      pageSize: 10,
      currentPage: 1,
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

    // 分页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getOverdueRecords();
    },

    // 显示条数变化
    handleSizeChange(val) {
      this.pageSize = val;
      this.getOverdueRecords();
    },

    // 获取行李逾期记录列表
    getOverdueRecords() {
      let para = {
        current: this.currentPage,
        size: this.pageSize,
        queryCondition: this.filters.condition,
        status: this.filters.status
      };
      this.listLoading = true;
      getOverdueRecordListPage(para).then(res => {
        if (res.data.success) {
          this.total = res.data.data.total;
          this.pages = res.data.data.pages;
          this.pageSize = res.data.data.size;
          this.overdueRecords = res.data.data.records;
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
    this.getOverdueRecords();
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