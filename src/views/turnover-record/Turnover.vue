<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.adminName" placeholder="管理员姓名(完整)" clearable></el-input>
        </el-form-item>
        <el-select v-model="filters.luggageTypeId" clearable placeholder="行李类型">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-form-item label="日期">
          <el-date-picker
            v-model="filters.gmtCreate"
            align="right"
            type="datetime"
            placeholder="选择日期(某一天)"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getTurnoverRecords">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table
      :data="turnoverRecords"
      highlight-current-row
      v-loading="listLoading"
      style="width: 100%;"
    >
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="turnoverRecordId" label="营业额记录表主键id" width="80" v-if="false"></el-table-column>
      <el-table-column prop="luggageId" label="行李寄存记录id" width="80" v-if="false"></el-table-column>
      <el-table-column prop="adminId" label="管理员id" width="100" v-if="false"></el-table-column>
      <el-table-column prop="adminName" label="管理员姓名" width="180"></el-table-column>
      <el-table-column prop="luggageType" label="行李类型" width="120"></el-table-column>
      <el-table-column prop="calculationRuleId" label="计费规则主键id" width="80" v-if="false"></el-table-column>
      <el-table-column prop="fee" label="费用" width="120"></el-table-column>
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
          :page-size="10"
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
  getTurnoverRecordListPage,
  getTurnoverRecordPair,
  statisticsTotalTurnover
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
      options: [
        {
          value: "1",
          label: "普通物件"
        },
        {
          value: "2",
          label: "易碎物件"
        },
        {
          value: "3",
          label: "贵重物件"
        }
      ],
      value: "",
      filters: {
        adminName: "",
        luggageTypeId: null,
        gmtCreate: ""
      },
      turnoverRecords: [],
      total: 0,
      pages: 1,
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
      this.getTurnoverRecords();
    },

    // 显示条数变化
    handleSizeChange(val) {
      this.pageSize = val;
      this.getTurnoverRecords();
    },

    // 获取营业额记录列表
    getTurnoverRecords() {
      let para = {
        currentPage: this.currentPage,
        luggageTypeId: this.filters.luggageTypeId,
        adminName: this.filters.adminName,
        gmtCreate: this.filters.gmtCreate
      };
      this.listLoading = true;
      // 前台时间字符串传到后台只能以 yyyy-MM-dd hh:mm:ss 格式
      para.gmtCreate =
        !para.gmtCreate || para.gmtCreate == ""
          ? ""
          : util.formatDate.format(new Date(para.gmtCreate), "yyyy-MM-dd hh:mm:ss");
      getTurnoverRecordListPage(para).then(res => {
        if (res.data.success) {
          this.total = res.data.data.total;
          this.pages = res.data.data.pages;
          this.pageSize = res.data.data.size;
          this.turnoverRecords = res.data.data.records;
          this.listLoading = false;
          this.$message({
            message: res.data.message,
            type: "success"
          });
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
    this.getTurnoverRecords();
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