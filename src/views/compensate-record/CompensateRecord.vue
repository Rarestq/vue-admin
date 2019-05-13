<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.adminName" placeholder="管理员姓名(支持模糊查询)" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.depositorName" placeholder="赔偿人姓名(支持模糊查询)" clearable></el-input>
        </el-form-item>
        <el-select v-model="filters.luggageTypeId" clearable placeholder="行李类型">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-form-item>
          <el-button type="primary" v-on:click="getLostCompensateRecords">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table
      :data="compensateRecords"
      highlight-current-row
      v-loading="listLoading"
      style="width: 100%;"
    >
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="luggageLostCompensationRecordId" label="赔偿记录主键id" width="80" v-if="false"></el-table-column>
      <el-table-column prop="lostCompensateRecordNo" label="遗失赔偿记录编号" width="180"></el-table-column>
      <el-table-column prop="lostRegistrationRecordId" label="行李遗失登记主键id" width="100" v-if="false"></el-table-column>
      <el-table-column prop="lostRegistRecordNo" label="遗失登记编号" width="160"></el-table-column>
      <el-table-column prop="adminId" label="管理员id" width="80" v-if="false"></el-table-column>
      <el-table-column prop="adminName" label="管理员姓名" width="120"></el-table-column>
      <el-table-column prop="depositorName" label="赔偿对象姓名" width="120"></el-table-column>
      <el-table-column prop="depositorPhone" label="赔偿对象电话" width="130"></el-table-column>
      <el-table-column label="行李类型" width="120">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.luggageType === '普通物件'">普通物件</el-tag>
          <el-tag type="warning" v-if="scope.row.luggageType === '易碎物件'">易碎物件</el-tag>
          <el-tag type="danger" v-if="scope.row.luggageType === '贵重物件'">贵重物件</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="compensationFee" label="赔偿金额" width="120"></el-table-column>
      <el-table-column prop="remark" label="备注" width="150"></el-table-column>
      <el-table-column prop="compensateTime" label="赔偿时间" :formatter="dateFormat" min-width="180"></el-table-column>
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
  getLostCompensateRecordListPage
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
      compensateRecords: [],
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
      this.getLostCompensateRecords();
    },

    // 显示条数变化
    handleSizeChange(val) {
      this.pageSize = val;
      this.getLostCompensateRecords();
    },

    // 获取行李遗失赔偿记录列表
    getLostCompensateRecords() {
      let para = {
        current: this.currentPage,
        size: this.pageSize,
        luggageTypeId: this.filters.luggageTypeId,
        adminName: this.filters.adminName,
        depositorName: this.filters.depositorName
      };
      this.listLoading = true;
      getLostCompensateRecordListPage(para).then(res => {
        if (res.data.success) {
          this.total = res.data.data.total;
          this.pages = res.data.data.pages;
          this.pageSize = res.data.data.size;
          this.compensateRecords = res.data.data.records;
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
    this.getLostCompensateRecords();
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