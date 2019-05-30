<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input size="32px" v-model="filters.condition" placeholder="输入管理员姓名或者编号(模糊查询)"></el-input>
        </el-form-item>
        <el-select v-model="filters.adminType" clearable placeholder="管理员类型">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-form-item>
          <el-button type="primary" v-on:click="getAdmins">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table
      :data="users"
      highlight-current-row
      v-loading="listLoading"
      @selection-change="selsChange"
      style="width: 100%;"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="adminId" label="管理员id" width="80" v-if="false"></el-table-column>
      <el-table-column prop="adminNo" label="管理员编号" width="180" sortable></el-table-column>
      <el-table-column prop="adminName" label="姓名" width="100" sortable></el-table-column>
      <el-table-column prop="adminPhone" label="电话" width="125" sortable></el-table-column>
      <el-table-column prop="password" label="登录密码" min-width="120" sortable></el-table-column>
      <el-table-column label="类型" width="120">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.adminType === '系统'">系统</el-tag>
          <el-tag type="warning" v-if="scope.row.adminType === '普通管理员'">普通管理员</el-tag>
          <el-tag type="danger" v-if="scope.row.adminType === '超级管理员'">超级管理员</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="gmtCreate"
        label="创建时间"
        :formatter="dateFormat"
        min-width="180"
        sortable
      ></el-table-column>
      <el-table-column
        prop="gmtModified"
        label="修改时间"
        :formatter="dateFormat"
        min-width="180"
        sortable
      ></el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--批量删除工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
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

    <!--编辑界面-->
    <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="姓名" prop="adminName">
          <el-input v-model="editForm.adminName"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="adminType">
          <el-select
            v-model="editForm.adminType"
            value-key="adminType"
            clearable
            placeholder="管理员类型"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="adminPhone">
          <el-input v-model="editForm.adminPhone"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--新增界面-->
    <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="姓名">
          <el-input
            v-model="addForm.adminName"
            auto-complete="on"
            name="adminName"
            placeholder="请输入姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select
            v-model="addForm.adminType"
            value-key="adminType"
            clearable
            placeholder="请选择管理员类型"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input
            v-model="addForm.adminPhone"
            auto-complete="on"
            name="adminPhone"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>
        <el-form-item label="登录密码">
          <el-input
            v-model="addForm.password"
            auto-complete="on"
            name="password"
            placeholder="请输入登录密码"
          ></el-input>
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
import {
  getAdminListPage,
  removeAdmin,
  batchRemoveAdmin,
  saveAdmin,
  addAdmin
} from "../../api/api";

export default {
  data() {
    return {
      options: [
        {
          value: "1",
          label: "普通管理员"
        },
        {
          value: "2",
          label: "超级管理员"
        },
        {
          value: "3",
          label: "系统"
        }
      ],
      value: "",
      filters: {
        condition: "",
        adminType: null
      },
      users: [],
      total: 0,
      pages: 1,
      pageSize: 10,
      currentPage: 1,
      listLoading: false,
      sels: [], //列表选中列

      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      editFormRules: {
        adminName: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        adminType: [
          { required: true, message: "请选择管理员类型", trigger: "blur" }
        ],
        adminPhone: [
          { required: true, message: "请输入手机号", trigger: "blur" }
        ]
      },
      // 编辑界面数据
      editForm: {
        adminId: null,
        adminName: "",
        adminPhone: "",
        adminType: -1
      },

      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormRules: {
        adminName: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        adminType: [
          { required: true, message: "请选择管理员类型", trigger: "blur" }
        ],
        adminPhone: [
          { required: true, message: "请输入手机号", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      // 新增界面数据
      addForm: {
        adminName: "",
        adminPhone: "",
        password: "",
        adminType: -1
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
      this.getAdmins();
    },

    // 显示条数变化
    handleSizeChange(val) {
      this.pageSize = val;
      this.getAdmins();
    },

    // 获取管理员信息列表
    getAdmins() {
      let para = {
        current: this.currentPage,
        size: this.pageSize,
        adminId: this.adminId,
        queryCondition: this.filters.condition,
        adminType: this.filters.adminType
      };
      this.listLoading = true;
      getAdminListPage(para).then(res => {
        if (res.data.success) {
          this.total = res.data.data.total;
          this.pages = res.data.data.pages;
          this.pageSize = res.data.data.size;
          this.users = res.data.data.records;
          this.listLoading = false;
        } else {
          this.$message({
            message: res.data.message,
            type: "error"
          });
        }
      });
    },

    // 显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    // 显示新增界面
    handleAdd: function() {
      this.addFormVisible = true;
      this.addForm = {
        adminName: "",
        adminPhone: "",
        password: "",
        adminType: "普通管理员"
      };
    },

    // 编辑管理员信息
    editSubmit: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            let para = Object.assign({}, this.editForm);
            if (para.adminType === "普通管理员") {
              para.adminType = 1;
            } else if (para.adminType === "超级管理员") {
              para.adminType = 2;
            } else {
              para.adminType = 3;
            }
            delete para.adminNo;
            delete para.gmtCreate;
            delete para.gmtModified;
            saveAdmin(para).then(res => {
              this.editLoading = false;
              if (res.success === true) {
                this.$message({
                  message: "提交成功",
                  type: "success"
                });
                this.$refs["editForm"].resetFields();
                this.editFormVisible = false;
                this.getAdmins();
              } else {
                this.$message({
                  message: res.message,
                  type: "error"
                });
              }
            });
          });
        }
      });
    },
    //新增管理员信息
    addSubmit: function() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.addLoading = true;
            //NProgress.start();
            let para = Object.assign({}, this.addForm);
            if (para.adminType === "普通管理员") {
              para.adminType = 1;
            } else if (para.adminType === "超级管理员") {
              para.adminType = 2;
            } else {
              para.adminType = 3;
            }
            delete para.adminId;
            delete para.adminNo;
            delete para.gmtCreate;
            delete para.gmtModified;
            addAdmin(para).then(res => {
              this.addLoading = false;
              if (res.success === true) {
                this.$message({
                  message: "提交成功",
                  type: "success"
                });
                this.$refs["addForm"].resetFields();
                this.addFormVisible = false;
                this.getAdmins();
              } else {
                this.$message({
                  message: res.message,
                  type: "error"
                });
              }
            });
          });
        }
      });
    },
    selsChange: function(sels) {
      this.sels = sels;
    },

    // 删除
    handleDel: function(index, row) {
      this.$confirm("确认删除该管理员吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          let para = { adminIds: row.adminId };
          removeAdmin(para).then(res => {
            this.listLoading = false;
            if (res.data.success) {
              this.$message({
                // message: res.data.message,
                message: "删除成功",
                type: "success"
              });
            } else {
              this.$message({
                message: res.data.message,
                type: "error"
              });
            }
            this.getAdmins();
          });
        })
        .catch(() => {});
    },

    //批量删除管理员信息
    batchRemove: function() {
      var ids = this.sels.map(item => item.adminId).toString();
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          let para = { adminIds: ids };
          batchRemoveAdmin(para).then(res => {
            this.listLoading = false;
            if (res.data.success) {
              this.$message({
                // message: res.data.message,
                message: "删除成功",
                type: "success"
              });
            } else {
              this.$message({
                message: res.data.message,
                type: "error"
              });
            }
            this.getAdmins();
          });
        })
        .catch(() => {});
    }
  },
  mounted() {
    this.getAdmins();
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