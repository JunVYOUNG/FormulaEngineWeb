<template>
  <div class="operators-page page-container">
    <div class="page-header">
      <h1>运算符管理</h1>
      <div class="header-actions">
        <el-button type="primary" @click="dialogVisible = true">
          <i class="el-icon-plus"></i> 添加运算符
        </el-button>
      </div>
    </div>
    
    <el-card shadow="hover" class="operator-card">
      <div class="table-toolbar">
        <el-input
          v-model="searchQuery"
          placeholder="搜索运算符"
          clearable
          prefix-icon="el-icon-search"
          class="search-input"
        />
      </div>
      
      <el-table 
        :data="filteredOperators" 
        style="width: 100%;" 
        border 
        stripe
        v-loading="loading"
        element-loading-text="加载中..."
        class="responsive-table"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="operatorName" label="运算符名称" min-width="150">
          <template #default="scope">
            <el-tag size="medium" type="primary">{{ scope.row.operatorName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" min-width="200" />
        <el-table-column prop="serviceName" label="服务名称" min-width="150" />
        <el-table-column prop="methodName" label="方法名称" min-width="150" />
        <el-table-column prop="paramCount" label="参数数量" min-width="100">
          <template #default="scope">
            <el-badge :value="scope.row.paramCount" type="primary" />
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="180" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.row)">
              <i class="el-icon-edit"></i> 编辑
            </el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope.row)">
              <i class="el-icon-delete"></i> 删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="empty-placeholder" v-if="filteredOperators.length === 0 && !loading">
        <el-empty description="暂无运算符数据"></el-empty>
      </div>
    </el-card>
    
    <!-- 添加/编辑运算符对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑运算符' : '添加运算符'"
      width="50%"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <el-form :model="form" label-width="120px" :rules="rules" ref="formRef">
        <el-form-item label="运算符名称" prop="operatorName">
          <el-input v-model="form.operatorName" placeholder="请输入运算符名称，如：DEF、POWER" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" placeholder="请输入运算符的描述信息" :rows="3" />
        </el-form-item>
        <el-form-item label="服务名称" prop="serviceName">
          <el-input v-model="form.serviceName" placeholder="请输入在Spring容器中的Bean名称" />
        </el-form-item>
        <el-form-item label="方法名称" prop="methodName">
          <el-input v-model="form.methodName" placeholder="请输入要调用的方法名" />
        </el-form-item>
        <el-form-item label="参数数量" prop="paramCount">
          <el-input-number v-model="form.paramCount" :min="0" :max="10" :step="1" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm" :loading="submitting">{{ isEdit ? '更新' : '确认' }}</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 删除确认对话框 -->
    <el-dialog
      v-model="deleteDialogVisible"
      title="删除确认"
      width="30%"
      :close-on-click-modal="false"
    >
      <div class="delete-confirm">
        <i class="el-icon-warning-outline warning-icon"></i>
        <p>确定要删除运算符 "<strong>{{ currentOperator?.operatorName }}</strong>" 吗？</p>
        <p class="delete-hint">删除后不可恢复，依赖此运算符的公式可能无法正常工作。</p>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="confirmDelete" :loading="deleting">确认删除</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, computed, reactive, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage, ElNotification } from 'element-plus'

