<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.depositorName" placeholder="取件人姓名(模糊查询)" clearable></el-input>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="filters.pickupTime"
            align="right"
            type="datetime"
            placeholder="取件日期"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getPickupLuggageRecords">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table
      :data="pickupRecords"
      highlight-current-row
      v-loading="listLoading"
      style="width: 100%;"
    >
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="pickupLuggageRecordId" label="行李取件记录主键id" width="80" v-if="false"></el-table-column>
      <el-table-column prop="pickupRecordNo" label="取件记录编号" width="250"></el-table-column>
      <el-table-column prop="luggageId" label="行李寄存主键id" width="80" v-if="false"></el-table-column>
      <el-table-column prop="adminId" label="管理员id" width="80" v-if="false"></el-table-column>
      <el-table-column prop="adminName" label="管理员姓名" width="120"></el-table-column>
      <el-table-column prop="pickerName" label="取件人姓名" width="120"></el-table-column>
      <el-table-column prop="pickerPhone" label="取件人电话" width="130"></el-table-column>
      <el-table-column label="取件类型" width="120">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.pickupType === '正常取件'">正常取件</el-tag>
          <el-tag type="danger" v-if="scope.row.pickupType === '逾期取件'">逾期取件</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="pickUpTime" label="取件时间" :formatter="dateFormat" min-width="180"></el-table-column>
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
import {
  getPickupLuggageRecordListPage
} from "../../api/api";

export default {
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      dateValue: "",
      filters: {
        depositorName: "",
        pickupTime: ""
      },
      pickupRecords: [],
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
      this.getPickupLuggageRecords();
    },

    // 显示条数变化
    handleSizeChange(val) {
      this.pageSize = val;
      this.getPickupLuggageRecords();
    },

    // 获取取件记录列表
    getPickupLuggageRecords() {
      let para = {
        current: this.currentPage,
        size: this.pageSize,
        depositorName: this.filters.depositorName,
        pickupTime: this.filters.pickupTime
      };
      this.listLoading = true;
      // 前台时间字符串传到后台只能以 yyyy-MM-dd hh:mm:ss 格式
      para.pickupTime =
        !para.pickupTime || para.pickupTime == ""
          ? ""
          : util.formatDate.format(new Date(para.pickupTime), "yyyy-MM-dd hh:mm:ss");
      getPickupLuggageRecordListPage(para).then(res => {
        if (res.data.success) {
          this.total = res.data.data.total;
          this.pages = res.data.data.pages;
          this.pageSize = res.data.data.size;
          this.pickupRecords = res.data.data.records;
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
    this.getPickupLuggageRecords();
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