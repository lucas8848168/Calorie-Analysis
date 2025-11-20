import React, { useState, useEffect } from 'react';
import { MealTemplate, MealType, FoodItem } from '../../types';
import {
  getAllTemplates,
  getTemplatesByMealType,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  applyTemplate,
} from '../../services/templateService';
import './TemplateManager.css';

interface TemplateManagerProps {
  onApplyTemplate?: (foods: FoodItem[], mealType: MealType) => void;
}

const TemplateManager: React.FC<TemplateManagerProps> = ({ onApplyTemplate }) => {
  const [templates, setTemplates] = useState<MealTemplate[]>([]);
  const [selectedMealType, setSelectedMealType] = useState<MealType | 'all'>('all');
  const [isCreating, setIsCreating] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<MealTemplate | null>(null);
  const [expandedTemplateId, setExpandedTemplateId] = useState<string | null>(null);

  // 表单状态
  const [formName, setFormName] = useState('');
  const [formMealType, setFormMealType] = useState<MealType>(MealType.BREAKFAST);
  const [formFoods, setFormFoods] = useState<FoodItem[]>([]);

  useEffect(() => {
    loadTemplates();
  }, [selectedMealType]);

  const loadTemplates = () => {
    if (selectedMealType === 'all') {
      setTemplates(getAllTemplates());
    } else {
      setTemplates(getTemplatesByMealType(selectedMealType));
    }
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setEditingTemplate(null);
    setFormName('');
    setFormMealType(MealType.BREAKFAST);
    setFormFoods([]);
  };

  const handleEdit = (template: MealTemplate) => {
    setEditingTemplate(template);
    setIsCreating(true);
    setFormName(template.name);
    setFormMealType(template.mealType);
    setFormFoods([...template.foods]);
  };

  const handleSave = () => {
    if (!formName.trim()) {
      alert('请输入模板名称');
      return;
    }

    if (formFoods.length === 0) {
      alert('请至少添加一个食物');
      return;
    }

    try {
      if (editingTemplate) {
        // 更新现有模板
        updateTemplate(editingTemplate.id, {
          name: formName,
          mealType: formMealType,
          foods: formFoods,
        });
      } else {
        // 创建新模板
        createTemplate(formName, formMealType, formFoods);
      }

      setIsCreating(false);
      setEditingTemplate(null);
      loadTemplates();
    } catch (error) {
      alert(error instanceof Error ? error.message : '保存失败');
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingTemplate(null);
  };

  const handleDelete = (template: MealTemplate) => {
    if (window.confirm(`确定要删除模板"${template.name}"吗？`)) {
      deleteTemplate(template.id);
      loadTemplates();
    }
  };

  const handleApply = (template: MealTemplate) => {
    const foods = applyTemplate(template.id);
    if (foods && onApplyTemplate) {
      onApplyTemplate(foods, template.mealType);
      loadTemplates(); // 重新加载以更新使用次数
    }
  };

  const handleToggleExpand = (templateId: string) => {
    setExpandedTemplateId(expandedTemplateId === templateId ? null : templateId);
  };

  const handleAddFood = () => {
    // 简单示例：添加一个空食物项
    const newFood: FoodItem = {
      name: '',
      calories: 0,
      nutrition: { protein: 0, fat: 0, carbs: 0, fiber: 0 },
    };
    setFormFoods([...formFoods, newFood]);
  };

  const handleRemoveFood = (index: number) => {
    setFormFoods(formFoods.filter((_, i) => i !== index));
  };

  const handleFoodChange = (index: number, field: string, value: any) => {
    const updatedFoods = [...formFoods];
    if (field.startsWith('nutrition.')) {
      const nutritionField = field.split('.')[1];
      updatedFoods[index] = {
        ...updatedFoods[index],
        nutrition: {
          ...updatedFoods[index].nutrition,
          [nutritionField]: parseFloat(value) || 0,
        },
      };
    } else {
      updatedFoods[index] = {
        ...updatedFoods[index],
        [field]: field === 'calories' ? parseFloat(value) || 0 : value,
      };
    }
    setFormFoods(updatedFoods);
  };

  const mealTypeLabels = {
    [MealType.BREAKFAST]: '早餐',
    [MealType.LUNCH]: '午餐',
    [MealType.DINNER]: '晚餐',
    [MealType.SNACK]: '加餐',
  };

  const calculateTotalCalories = (foods: FoodItem[]) => {
    return foods.reduce((sum, food) => sum + food.calories, 0);
  };

  return (
    <div className="template-manager">
      <div className="manager-header">
        <h2>饮食模板管理</h2>
        <button className="create-button" onClick={handleCreateNew}>
          ➕ 创建新模板
        </button>
      </div>

      {!isCreating && (
        <>
          <div className="filter-bar">
            <button
              className={`filter-button ${selectedMealType === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedMealType('all')}
            >
              全部 ({getAllTemplates().length})
            </button>
            {Object.values(MealType).map((type) => (
              <button
                key={type}
                className={`filter-button ${selectedMealType === type ? 'active' : ''}`}
                onClick={() => setSelectedMealType(type)}
              >
                {mealTypeLabels[type]} ({getTemplatesByMealType(type).length})
              </button>
            ))}
          </div>

          <div className="templates-list">
            {templates.length === 0 ? (
              <div className="empty-state">
                <p>暂无模板</p>
                <p className="hint">创建模板可以快速添加常用的食物组合</p>
              </div>
            ) : (
              templates.map((template) => (
                <div
                  key={template.id}
                  className={`template-card ${
                    expandedTemplateId === template.id ? 'expanded' : ''
                  }`}
                >
                  <div
                    className="template-header"
                    onClick={() => handleToggleExpand(template.id)}
                  >
                    <div className="template-info">
                      <h3>{template.name}</h3>
                      <div className="template-meta">
                        <span className="meal-type-badge">
                          {mealTypeLabels[template.mealType]}
                        </span>
                        <span className="food-count">
                          {template.foods.length} 项食物
                        </span>
                        <span className="calories">
                          {template.totalCalories} kcal
                        </span>
                        <span className="usage-count">
                          使用 {template.usageCount} 次
                        </span>
                      </div>
                    </div>
                    <button className="expand-icon">
                      {expandedTemplateId === template.id ? '▲' : '▼'}
                    </button>
                  </div>

                  {expandedTemplateId === template.id && (
                    <div className="template-body">
                      <div className="foods-list">
                        <h4>包含食物</h4>
                        {template.foods.map((food, index) => (
                          <div key={index} className="food-item">
                            <span className="food-name">{food.name}</span>
                            <span className="food-calories">
                              {food.calories} kcal
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="nutrition-summary">
                        <h4>营养总计</h4>
                        <div className="nutrition-grid">
                          <div className="nutrition-item">
                            <span className="label">蛋白质</span>
                            <span className="value">
                              {template.totalNutrition.protein.toFixed(1)}g
                            </span>
                          </div>
                          <div className="nutrition-item">
                            <span className="label">脂肪</span>
                            <span className="value">
                              {template.totalNutrition.fat.toFixed(1)}g
                            </span>
                          </div>
                          <div className="nutrition-item">
                            <span className="label">碳水</span>
                            <span className="value">
                              {template.totalNutrition.carbs.toFixed(1)}g
                            </span>
                          </div>
                          <div className="nutrition-item">
                            <span className="label">纤维</span>
                            <span className="value">
                              {template.totalNutrition.fiber.toFixed(1)}g
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="template-actions">
                        <button
                          className="apply-button"
                          onClick={() => handleApply(template)}
                        >
                          应用模板
                        </button>
                        <button
                          className="edit-button"
                          onClick={() => handleEdit(template)}
                        >
                          编辑
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => handleDelete(template)}
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}

      {isCreating && (
        <div className="template-form">
          <h3>{editingTemplate ? '编辑模板' : '创建新模板'}</h3>

          <div className="form-group">
            <label>模板名称</label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="例如：健康早餐套餐"
            />
          </div>

          <div className="form-group">
            <label>餐次类型</label>
            <select
              value={formMealType}
              onChange={(e) => setFormMealType(e.target.value as MealType)}
            >
              {Object.values(MealType).map((type) => (
                <option key={type} value={type}>
                  {mealTypeLabels[type]}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <div className="foods-header">
              <label>食物列表</label>
              <button className="add-food-button" onClick={handleAddFood}>
                ➕ 添加食物
              </button>
            </div>

            <div className="foods-form-list">
              {formFoods.length === 0 ? (
                <p className="hint">请添加至少一个食物</p>
              ) : (
                formFoods.map((food, index) => (
                  <div key={index} className="food-form-item">
                    <div className="food-form-row">
                      <input
                        type="text"
                        placeholder="食物名称"
                        value={food.name}
                        onChange={(e) =>
                          handleFoodChange(index, 'name', e.target.value)
                        }
                      />
                      <input
                        type="number"
                        placeholder="卡路里"
                        value={food.calories || ''}
                        onChange={(e) =>
                          handleFoodChange(index, 'calories', e.target.value)
                        }
                      />
                      <button
                        className="remove-food-button"
                        onClick={() => handleRemoveFood(index)}
                      >
                        ✕
                      </button>
                    </div>
                    <div className="nutrition-form-row">
                      <input
                        type="number"
                        placeholder="蛋白质(g)"
                        value={food.nutrition.protein || ''}
                        onChange={(e) =>
                          handleFoodChange(index, 'nutrition.protein', e.target.value)
                        }
                      />
                      <input
                        type="number"
                        placeholder="脂肪(g)"
                        value={food.nutrition.fat || ''}
                        onChange={(e) =>
                          handleFoodChange(index, 'nutrition.fat', e.target.value)
                        }
                      />
                      <input
                        type="number"
                        placeholder="碳水(g)"
                        value={food.nutrition.carbs || ''}
                        onChange={(e) =>
                          handleFoodChange(index, 'nutrition.carbs', e.target.value)
                        }
                      />
                      <input
                        type="number"
                        placeholder="纤维(g)"
                        value={food.nutrition.fiber || ''}
                        onChange={(e) =>
                          handleFoodChange(index, 'nutrition.fiber', e.target.value)
                        }
                      />
                    </div>
                  </div>
                ))
              )}
            </div>

            {formFoods.length > 0 && (
              <div className="form-summary">
                <span>总计：{calculateTotalCalories(formFoods)} kcal</span>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button className="save-button" onClick={handleSave}>
              保存模板
            </button>
            <button className="cancel-button" onClick={handleCancel}>
              取消
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateManager;
