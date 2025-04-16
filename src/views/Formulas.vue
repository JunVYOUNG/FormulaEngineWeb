<template>
  <div class="formulas-page page-container">
    <div class="page-header">
      <h1>公式管理</h1>
      <div class="header-actions">
        <el-button type="primary" @click="dialogVisible = true">
          <i class="el-icon-plus"></i> 添加公式
        </el-button>
      </div>
    </div>
    
    <el-card shadow="hover" class="formula-card">
      <el-table :data="formulas" style="width: 100%;" border stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="formulaName" label="公式名称" min-width="150">
          <template #default="scope">
            <el-tag size="medium" type="primary">{{ scope.row.formulaName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" min-width="250" />
        <el-table-column label="操作" min-width="300" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.row)">
              <i class="el-icon-edit"></i> 编辑
            </el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope.row)">
              <i class="el-icon-delete"></i> 删除
            </el-button>
            <el-button type="success" size="small" @click="goToCalculate(scope.row)">
              <i class="el-icon-video-play"></i> 计算
            </el-button>
            <el-button type="info" size="small" @click="viewExpression(scope.row)">
              <i class="el-icon-view"></i> 查看表达式
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div v-if="formulas.length === 0" class="empty-placeholder">
        <el-empty description="暂无公式数据"></el-empty>
      </div>
    </el-card>
    
    <!-- 添加/编辑公式对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑公式' : '添加公式'"
      width="60%"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <el-form :model="form" label-width="120px" :rules="rules" ref="formRef">
        <el-form-item label="公式名称" prop="formulaName">
          <el-input v-model="form.formulaName" placeholder="请输入公式名称" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" placeholder="请输入公式描述" :rows="2" />
        </el-form-item>
        <el-form-item label="表达式" prop="expression">
          <el-input v-model="form.expression" type="textarea" placeholder="请输入公式表达式，例如: DATA.A + 2 * DEF(DATA.B, 1, 3)" :rows="5" />
        </el-form-item>
      </el-form>
      <div class="operators-reference">
        <h3>可用运算符</h3>
        <el-table :data="operators" height="200" style="width: 100%" border stripe>
          <el-table-column prop="operatorName" label="运算符名称" width="150">
            <template #default="scope">
              <el-tag size="medium" type="primary">{{ scope.row.operatorName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="描述" min-width="200" />
          <el-table-column prop="paramCount" label="参数数量" width="100">
            <template #default="scope">
              <el-badge :value="scope.row.paramCount" type="primary" />
            </template>
          </el-table-column>
          <el-table-column label="示例" min-width="150">
            <template #default="scope">
              <code>{{ scope.row.operatorName }}({{ Array(scope.row.paramCount).fill('?').join(', ') }})</code>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确认</el-button>
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
        <p>确定要删除公式 "<strong>{{ currentFormula?.formulaName }}</strong>" 吗？</p>
        <p class="delete-hint">删除后不可恢复</p>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="confirmDelete">确认删除</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 查看表达式对话框 -->
    <el-dialog
      v-model="expressionDialogVisible"
      title="公式表达式"
      width="50%"
    >
      <div class="expression-dialog-content">
        <div class="expression-info">
          <div class="info-row">
            <span class="info-label">公式名称:</span>
            <el-tag size="medium" type="primary">{{ currentFormula?.formulaName }}</el-tag>
          </div>
          <div class="info-row">
            <span class="info-label">描述:</span>
            <span>{{ currentFormula?.description }}</span>
          </div>
        </div>
        <el-divider />
        <div class="expression-container">
          <pre>{{ currentFormula?.expression }}</pre>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

export default {
  name: 'FormulasView',
  setup() {
    const router = useRouter()
    const formulas = ref([])
    const operators = ref([])
    const dialogVisible = ref(false)
    const deleteDialogVisible = ref(false)
    const expressionDialogVisible = ref(false)
    const isEdit = ref(false)
    const currentFormula = ref(null)
    const formRef = ref(null)
    
    const form = ref({
      formulaName: '',
      description: '',
      expression: ''
    })
    
    const rules = reactive({
      formulaName: [
        { required: true, message: '请输入公式名称', trigger: 'blur' },
        { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
      ],
      description: [
        { max: 200, message: '长度不超过 200 个字符', trigger: 'blur' }
      ],
      expression: [
        { required: true, message: '请输入公式表达式', trigger: 'blur' }
      ]
    })
    
    // 获取所有公式
    const fetchFormulas = async () => {
      try {
        const response = await axios.get('/formulas')
        formulas.value = response.data
      } catch (error) {
        ElMessage.error('获取公式列表失败')
        console.error(error)
      }
    }
    
    // 获取所有运算符
    const fetchOperators = async () => {
      try {
        const response = await axios.get('/operators')
        operators.value = response.data
      } catch (error) {
        ElMessage.error('获取运算符列表失败')
        console.error(error)
      }
    }
    
    // 编辑公式
    const handleEdit = (row) => {
      isEdit.value = true
      currentFormula.value = row
      form.value = { ...row }
      dialogVisible.value = true
    }
    
    // 删除公式
    const handleDelete = (row) => {
      currentFormula.value = row
      deleteDialogVisible.value = true
    }
    
    // 确认删除
    const confirmDelete = async () => {
      try {
        await axios.delete(`/formulas/${currentFormula.value.id}`)
        ElMessage.success('删除成功')
        fetchFormulas()
        deleteDialogVisible.value = false
      } catch (error) {
        ElMessage.error('删除失败')
        console.error(error)
      }
    }
    
    // 提交表单
    const submitForm = async () => {
      if (!formRef.value) return
      
      await formRef.value.validate(async (valid) => {
        if (valid) {
          try {
            if (isEdit.value) {
              await axios.put(`/formulas/${currentFormula.value.id}`, form.value)
              ElMessage.success('更新成功')
            } else {
              await axios.post('/formulas', form.value)
              ElMessage.success('添加成功')
            }
            fetchFormulas()
            dialogVisible.value = false
            resetForm()
          } catch (error) {
            ElMessage.error(isEdit.value ? '更新失败' : '添加失败')
            console.error(error)
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
        formulaName: '',
        description: '',
        expression: ''
      }
      isEdit.value = false
      currentFormula.value = null
    }

    // 查看表达式
    const viewExpression = (row) => {
      currentFormula.value = row
      expressionDialogVisible.value = true
    }

    // 跳转到计算页面
    const goToCalculate = (row) => {
      router.push({
        path: '/calculator',
        query: { formulaName: row.formulaName }
      })
    }
    
    onMounted(() => {
      fetchFormulas()
      fetchOperators()
    })
    
    return {
      formulas,
      operators,
      dialogVisible,
      deleteDialogVisible,
      expressionDialogVisible,
      isEdit,
      currentFormula,
      form,
      formRef,
      rules,
      handleEdit,
      handleDelete,
      confirmDelete,
      submitForm,
      viewExpression,
      goToCalculate
    }
  }
}
</script>

<style scoped>
.formulas-page {
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

.formula-card {
  margin-bottom: 20px;
  width: 100%;
}

.operators-reference {
  margin-top: 20px;
  margin-bottom: 20px;
  width: 100%;
}

.operators-reference h3 {
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 500;
}

.expression-container {
  background-color: #f5f7fa;
  border-radius: 4px;
  padding: 15px;
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #ebeef5;
  width: 100%;
}

.expression-container pre {
  white-space: pre-wrap;
  word-break: break-all;
  margin: 0;
  font-family: Consolas, Monaco, 'Andale Mono', monospace;
  font-size: 14px;
  color: #303133;
  line-height: 1.5;
}

.empty-placeholder {
  padding: 30px 0;
  width: 100%;
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

.expression-dialog-content {
  width: 100%;
}

.expression-info {
  margin-bottom: 15px;
  width: 100%;
}

.info-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  gap: 10px;
}

.info-label {
  font-weight: 500;
  color: #606266;
  width: 80px;
  flex-shrink: 0;
}

code {
  background-color: #f5f7fa;
  padding: 2px 5px;
  border-radius: 3px;
  font-family: Consolas, Monaco, 'Andale Mono', monospace;
  color: #c7254e;
  font-size: 13px;
}

/* 响应式样式调整 */
@media (max-width: 768px) {
  .formulas-page {
    padding: 15px 0;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .info-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .info-label {
    width: auto;
  }
}

@media (max-width: 480px) {
  .el-button {
    margin-bottom: 5px;
  }
  
  .el-dialog {
    width: 95% !important;
    margin: 0 auto;
  }
}
</style> 