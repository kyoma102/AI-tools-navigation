// 加载工具数据
async function loadTools() {
  try {
    const response = await fetch('/assets/tools.json');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('加载工具数据失败:', error);
    return { tools: [], categories: [] };
  }
}

// 渲染工具卡片
function renderToolCard(tool) {
  return `
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <img src="${tool.screenshots[0] || 'https://via.placeholder.com/400x200/EFF6FF/3B82F6?text=AI+Tool'}" 
           alt="${tool.name}截图" class="w-full h-32 sm:h-40 object-cover">
      <div class="p-3 sm:p-4">
        <div class="flex justify-between items-start">
          <h3 class="font-semibold text-base sm:text-lg">${tool.name}</h3>
          ${tool.isPopular ? '<span class="bg-blue-50 text-blue-600 text-xs font-medium px-2 py-1 rounded">热门</span>' : 
            (tool.isNew ? '<span class="bg-green-50 text-green-600 text-xs font-medium px-2 py-1 rounded">新品</span>' : '')}
        </div>
        <p class="text-gray-600 text-xs sm:text-sm mt-1 sm:mt-2 line-clamp-2">${tool.description}</p>
        <div class="flex justify-between items-center mt-3 sm:mt-4">
          <span class="text-xs text-gray-500">${tool.category}</span>
          <a href="${tool.url}" target="_blank" class="text-blue-500 hover:text-blue-600 text-xs sm:text-sm font-medium">查看详情</a>
        </div>
      </div>
    </div>
  `;
}

// 渲染推荐工具
async function renderFeaturedTools() {
  const data = await loadTools();
  const featuredTools = data.tools.filter(tool => tool.isPopular).slice(0, 4);
  
  const featuredToolsContainer = document.getElementById('featured-tools');
  if (featuredToolsContainer) {
    featuredToolsContainer.innerHTML = featuredTools.map(renderToolCard).join('');
  }
}

// 渲染最新工具
async function renderNewTools() {
  const data = await loadTools();
  const newTools = data.tools.filter(tool => tool.isNew).slice(0, 4);
  
  const newToolsContainer = document.getElementById('new-tools');
  if (newToolsContainer) {
    newToolsContainer.innerHTML = newTools.map(renderToolCard).join('');
  }
}

// 渲染分类
async function renderCategories() {
  const data = await loadTools();
  
  const categoriesContainer = document.getElementById('categories');
  if (categoriesContainer) {
    categoriesContainer.innerHTML = data.categories.map(category => `
      <a href="categories.html?category=${category.id}" class="bg-white hover:bg-blue-50 border border-gray-200 rounded-lg p-3 sm:p-4 text-center transition-colors">
        <svg class="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${getCategoryIcon(category.icon)}"></path>
        </svg>
        <h3 class="text-sm sm:text-base font-medium">${category.name}</h3>
      </a>
    `).join('');
  }
}

// 获取分类图标路径
function getCategoryIcon(iconName) {
  const icons = {
    'pencil': 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z',
    'image': 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
    'microphone': 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z',
    'video': 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
    'code': 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
    'clipboard': 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    'briefcase': 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
  };
  
  return icons[iconName] || icons['clipboard']; // 默认图标
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  renderFeaturedTools();
  renderNewTools();
  renderCategories();
});