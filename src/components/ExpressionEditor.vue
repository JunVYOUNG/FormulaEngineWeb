<template>
  <div class="expression-editor" @click="focusInput">
    <div class="token-container" ref="tokenContainer">
      <template v-for="(token, index) in tokens" :key="index">
        <!-- 数值 -->
        <el-tag 
          v-if="isNumber(token)"
          class="token number-token"
          type="success"
          :class="{ 'selected': selectedIndex === index }"
          @click.stop="selectToken(index)"
        >
          {{ token }}
        </el-tag>
        
        <!-- 字符串 -->
        <el-tag 
          v-else-if="isString(token)"
          class="token string-token"
          type="warning"
          :class="{ 'selected': selectedIndex === index }"
          @click.stop="selectToken(index)"
        >
          {{ token }}
        </el-tag>
        
        <!-- 变量 -->
        <el-tag 
          v-else-if="isVariable(token)"
          class="token variable-token"
          type="info"
          :class="{ 'selected': selectedIndex === index }"
          @click.stop="selectToken(index)"
        >
          {{ token }}
        </el-tag>
        
        <!-- 函数 -->
        <el-tag 
          v-else-if="isFunction(token)"
          class="token function-token"
          type="primary"
          :class="{ 'selected': selectedIndex === index }"
          @click.stop="selectToken(index)"
        >
          {{ token }}
        </el-tag>
        
        <!-- 运算符 -->
        <el-tag 
          v-else-if="isOperator(token)"
          class="token operator-token"
          type="danger"
          :class="{ 'selected': selectedIndex === index }"
          @click.stop="selectToken(index)"
        >
          {{ token }}
        </el-tag>
        
        <!-- 括号 -->
        <el-tag 
          v-else-if="isOpenParen(token) || isCloseParen(token)"
          class="token paren-token"
          :class="{ 'selected': selectedIndex === index }"
          @click.stop="selectToken(index)"
        >
          {{ token }}
        </el-tag>
      </template>
      
      <!-- 隐藏的输入框，用于捕获键盘输入 -->
      <input
        ref="hiddenInput"
        type="text"
        class="hidden-input"
        v-model="currentInput"
        @keydown.enter="handleEnter"
        @keydown.delete="handleDelete"
        @keydown.left="moveSelection(-1)"
        @keydown.right="moveSelection(1)"
        @keydown.space.prevent="handleSpace"
      >
    </div>
    
    <!-- 快捷操作按钮 -->
    <div class="quick-actions" v-if="selectedIndex !== -1">
      <el-button-group>
        <el-button 
          v-if="canDelete"
          size="small" 
          type="danger" 
          @click.stop="deleteToken"
        >
          删除
        </el-button>
        <el-button 
          v-if="canEdit"
          size="small" 
          type="primary" 
          @click.stop="startEditing"
        >
          编辑
        </el-button>
        <el-button 
          v-if="canEditOperator"
          size="small" 
          type="warning" 
          @click.stop="startEditingOperator"
        >
          编辑参数
        </el-button>
      </el-button-group>
    </div>

    <!-- 编辑对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      title="编辑值"
      width="30%"
      :close-on-click-modal="false"
    >
      <el-form>
        <el-form-item label="新值">
          <el-input v-model="currentInput" @keydown.enter="confirmEdit" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmEdit">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'

