<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.depositorName" placeholder="丢失人姓名(模糊查询)" clearable></el-input>
        </el-form-item>
         <el-form-item>
          <el-input v-model="filters.lostRecordNo" placeholder="遗失登记编号(模糊查询)" clearable></el-input>
        </el-form-item>
        <el-select v-model="filters.status" clearable placeholder="记录状态">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-form-item>
          <el-button type="primary" v-on:click="getlostRegisterRecords">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table
      :data="lostRegisterRecords"
      highlight-current-row
      v-loading="listLoading"
      style="width: 100%;"
    >
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="lostRegistrationRecordId" label="行李遗失登记主键id" width="80" v-if="false"></el-table-column>
      <el-table-column prop="registerRecordNo" label="遗失登记编号" width="160"></el-table-column>
      <el-table-column prop="adminId" label="管理员id" width="80" v-if="false"></el-table-column>
      <el-table-column prop="adminName" label="管理员姓名" width="120"></el-table-column>
      <el-table-column prop="luggageId" label="行李寄存主键id" width="80" v-if="false"></el-table-column>
      <el-table-column prop="luggageRecordNo" label="寄存记录编号" width="250"></el-table-column>
      <el-table-column prop="luggageType" label="行李类型" width="120"></el-table-column>
      <el-table-column prop="depositorName" label="丢失人姓名" width="120"></el-table-column>
      <el-table-column prop="depositorPhone" label="丢失人电话" width="130"></el-table-column>
      <el-table-column prop="status" label="记录状态" width="130"></el-table-column>
      <el-table-column prop="remark" label="备注" width="150"></el-table-column>
      <el-table-column prop="gmtCreate" label="登记时间" :formatter="dateFormat" min-width="180"></el-table-column>
      <el-table-column prop="gmtModified" label="修改时间" :formatter="dateFormat" min-width="180"></el-table-column>
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="danger" size="small" @click="compensate(scope.$index, scope.row)" :disabled="scope.row.status === '已遗失' ? false : true">进行赔偿</el-button>
        </template>
      </el-table-column>
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
  getLostRegisterRecordListPage,
  addLostCompensateRecord
} from "../../api/api";

export default {
  data() {
    return {
      options: [
        {
          value: "0",
          label: "已遗失"
        },
        {
          value: "1",
          label: "已赔偿"
        }
      ],
      value: "",
      filters: {
        depositorName: "",
        lostRecordNo: "",
        status: null
      },
      lostRegisterRecords: [],
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
      this.getlostRegisterRecords();
    },

    // 显示条数变化
    handleSizeChange(val) {
      this.pageSize = val;
      this.getlostRegisterRecords();
    },

    // 对行李进行赔偿
    compensate: function(index, row) {
      this.$confirm("确认进行赔偿吗?", "提示", {
        type: "info"
      })
        .then(() => {
          this.listLoading = true;
          let para = { lostRegistRecordIds: row.lostRegistrationRecordId };
          addLostCompensateRecord(para).then(res => {
            this.listLoading = false;
            if (res.success) {
              this.$message({
                message: "赔偿成功",
                type: "success"
              });
            } else {
              this.$message({
                message: res.message,
                type: "error"
              });
            }
            this.getlostRegisterRecords();
          });
        })
        .catch(() => {});
    },

    // 获取赔偿记录列表
    getlostRegisterRecords() {
      let para = {
        current: this.currentPage,
        size: this.pageSize,
        depositorName: this.filters.depositorName,
        lostRecordNo: this.filters.lostRecordNo,
        status: this.filters.status
      };
      this.listLoading = true;
      getLostRegisterRecordListPage(para).then(res => {
        if (res.data.success) {
          this.total = res.data.data.total;
          this.pages = res.data.data.pages;
          this.pageSize = res.data.data.size;
          this.lostRegisterRecords = res.data.data.records;
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
    this.getlostRegisterRecords();
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