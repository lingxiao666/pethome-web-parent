<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="query">
                <el-form-item>
                    <el-input v-model="query.keyWord" placeholder="关键字"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getDepartments">查询</el-button>

                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="departments" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="name" label="名称" width="120" sortable>
            </el-table-column>
            <!--:formatter="formatSex" -->
            <el-table-column prop="sn" label="标识" width="100" sortable>
            </el-table-column>
            <el-table-column prop="dirPath" label="路径" width="100" sortable>
            </el-table-column>
            <!--<el-table-column prop="state" label="状态" width="120" sortable>
            </el-table-column>-->
            <!--
                格式化有两方式：
                   1 :formatter不能加样式 :formatter="formatState"
                   2 <template scope="scope">
            -->
            <el-table-column prop="state" label="状态" width="120" sortable>
                <template scope="scope">
                    <span v-if="scope.row.state==0" style="color: green">启用</span>
                    <span v-else style="color: red">禁用</span>
                </template>
            </el-table-column>
            <el-table-column prop="manager.username" label="经理" width="180" sortable>
            </el-table-column>
            <el-table-column prop="parent.name" label="上级部门" width="180" sortable>
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--分页工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10"
                           :total="total" style="float:right;">
            </el-pagination>
        </el-col>

        <!--编辑界面-->
        <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="标识" prop="sn">
                    <el-input v-model="editForm.sn" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="路径" prop="dirPath">
                    <el-input v-model="editForm.dirPath" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio-group v-model="editForm.state">
                        <el-radio class="radio" :label="0">正常</el-radio>
                        <el-radio class="radio" :label="-1">停用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="部门经理" prop="manager">
                    <!--<el-input v-model="editForm.employees" auto-complete="off"></el-input>-->
                    <el-select v-model="editForm.manager" placeholder="请选择" value-key="id">
                        <el-option
                                v-for="item in employees"
                                :key="item.id"
                                :label="item.username"
                                :value="item">
                            <span style="float: left">{{ item.username }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.id }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="上级部门" prop="parent">
                    <el-cascader
                            v-model="editForm.parent"
                            :options="tree"
                            :props="{checkStrictly: true ,label:'name',value:'id'}"
                            clearable></el-cascader>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--新增界面-->
        <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="addForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="标识" prop="sn">
                    <el-input v-model="addForm.sn" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="路径" prop="dirPath">
                    <el-input v-model="addForm.dirPath" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio-group v-model="addForm.state">
                        <el-radio class="radio" :label="0">正常</el-radio>
                        <el-radio class="radio" :label="-1">停用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="部门经理" prop="manager">
                    <!--<el-input v-model="editForm.employees" auto-complete="off"></el-input>-->
                    <el-select v-model="addForm.manager" placeholder="请选择" value-key="id">
                        <el-option
                                v-for="item in employees"
                                :key="item.id"
                                :label="item.username"
                                :value="item">
                            <span style="float: left">{{ item.username }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.email }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="上级部门" prop="parent">
                    <!--<el-input v-model="editForm.tree" auto-complete="off"></el-input>-->
                    <el-cascader
                            v-model="addForm.parent"
                            :options="tree"
                            :props="{ checkStrictly: true ,label:'name',value:'id'}"
                            clearable></el-cascader>
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

    export default {
        data() {
            return {
                query: {
                    keyWord: ''
                },
                departments: [],
                total: 0,
                currentPage: 1,
                listLoading: false,
                sels: [],//列表选中列
                employees: [],
                tree: [],
                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    name: [
                        {required: true, message: '请输入姓名', trigger: 'blur'}
                    ]
                },

                //编辑界面数据
                editForm: {
                    id: null,
                    name: '',
                    sn: '',
                    dirPath: '',
                    state: 0,
                    manager: null,
                    parent: null
                },

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    name: [
                        {required: true, message: '请输入姓名', trigger: 'blur'}
                    ]
                },
                //新增界面数据
                addForm: {
                    name: '',
                    sn: '',
                    dirPath: '',
                    state: 0,
                    manager: null,
                    parent: null
                }

            }
        },
        methods: {

            getEmployees() {
                this.$http.get("/employee").then(result => {
                    this.employees = result.data
                })
            },
            getTree() {
                this.$http.get("/department/tree").then(result => {
                    this.tree = result.data
                })
            },
            //性别显示转换
            formatSex: function (row, column) {
                return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
            },
            /*分页条监测*/
            handleCurrentChange(val) {
                this.page = val;
                this.getDepartments();
            },
            //获取用户列表
            getDepartments() {
                let para = {
                    currentPage: this.page,
                    keyWord: this.query.keyWord,

                    /*name: this.query.name*/
                };
                this.listLoading = true;
                this.$http.post("/department", para)
                    .then(result => {
                        this.departments = result.data.data
                        this.total = result.data.total
                        this.listLoading = false;
                    })
                    .catch(result => {
                        console.log(result)

                    })
            },
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let url = "/department/ " + row.id
                    this.$http.delete(url)
                        .then(result => {
                            this.listLoading = false;
                            if (result.data.success) {
                                this.$message({
                                    message: '删除成功',
                                    type: 'success'
                                });
                            } else {
                                this.$message({
                                    message: result.data.message,
                                    type: 'error'
                                });
                            }
                            /*刷新页面*/
                            this.getDepartments();
                        })
                }).catch(() => {
                    //取消后操作
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            //显示编辑界面
            handleEdit: function (index, row) {
                this.editFormVisible = true;
                this.getEmployees();
                this.getTree();
                this.editForm = Object.assign({}, row);
            },
            //显示新增界面
            handleAdd: function () {
                this.addFormVisible = true;
                this.addForm = {
                    name: '',
                    sn: '',
                    dirPath: '',
                    state: 0,
                    manager: null,
                    parent: null

                };
                this.getEmployees();
                this.getTree();

            },
            //编辑
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            let para = Object.assign({}, this.editForm);
                            let ids = this.editForm.parent
                            para.parent = {
                                id: ids[ids.length - 1]
                            }
                            console.log(this.editForm)
                            this.$http.put("/department", para).then(result => {
                                this.editLoading = false;
                                if (result.data.success) {
                                    this.$message({
                                        message: '提交成功',
                                        type: 'success'
                                    });
                                } else {
                                    this.$message({
                                        message: result.data.message,
                                        type: 'error'
                                    });
                                }
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                                this.getDepartments();
                            })
                        })
                            .catch(() => {
                                //取消后操作
                                this.$message({
                                    type: 'info',
                                    message: '已取消操作'
                                });
                            })
                    }
                });
            },
            //新增
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认添加吗？', '提示', {})
                            .then(() => {
                                this.addLoading = true;
                                let para = Object.assign({}, this.addForm);
                                let ids = this.addForm.parent
                                para.parent = {
                                    id: ids[ids.length - 1]
                                }
                                this.$http.put("/department", para).then(result => {
                                    this.addLoading = false;
                                    if (result.data.success) {
                                        this.$message({
                                            message: '提交成功',
                                            type: 'success'
                                        });
                                    } else {
                                        this.$message({
                                            message: result.data.message,
                                            type: 'error'
                                        });
                                    }
                                    this.$refs['addForm'].resetFields();
                                    this.addFormVisible = false;
                                    this.getDepartments();
                                })
                            })
                            .catch(() => {
                                //取消后操作
                                this.$message({
                                    type: 'info',
                                    message: '已取消新增'
                                });
                            })
                    }
                });
            },
            /*批量删除多选框监测*/
            selsChange: function (sels) {
                this.sels = sels;
            },
            //批量删除
            batchRemove: function () {
                var ids = this.sels.map(item => item.id);
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    console.log(this.ids)
                    this.$http.patch("department/bulk", ids)
                        .then(result => {
                            this.listLoading = false;
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getDepartments();
                        })
                        .catch(result => {
                            this.$message({
                                message: result.data.message,
                                type: 'error'
                            });
                        })
                }).catch(() => {
                    //取消后操作
                    this.$message({
                        type: 'info',
                        message: '已取消批量删除'
                    });
                });
            }
        },
        mounted() {
            this.getDepartments();
        }
    }

</script>

<style scoped>

</style>