export default {
  name: 'ExpressionEditor',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    operators: {
      type: Array,
      default: () => []
    }
  },
  
  emits: ['update:modelValue', 'edit-operator'],
  
  setup(props, { emit }) {
    const tokenContainer = ref(null)
    const hiddenInput = ref(null)
    const selectedIndex = ref(-1)
    const currentInput = ref('')
    const editDialogVisible = ref(false)
    
    // 将表达式分割成token
    const tokenize = (expr) => {
      if (!expr) return []
      const tokens = []
      let current = ''
      let parenCount = 0
      let inFunction = false
      let currentFunction = ''
      
      const addToken = () => {
        if (current.trim()) {
          tokens.push(current.trim())
        }
        current = ''
      }
      
      for (let i = 0; i < expr.length; i++) {
        const char = expr[i]
        
        if (char === '(') {
          if (current.trim() && /^[A-Z_]+$/.test(current.trim())) {
            // 如果是函数调用的开始
            inFunction = true
            currentFunction = current.trim()
            current += char
          } else if (inFunction) {
            // 如果已经在函数内部，这可能是嵌套函数或普通括号
            // 在函数内部的所有内容都作为函数的一部分处理
            current += char
            parenCount++
          } else {
            // 如果是普通括号
            addToken()
            tokens.push(char)
          }
          parenCount++
        } else if (char === ')') {
          parenCount--
          if (inFunction) {
            // 在函数内部
            current += char
            if (parenCount === 0) {
              // 如果是最外层函数的结束
              addToken()
              inFunction = false
              currentFunction = ''
            }
          } else {
            // 如果是普通括号
            addToken()
            tokens.push(char)
          }
        } else if (char === ',' && inFunction) {
          // 在函数参数中的逗号
          current += char
        } else if (inFunction) {
          // 在函数调用内部的任何字符
          current += char
        } else if (char === ' ' || char === '\t') {
          addToken()
        } else if ('+-*/%'.includes(char)) {
          addToken()
          tokens.push(char)
        } else {
          current += char
        }
      }
      
      addToken()
      return tokens
    }
    
    const tokens = computed(() => tokenize(props.modelValue))
    
    // Token类型判断函数
    const isNumber = (token) => /^-?\d+(\.\d+)?$/.test(token)
    const isString = (token) => /^".*"$/.test(token)
    const isVariable = (token) => token.startsWith('DATA.')
    const isOperator = (token) => /^[\+\-\*\/\%]$/.test(token)
    const isOpenParen = (token) => token === '('
    const isCloseParen = (token) => token === ')'
    const isFunction = (token) => {
      if (!token) return false
      const match = token.match(/^([A-Z_]+)\s*\((.*)\)$/)
      if (!match) return false
      const [_, funcName] = match
      return props.operators.some(op => op.operatorName === funcName)
    }
    
    // 计算当前选中token是否可以编辑或删除
    const canEdit = computed(() => {
      if (selectedIndex.value === -1) return false
      const token = tokens.value[selectedIndex.value]
      return isNumber(token) || isString(token)
    })
    
    const canEditOperator = computed(() => {
      if (selectedIndex.value === -1) return false
      const token = tokens.value[selectedIndex.value]
      return isFunction(token)
    })
    
    const canDelete = computed(() => selectedIndex.value !== -1)
    
    // 选择token
    const selectToken = (index) => {
      selectedIndex.value = index
      hiddenInput.value?.focus()
    }
    
    // 移动选择
    const moveSelection = (direction) => {
      const newIndex = selectedIndex.value + direction
      if (newIndex >= -1 && newIndex < tokens.value.length) {
        selectedIndex.value = newIndex
      }
    }
    
    // 开始编辑
    const startEditing = () => {
      if (!canEdit.value) return
      
      const token = tokens.value[selectedIndex.value]
      currentInput.value = token
      editDialogVisible.value = true
    }
    
    // 开始编辑运算符
    const startEditingOperator = () => {
      if (!canEditOperator.value) return
      
      const token = tokens.value[selectedIndex.value]
      const match = token.match(/^([A-Z_]+)\s*\((.*)\)$/)
      if (!match) return
      
      const [_, funcName, paramsStr] = match
      const operator = props.operators.find(op => op.operatorName === funcName)
      if (!operator) return
      
      // 解析参数，考虑嵌套括号和嵌套运算符
      const parsedParams = []
      let paramStart = 0
      let openParens = 0
      let inQuotes = false
      
      for (let i = 0; i <= paramsStr.length; i++) {
        // 到达末尾或遇到逗号（且不在括号或引号内）时进行处理
        if (i === paramsStr.length || (paramsStr[i] === ',' && openParens === 0 && !inQuotes)) {
          const param = paramsStr.substring(paramStart, i).trim()
          if (param) {
            parsedParams.push(param)
          }
          paramStart = i + 1
          continue
        }
        
        // 处理引号
        if (paramsStr[i] === '"') {
          inQuotes = !inQuotes
          continue
        }
        
        // 如果在引号内，继续
        if (inQuotes) continue
        
        // 处理括号
        if (paramsStr[i] === '(') {
          openParens++
        } else if (paramsStr[i] === ')') {
          openParens--
        }
      }
      
      // 触发事件，让父组件处理运算符编辑
      emit('edit-operator', {
        operator,
        params: parsedParams,
        index: selectedIndex.value
      })
    }
    
    // 确认编辑
    const confirmEdit = () => {
      if (!currentInput.value) return
      
      const newTokens = [...tokens.value]
      newTokens[selectedIndex.value] = currentInput.value
      emit('update:modelValue', newTokens.join(' '))
      
      editDialogVisible.value = false
    }
    
    // 处理回车
    const handleEnter = () => {
      if (editDialogVisible.value) {
        confirmEdit()
      }
    }
    
    // 处理删除
    const handleDelete = (e) => {
      if (editDialogVisible.value) return
      
      if (selectedIndex.value !== -1) {
        e.preventDefault()
        deleteToken()
      }
    }
    
    // 删除token
    const deleteToken = () => {
      if (!canDelete.value) return
      
      const newTokens = tokens.value.filter((_, index) => index !== selectedIndex.value)
      emit('update:modelValue', newTokens.join(' '))
      selectedIndex.value = Math.min(selectedIndex.value, newTokens.length - 1)
    }
    
    // 处理空格
    const handleSpace = () => {
      if (editDialogVisible.value) {
        confirmEdit()
      }
    }
    
    // 插入新的token
    const insertToken = (newToken) => {
      if (selectedIndex.value === -1) {
        // 如果没有选中任何token，直接追加到末尾
        const newValue = props.modelValue ? `${props.modelValue} ${newToken}` : newToken
        emit('update:modelValue', newValue)
      } else {
        // 在选中的token后插入新token
        const newTokens = [...tokens.value]
        newTokens.splice(selectedIndex.value + 1, 0, newToken)
        emit('update:modelValue', newTokens.join(' '))
        // 移动选择到新插入的token
        selectedIndex.value = selectedIndex.value + 1
      }
    }
    
    // 聚焦隐藏输入框
    const focusInput = () => {
      hiddenInput.value?.focus()
    }
    
    // 监听props.modelValue的变化
    watch(() => props.modelValue, () => {
      if (selectedIndex.value >= tokens.value.length) {
        selectedIndex.value = tokens.value.length - 1
      }
    })
    
    return {
      tokenContainer,
      hiddenInput,
      selectedIndex,
      currentInput,
      editDialogVisible,
      tokens,
      isNumber,
      isString,
      isVariable,
      isOperator,
      isFunction,
      isOpenParen,
      isCloseParen,
      canEdit,
      canEditOperator,
      canDelete,
      selectToken,
      startEditing,
      startEditingOperator,
      confirmEdit,
      handleEnter,
      handleDelete,
      deleteToken,
      handleSpace,
      moveSelection,
      focusInput,
      insertToken
    }
  }
}
</script>

<style scoped>
.expression-editor {
  position: relative;
  padding: 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  min-height: 40px;
  background: #fff;
}

.token-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.token {
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
}

.token:hover {
  transform: translateY(-2px);
}

.token.selected {
  outline: 2px solid #409EFF;
  outline-offset: 2px;
  position: relative;
}

.token.selected::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid #409EFF;
}

.number-token {
  font-family: monospace;
}

.string-token {
  font-family: monospace;
}

.variable-token {
  font-family: monospace;
}

.function-token {
  font-family: monospace;
}

.operator-token {
  font-weight: bold;
}

.paren-token {
  font-weight: bold;
  background-color: #f0f0f0;
  border-color: #dcdfe6;
}

.hidden-input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.quick-actions {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 8px;
  z-index: 10;
  background: white;
  padding: 4px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style> 