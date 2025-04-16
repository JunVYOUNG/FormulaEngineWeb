<template>
  <div class="dashboard page-container">
    <div class="dashboard-header">
      <h1>公式计算引擎</h1>
      <p class="dashboard-description">基于SpringBoot和MVEL实现的自定义公式计算系统</p>
    </div>

    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" class="card-col">
        <el-card class="dashboard-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span><i class="el-icon-s-operation"></i> 运算符管理</span>
              <el-button class="button" type="primary" plain size="small" @click="$router.push('/operators')">查看</el-button>
            </div>
          </template>
          <div class="card-content">
            <p>管理自定义运算符，包括添加、修改和删除运算符。每个运算符可以关联到特定的服务和方法。</p>
            <div class="card-footer">
              <el-tag size="small">运算符名称</el-tag>
              <el-tag size="small" type="success">服务名称</el-tag>
              <el-tag size="small" type="warning">参数数量</el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" class="card-col">
        <el-card class="dashboard-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span><i class="el-icon-document"></i> 公式管理</span>
              <el-button class="button" type="primary" plain size="small" @click="$router.push('/formulas')">查看</el-button>
            </div>
          </template>
          <div class="card-content">
            <p>管理公式，支持添加、修改、删除和查看公式列表。公式可以包含普通算术运算和自定义运算符。</p>
            <div class="card-footer">
              <el-tag size="small">公式名称</el-tag>
              <el-tag size="small" type="success">表达式</el-tag>
              <el-tag size="small" type="info">嵌套调用</el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" class="card-col">
        <el-card class="dashboard-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span><i class="el-icon-s-marketing"></i> 公式计算</span>
              <el-button class="button" type="primary" plain size="small" @click="$router.push('/calculator')">查看</el-button>
            </div>
          </template>
          <div class="card-content">
            <p>使用已保存的公式进行计算，支持传入数据集进行替换和计算，展示详细计算步骤。</p>
            <div class="card-footer">
              <el-tag size="small">数据集</el-tag>
              <el-tag size="small" type="success">计算结果</el-tag>
              <el-tag size="small" type="warning">计算步骤</el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="feature-row">
      <el-col :span="24">
        <h2 class="feature-title">主要功能</h2>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" class="feature-col">
        <div class="feature-item">
          <div class="feature-icon">
            <i class="el-icon-plus"></i>
          </div>
          <div class="feature-info">
            <h3>自定义运算符</h3>
            <p>定义和管理自己的运算符，映射到后端服务</p>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" class="feature-col">
        <div class="feature-item">
          <div class="feature-icon">
            <i class="el-icon-document-add"></i>
          </div>
          <div class="feature-info">
            <h3>公式存储</h3>
            <p>保存和管理公式，方便重复使用</p>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" class="feature-col">
        <div class="feature-item">
          <div class="feature-icon">
            <i class="el-icon-data-analysis"></i>
          </div>
          <div class="feature-info">
            <h3>公式计算</h3>
            <p>计算公式结果，支持传入数据参数</p>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" class="feature-col">
        <div class="feature-item">
          <div class="feature-icon">
            <i class="el-icon-connection"></i>
          </div>
          <div class="feature-info">
            <h3>嵌套调用</h3>
            <p>支持运算符的多层嵌套调用</p>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'DashboardView'
}
</script>

<style scoped>
.dashboard {
  padding: 20px 0;
  width: 100%;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 30px;
  width: 100%;
}

.dashboard-description {
  color: #606266;
  font-size: 16px;
  margin-top: 10px;
}

.card-col {
  margin-bottom: 20px;
  display: flex;
}

.dashboard-card {
  height: 100%;
  transition: all 0.3s;
  width: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header span {
  font-size: 16px;
  font-weight: 600;
}

.card-header i {
  margin-right: 5px;
}

.card-content {
  display: flex;
  flex-direction: column;
  min-height: 120px;
}

.card-content p {
  flex: 1;
  line-height: 1.6;
  color: #606266;
  margin-bottom: 15px;
}

.card-footer {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: auto;
}

.feature-row {
  margin-top: 40px;
  width: 100%;
}

.feature-title {
  text-align: center;
  margin-bottom: 25px;
  color: #303133;
  font-weight: 600;
  position: relative;
}

.feature-title:after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: #1890ff;
  border-radius: 3px;
}

.feature-col {
  margin-bottom: 20px;
  display: flex;
}

.feature-item {
  background: white;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
  height: 100%;
  width: 100%;
}

.feature-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #1890ff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  flex-shrink: 0;
}

.feature-icon i {
  font-size: 24px;
  color: white;
}

.feature-info h3 {
  margin: 0 0 5px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.feature-info p {
  margin: 0;
  color: #606266;
  font-size: 14px;
  line-height: 1.4;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .dashboard {
    padding: 15px 0;
  }
  
  .feature-item {
    padding: 15px;
  }
  
  .feature-icon {
    width: 40px;
    height: 40px;
  }
  
  .feature-icon i {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .dashboard-header {
    margin-bottom: 20px;
  }
  
  h1 {
    font-size: 24px;
  }
  
  .dashboard-description {
    font-size: 14px;
  }
}
</style> 