<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.luggageRecordNo" placeholder="寄存编号(模糊查询)"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.depositorName" placeholder="寄存人姓名(模糊查询)"></el-input>
        </el-form-item>

        <el-form-item>
          <el-input v-model="filters.depositorPhone" placeholder="寄存人电话(模糊查询)"></el-input>
        </el-form-item>
        <!-- <el-form-item>
          <p v-if="false">组件值：{{ filters.storageEndTimeRange }}</p>
          <el-date-picker
            v-model="filters.storageEndTimeRange"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
            placeholder="结束日期范围"
          ></el-date-picker>
        </el-form-item>-->
        <el-form-item>
          <el-button type="primary" v-on:click="getLuggageStorageRecords">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table
      :data="storageRecords"
      highlight-current-row
      v-loading="listLoading"
      @selection-change="selsChange"
      style="width: 100%;"
    >
      <!-- <el-table-column type="selection" width="55"></el-table-column> -->
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="luggageId" label="行李寄存记录id" width="80" v-if="false"></el-table-column>
      <el-table-column prop="luggageRecordNo" label="寄存记录编号" width="180" sortable></el-table-column>
      <el-table-column prop="adminId" label="管理员id" width="100" v-if="false"></el-table-column>
      <el-table-column prop="adminName" label="管理员姓名" width="150" sortable></el-table-column>
      <el-table-column prop="adminPhone" label="管理员电话" width="135" sortable></el-table-column>
      <el-table-column prop="depositorName" label="寄存人姓名" width="135" sortable></el-table-column>
      <el-table-column prop="depositorPhone" label="寄存人电话" width="135" sortable></el-table-column>
      <el-table-column prop="luggageTypeDesc" label="行李类型" width="120" sortable></el-table-column>
      <!-- <el-table-column prop="storageFee" label="费用" width="90" sortable></el-table-column> -->
      <el-table-column prop="status" label="状态" width="100" sortable></el-table-column>
      <el-table-column prop="remark" label="备注" width="150" sortable></el-table-column>
      <el-table-column
        prop="storageStartTime"
        label="寄存开始时间"
        :formatter="dateFormat"
        min-width="180"
        sortable
      ></el-table-column>
      <el-table-column
        prop="storageEndTime"
        label="寄存结束时间"
        :formatter="dateFormat"
        min-width="180"
        sortable
      ></el-table-column>
      <el-table-column label="操作" width="280">
        <template slot-scope="scope">
          <!-- 只有寄存中的记录，才能进行「正常取件」操作 -->
          <el-button size="small" @click="commonPickup(scope.$index, scope.row)" :disabled="scope.row.status === '寄存中' ? false : true">正常取件</el-button>
          <!-- 只有已逾期的记录才能进行「逾期取件」操作 -->
          <el-button type="info" size="small" @click="overduePickup(scope.$index, scope.row)" :disabled="scope.row.status === '已逾期' ? false : true">逾期取件</el-button>
          <!-- 只有寄存中的记录，才能进行「遗失标记」操作 -->
          <el-button type="danger" size="small" @click="markAsLost(scope.$index, scope.row)" :disabled="scope.row.status === '寄存中' ? false : true">标记遗失</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页工具条-->
    <el-col :span="24" class="toolbar">
      <!-- <el-button @click="batchCommonPickup" :disabled="this.sels.length===0">批量正常取件</el-button>
      <el-button type="info" @click="batchOverduePickup" :disabled="this.sels.length===0">批量逾期取件</el-button>
      <el-button type="danger" @click="batchMarkAsLost" :disabled="this.sels.length===0">批量标记遗失</el-button> -->
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

    <!--新增界面-->
    <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="管理员姓名" v-if="false">
          <el-input
            v-model="addForm.adminName"
            auto-complete="off"
            name="adminName"
          ></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input
            v-model="addForm.depositorName"
            auto-complete="on"
            name="depositorName"
            placeholder="请输入寄存人姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input
            v-model="addForm.depositorPhone"
            auto-complete="on"
            name="depositorPhone"
            placeholder="请输入寄存人手机号"
          ></el-input>
        </el-form-item>
        <el-form-item label="行李类型">
          <el-select
            v-model="addForm.luggageTypeId"
            value-key="luggageTypeId"
            clearable
            placeholder="请选择行李类型"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="计费规则">
          <el-select
            v-model="addForm.calculateRuleId"
            value-key="calculateRuleId"
            clearable
            placeholder="请选择计费规则"
          >
            <el-option
              v-for="item in calculateRules"
              :key="item.calculateRuleId"
              :label="item.label"
              :value="item.calculateRuleId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="addForm.remark"
            auto-complete="on"
            name="remark"
            placeholder="备注(行李、日用品之类)"
          ></el-input>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="addForm.storageStartTime"
            type="datetime"
            placeholder="选择寄存开始时间"
            align="right"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="addForm.storageEndTime"
            type="datetime"
            placeholder="选择寄存结束时间"
            align="right"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import util from "../../common/js/util";
