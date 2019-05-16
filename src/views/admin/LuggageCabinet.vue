<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input
            size="30px"
            v-model="filters.luggageCabinetNo"
            placeholder="可输入行李柜编号(支持模糊查询)"
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
          <el-button type="primary" v-on:click="getCabinetInfo">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table
      :data="cabinets"
      highlight-current-row
      v-loading="listLoading"
      style="width: 100%;"
    >
      <!-- <el-table-column type="selection" width="55"></el-table-column> -->
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="luggageCabinetId" label="行李柜主键id" width="180" v-if="false"></el-table-column>
      <el-table-column prop="luggageCabinetNo" label="行李柜编号"></el-table-column>
      <el-table-column label="行李柜状态" width="120">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.status === '空闲'">空闲</el-tag>
          <el-tag type="warning" v-if="scope.row.status === '已占用'">已占用</el-tag>
          <el-tag type="danger" v-if="scope.row.status === '逾期占用'">逾期占用</el-tag>
          <el-tag type="info" v-if="scope.row.status === '维修中'">维修中</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="warning" size="small" @click="repair(scope.$index, scope.row)">维修</el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <!--分页工具条-->
    <el-col :span="24" class="toolbar">
      <!-- <el-button type="danger" @click="batchRepair" :disabled="this.sels.length===0">批量维修</el-button> -->
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
  getCabinetInfoPage,
  repairCabinets,
  batchRepairCabinets
} from "../../api/api";

export default {
  data() {
    return {
      cabinets: [],
      total: 0,
      pages: 1,
      pageSize: 10,
      currentPage: 1,

      options: [
        {
          value: "0",
          label: "空闲"
        },
        {
          value: "1",
          label: "已占用"
        },
        {
          value: "2",
          label: "逾期占用"
        },
        {
          value: "3",
          label: "维修中"
        }
      ],
      value: "",

      listLoading: false,

      filters: {
        luggageCabinetNo: "",
        status: null
      }
    };
  },
  methods: {
    // 分页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getCabinetInfo();
    },

    // 显示条数变化
    handleSizeChange(val) {
      this.pageSize = val;
      this.getCabinetInfo();
    },

    // 获取寄存柜信息列表
    getCabinetInfo() {
      let para = {
        current: this.currentPage,
        size: this.pageSize,
        luggageCabinetNo: this.filters.luggageCabinetNo,
        status: this.filters.status
      };
      this.listLoading = true;
      getCabinetInfoPage(para).then(res => {
        if (res.data.success) {
          this.total = res.data.data.total;
          this.pages = res.data.data.pages;
          this.pageSize = res.data.data.size;
          this.cabinets = res.data.data.records;
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
    this.getCabinetInfo();
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