export default {
  name: 'OperatorsView',
  setup() {
    const operators = ref([])
    const dialogVisible = ref(false)
    const deleteDialogVisible = ref(false)
    const isEdit = ref(false)
    const currentOperator = ref(null)
    const searchQuery = ref('')
    const loading = ref(true)
    const submitting = ref(false)
    const deleting = ref(false)
    const formRef = ref(null)
    
    const form = ref({
      operatorName: '',
      description: '',
      serviceName: '',
      methodName: '',
      paramCount: 1
    })
    
    const rules = reactive({
      operatorName: [
        { required: true, message: '请输入运算符名称', trigger: 'blur' },
        { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
      ],
      description: [
        { max: 200, message: '长度不超过 200 个字符', trigger: 'blur' }
      ],
      serviceName: [
        { required: true, message: '请输入服务名称', trigger: 'blur' }
      ],
      methodName: [
        { required: true, message: '请输入方法名称', trigger: 'blur' }
      ],
      paramCount: [
        { required: true, message: '请输入参数数量', trigger: 'change' },
        { type: 'number', min: 0, message: '参数数量必须大于等于0', trigger: 'change' }
      ]
    })
    
    // 过滤后的运算符数据
    const filteredOperators = computed(() => {
      if (!searchQuery.value) return operators.value
      
      const query = searchQuery.value.toLowerCase()
      return operators.value.filter(op => 
        op.operatorName.toLowerCase().includes(query) || 
        op.description.toLowerCase().includes(query) ||
        op.serviceName.toLowerCase().includes(query) ||
        op.methodName.toLowerCase().includes(query)
      )
    })
    
    // 获取所有运算符
    const fetchOperators = async () => {
      loading.value = true
      try {
        const response = await axios.get('/operators')
        operators.value = response.data
        ElNotification({
          title: '数据加载成功',
          message: `已成功加载 ${operators.value.length} 个运算符`,
          type: 'success',
          duration: 2000
        })
      } catch (error) {
        ElMessage.error('获取运算符列表失败')
        console.error(error)
      } finally {
        loading.value = false
      }
    }
    
    // 编辑运算符
    const handleEdit = (row) => {
      isEdit.value = true
      currentOperator.value = row
      form.value = { ...row }
      dialogVisible.value = true
    }
    
    // 删除运算符
    const handleDelete = (row) => {
      currentOperator.value = row
      deleteDialogVisible.value = true
    }
    
    // 确认删除
    const confirmDelete = async () => {
      deleting.value = true
      try {
        await axios.delete(`/operators/${currentOperator.value.id}`)
        ElMessage.success('删除成功')
        fetchOperators()
        deleteDialogVisible.value = false
      } catch (error) {
        ElMessage.error('删除失败')
        console.error(error)
      } finally {
        deleting.value = false
      }
    }
    
    // 提交表单
    const submitForm = async () => {
      if (!formRef.value) return
      
      await formRef.value.validate(async (valid) => {
        if (valid) {
          submitting.value = true
          try {
            if (isEdit.value) {
              await axios.put(`/operators/${currentOperator.value.id}`, form.value)
              ElMessage.success('更新成功')
            } else {
              await axios.post('/operators', form.value)
              ElMessage.success('添加成功')
            }
            fetchOperators()
            dialogVisible.value = false
            resetForm()
          } catch (error) {
            ElMessage.error(isEdit.value ? '更新失败' : '添加失败')
            console.error(error)
          } finally {
            submitting.value = false
          }
        }
      })
    }
    
    // 重置表单
    const resetForm = () => {
      if (formRef.value) {
        formRef.value.resetFields()
      }
      form.value = {
        operatorName: '',
        description: '',
        serviceName: '',
        methodName: '',
        paramCount: 1
      }
      isEdit.value = false
      currentOperator.value = null
    }
    
    onMounted(() => {
      fetchOperators()
    })
    
    return {
      operators,
      filteredOperators,
      dialogVisible,
      deleteDialogVisible,
      isEdit,
      currentOperator,
      form,
      rules,
      formRef,
      searchQuery,
      loading,
      submitting,
      deleting,
      handleEdit,
      handleDelete,
      confirmDelete,
      submitForm
    }
  }
}
</script>

<style scoped>
.operators-page {
  padding: 20px 0;
  width: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  width: 100%;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.operator-card {
  margin-bottom: 20px;
  width: 100%;
}

.table-toolbar {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-end;
}

.search-input {
  width: 300px;
}

.responsive-table {
  width: 100%;
  overflow-x: auto;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.delete-confirm {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.warning-icon {
  font-size: 50px;
  color: #E6A23C;
  margin-bottom: 15px;
}

.delete-hint {
  margin-top: 10px;
  color: #909399;
  font-size: 14px;
}

.empty-placeholder {
  padding: 30px 0;
}

/* 响应式样式调整 */
@media (max-width: 768px) {
  .operators-page {
    padding: 15px 0;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .table-toolbar {
    flex-direction: column;
    gap: 10px;
  }
  
  .search-input {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .el-form-item {
    margin-bottom: 18px;
  }
  
  .el-dialog {
    width: 95% !important;
    margin: 0 auto;
  }
}
</style> 