import moment from "moment";
import Vue from "vue";
import {
  getStorageRecordListPage,
  addLuggageStorageRecord,
  addCommonPickupRecord,
  addmarkLuggageAsLostRecord,
  addOverduePickupRecord
} from "../../api/api";

export default {
  data() {
    return {
      adminName: this.adminName,
      // 日期类型
      pickerOptions: {
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

      // 行李类型
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

      // 计费规则
      calculateRules: [
        {
          calculateRuleId: "1",
          label: "普通物件-规则1(按小时计费)"
        },
        {
          calculateRuleId: "2",
          label: "普通物件-规则2(按次数计费)"
        },
        {
          calculateRuleId: "3",
          label: "易碎物件-规则1(按小时计费)"
        },
        {
          calculateRuleId: "4",
          label: "易碎物件-规则2(按次数计费)"
        },
        {
          calculateRuleId: "5",
          label: "贵重物件-规则1(按小时计费)"
        },
        {
          calculateRuleId: "6",
          label: "贵重物件-规则2(按次数计费)"
        }
      ],
      calculateRuleId: "",
      filters: {
        depositorName: "",
        luggageRecordNo: "",
        depositorPhone: "",
        storageEndTime: "",
        luggageTypeId: null
      },
      storageRecords: [],
      total: 0,
      pages: 1,
      pageSize: 10,
      currentPage: 1,
      listLoading: false,
      sels: [], //列表选中列

      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormRules: {
        depositorName: [
          { required: true, message: "请输入姓名", trigger: "blur" }
        ],
        depositorPhone: [
          { required: true, message: "请输入手机号", trigger: "blur" }
        ],
        luggageTypeId: [
          { required: true, message: "请选择行李类型", trigger: "blur" }
        ],
        storageEndTime: [
          { required: true, message: "请选择寄存结束日期", trigger: "blur" }
        ]
      },
      // 新增界面数据
      addForm: {
        adminName: this.adminName,
        depositorName: "",
        depositorPhone: "",
        luggageTypeId: null,
        calculateRuleId: null,
        remark: "",
        storageStartTime: "",
        storageEndTime: ""
      }
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
      this.getLuggageStorageRecords();
    },

    // 显示条数变化
    handleSizeChange(val) {
      this.pageSize = val;
      this.getLuggageStorageRecords();
    },

    // 批量正常取件
    // batchCommonPickup: function() {
    //   var ids = this.sels.map(item => item.adminId).toString();
    //   this.$confirm("确认对选中记录进行正常取件操作吗？", "提示", {
    //     type: "info"
    //   })
    //     .then(() => {
    //       this.listLoading = true;
    //       //NProgress.start();
    //       let para = { adminIds: ids };
    //       addCommonPickupRecord(para).then(res => {
    //         this.listLoading = false;
    //         if (res.data.success) {
    //           this.$message({
    //             message: res.data.message,
    //             type: "success"
    //           });
    //         } else {
    //           this.$message({
    //             message: res.data.message,
    //             type: "error"
    //           });
    //         }
    //         this.getAdmins();
    //       });
    //     })
    //     .catch(() => {});
    // },

    // 正常取件
    commonPickup: function(index, row) {
      this.$confirm("确认取件吗?", "提示", {
        type: "info"
      })
        .then(() => {
          this.listLoading = true;
          let para = { luggageIds: row.luggageId };
          addCommonPickupRecord(para).then(res => {
            this.listLoading = false;
            if (res.success) {
              this.$message({
                message: "取件成功",
                type: "success"
              });
            } else {
              this.$message({
                message: res.message,
                type: "error"
              });
            }
            this.getLuggageStorageRecords();
          });
        })
        .catch(() => {});
    },

    // 逾期取件
    overduePickup: function(index, row) {
      this.$confirm("确认进行逾期取件？", "提示", {
        type: "info"
      })
        .then(() => {
          this.listLoading = true;
          let para = { luggageIds: row.luggageId };
          addOverduePickupRecord(para).then(res => {
            this.listLoading = false;
            if (res.success) {
              this.$message({
                message: "逾期取件成功",
                type: "success"
              });
            } else {
              this.$message({
                message: res.message,
                type: "error"
              });
            }
            this.getLuggageStorageRecords();
          });
        })
        .catch(() => {});
    },

    // 标记遗失
    markAsLost: function(index, row) {
      this.$confirm("确认标记该记录为遗失状态？", "提示", {
        type: "warn"
      })
        .then(() => {
          this.listLoading = true;
          let para = { luggageIds: row.luggageId };
          addmarkLuggageAsLostRecord(para).then(res => {
            this.listLoading = false;
            if (res.success) {
              this.$message({
                message: "标记遗失成功",
                type: "success"
              });
            } else {
              this.$message({
                message: res.message,
                type: "error"
              });
            }
            this.getLuggageStorageRecords();
          });
        })
        .catch(() => {});
    },

    // 获取行李寄存记录列表
    getLuggageStorageRecords() {
      let para = {
        current: this.currentPage,
        size: this.pageSize,
        luggageId: this.luggageId,
        luggageRecordNo: this.filters.luggageRecordNo,
        depositorName: this.filters.depositorName,
        depositorPhone: this.filters.depositorPhone
      };
      this.listLoading = true;
      getStorageRecordListPage(para).then(res => {
        if (res.data.success) {
          this.total = res.data.data.total;
          this.pages = res.data.data.pages;
          this.pageSize = res.data.data.size;
          this.storageRecords = res.data.data.records;

          this.listLoading = false;
          // this.$message({
          //   // message: res.data.message,
          //   message: '查询成功',
          //   type: "success"
          // });
        } else {
          this.$message({
            message: res.message,
            type: "error"
          });
        }
      });
    },

    //显示新增界面
    handleAdd: function() {
      this.addFormVisible = true;
      this.addForm = {
        adminName: this.adminName,
        depositorName: "",
        depositorPhone: "",
        luggageTypeId: null,
        calculateRuleId: null,
        remark: "",
        storageStartTime: "",
        storageEndTime: ""
      };
    },

    // 新增行李寄存信息
    addSubmit: function() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.addLoading = true;
            let para = Object.assign({}, this.addForm);
            if (para.luggageTypeId === "普通物件") {
              para.luggageTypeId = 1;
            } else if (para.luggageTypeId === "易碎物件") {
              para.luggageTypeId = 2;
            } else if (para.luggageTypeId === "贵重物件") {
              para.luggageTypeId = 3;
            }

            if (para.calculateRuleId === "普通物件-规则1(按小时计费)") {
              para.calculateRuleId = 1;
            } else if (para.calculateRuleId === "普通物件-规则2(按次数计费)") {
              para.calculateRuleId = 2;
            } else if (para.calculateRuleId === "易碎物件-规则1(按小时计费)") {
              para.calculateRuleId = 3;
            } else if (para.calculateRuleId === "易碎物件-规则2(按次数计费)") {
              para.calculateRuleId = 4;
            } else if (para.calculateRuleId === "贵重物件-规则1(按小时计费)") {
              para.calculateRuleId = 5;
            } else if (para.calculateRuleId === "贵重物件-规则2(按次数计费)") {
              para.calculateRuleId = 6;
            }

            delete para.luggageId;
            delete para.luggageRecordNo;
            delete para.gmtCreate;
            delete para.gmtModified;

            // 日期格式转换
            para.storageStartTime =
              !para.storageStartTime || para.storageStartTime == ""
                ? ""
                : util.formatDate.format(
                    new Date(para.storageStartTime),
                    "yyyy-MM-dd hh:mm:ss"
                  );
            para.storageEndTime =
              !para.storageEndTime || para.storageEndTime == ""
                ? ""
                : util.formatDate.format(
                    new Date(para.storageEndTime),
                    "yyyy-MM-dd hh:mm:ss"
                  );                  
            addLuggageStorageRecord(para).then(res => {
              this.addLoading = false;
              //NProgress.done();
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.$refs["addForm"].resetFields();
              this.addFormVisible = false;
              this.getLuggageStorageRecords();
            });
          });
        }
      });
    },

    selsChange: function(sels) {
      this.sels = sels;
    }
  },
  mounted() {
    this.getLuggageStorageRecords();
    var user = sessionStorage.getItem("user");
    if (user) {
	  user = JSON.parse(user);
	  console.log("当前登录人:" + user)
      this.adminName = user || "";
    }
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