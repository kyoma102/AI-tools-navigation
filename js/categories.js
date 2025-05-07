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
          <a href="tool-detail.html?id=${tool.id}" class="text-blue-500 hover:text-blue-600 text-xs sm:text-sm font-medium">查看详情</a>
        </div>
      </div>
    </div>
  `;
}

// 获取URL参数
function getUrlParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// 渲染分类标签
async function renderCategoryTags() {
  const data = await loadTools();
  const currentCategory = getUrlParam('category') || 'all';
  
  const categoryTagsContainer = document.getElementById('category-tags');
  if (categoryTagsContainer) {
    // 添加"全部"标签
    let tagsHtml = `
      <a href="categories.html" class="${currentCategory === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors">全部</a>
    `;
    
    // 添加其他分类标签
    data.categories.forEach(category => {
      tagsHtml += `
        <a href="categories.html?category=${category.id}" class="${currentCategory === category.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors">${category.name}</a>
      `;
    });
    
    categoryTagsContainer.innerHTML = tagsHtml;
  }
}

// 筛选并渲染工具
async function filterAndRenderTools() {
  const data = await loadTools();
  const categoryId = getUrlParam('category');
  const searchQuery = getUrlParam('q') || '';
  
  let filteredTools = data.tools;
  
  // 按分类筛选
  if (categoryId) {
    const category = data.categories.find(c => c.id === categoryId);
    if (category) {
      filteredTools = filteredTools.filter(tool => tool.category === category.name);
      
      // 更新页面标题
      const categoryTitle = document.getElementById('category-title');
      if (categoryTitle) {
        categoryTitle.textContent = category.name;
      }
      
      const categoryDescription = document.getElementById('category-description');
      if (categoryDescription) {
        categoryDescription.textContent = category.description;
      }
    }
  }
  
  // 按搜索词筛选
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredTools = filteredTools.filter(tool => 
      tool.name.toLowerCase().includes(query) || 
      tool.description.toLowerCase().includes(query) ||
      tool.tags.some(tag => tag.toLowerCase().includes(query))
    );
    
    // 更新搜索框
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.value = searchQuery;
    }
    
    // 更新页面标题
    const categoryTitle = document.getElementById('category-title');
    if (categoryTitle) {
      categoryTitle.textContent = `搜索结果: "${searchQuery}"`;
    }
  }
  
  // 渲染工具卡片
  const toolsContainer = document.getElementById('tools-container');
  if (toolsContainer) {
    if (filteredTools.length > 0) {
      toolsContainer.innerHTML = filteredTools.map(renderToolCard).join('');
    } else {
      toolsContainer.innerHTML = `
        <div class="col-span-full text-center py-10">
          <svg class="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="text-lg font-medium text-gray-700 mb-1">未找到相关工具</h3>
          <p class="text-gray-500">请尝试其他分类或搜索词</p>
        </div>
      `;
    }
  }
}

// 处理搜索表单提交
function handleSearch() {
  const searchForm = document.getElementById('search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const searchInput = document.getElementById('search-input');
      const query = searchInput.value.trim();
      
      if (query) {
        window.location.href = `categories.html?q=${encodeURIComponent(query)}`;
      }
    });
  }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  renderCategoryTags();
  filterAndRenderTools();
  handleSearch();
});