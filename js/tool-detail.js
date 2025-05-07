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

// 获取URL参数
function getUrlParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// 渲染星级评分
function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  let starsHtml = '';
  
  // 全星
  for (let i = 0; i < fullStars; i++) {
    starsHtml += `
      <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
      </svg>
    `;
  }
  
  // 半星
  if (hasHalfStar) {
    starsHtml += `
      <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
        <defs>
          <linearGradient id="half-star-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="50%" stop-color="currentColor"></stop>
            <stop offset="50%" stop-color="#D1D5DB"></stop>
          </linearGradient>
        </defs>
        <path fill="url(#half-star-gradient)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
      </svg>
    `;
  }
  
  // 空星
  for (let i = 0; i < emptyStars; i++) {
    starsHtml += `
      <svg class="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
      </svg>
    `;
  }
  
  return starsHtml;
}

// 渲染工具详情
async function renderToolDetail() {
  const data = await loadTools();
  const toolId = getUrlParam('id');
  
  if (!toolId) {
    window.location.href = 'index.html';
    return;
  }
  
  const tool = data.tools.find(t => t.id === toolId);
  
  if (!tool) {
    // 工具不存在，显示错误信息
    document.getElementById('main-content').innerHTML = `
      <div class="text-center py-16">
        <svg class="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h1 class="text-2xl font-bold text-gray-700 mb-2">工具不存在</h1>
        <p class="text-gray-500 mb-4">找不到ID为 "${toolId}" 的工具</p>
        <a href="index.html" class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors">返回首页</a>
      </div>
    `;
    return;
  }
  
  // 更新页面标题
  document.title = `${tool.name} - AI工具导航`;
  
  // 更新面包屑导航
  const breadcrumbContainer = document.getElementById('breadcrumb');
  if (breadcrumbContainer) {
    const category = data.categories.find(c => c.name === tool.category);
    breadcrumbContainer.innerHTML = `
      <a href="index.html" class="hover:text-blue-500 transition-colors">首页</a> &gt; 
      <a href="categories.html" class="hover:text-blue-500 transition-colors">分类</a> &gt; 
      <a href="categories.html?category=${category ? category.id : ''}" class="hover:text-blue-500 transition-colors">${tool.category}</a> &gt; 
      <span class="text-gray-700">${tool.name}</span>
    `;
  }
  
  // 更新工具头部信息
  const toolHeaderContainer = document.getElementById('tool-header');
  if (toolHeaderContainer) {
    toolHeaderContainer.innerHTML = `
      <div class="flex flex-col md:flex-row md:items-center">
        <!-- 工具图标和基本信息 -->
        <div class="flex items-start mb-4 md:mb-0">
          <div class="bg-blue-50 rounded-lg p-2 sm:p-3 mr-3 sm:mr-4">
            <svg class="h-12 w-12 sm:h-16 sm:w-16 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4v3c0 .6.4 1 1 1h.5c.2 0 .5-.1.7-.3l3.7-3.7H20c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-3 10H7c-.6 0-1-.4-1-1s.4-1 1-1h10c.6 0 1 .4 1 1s-.4 1-1 1zm0-3H7c-.6 0-1-.4-1-1s.4-1 1-1h10c.6 0 1 .4 1 1s-.4 1-1 1z"/>
            </svg>
          </div>
          <div>
            <h1 class="text-xl sm:text-2xl md:text-3xl font-bold mb-1">${tool.name}</h1>
            <p class="text-gray-500 text-sm mb-2">由 ${tool.developer} 开发</p>
            <div class="flex flex-wrap gap-1 sm:gap-2">
              ${tool.tags.map(tag => `<span class="bg-blue-50 text-blue-600 text-xs font-medium px-2 py-1 rounded">${tag}</span>`).join('')}
            </div>
          </div>
        </div>
        
        <!-- 评分和操作按钮 -->
        <div class="flex flex-col space-y-3 md:ml-auto md:items-end">
          <div class="flex items-center">
            <div class="flex mr-2">
              ${renderStars(tool.rating)}
            </div>
            <span class="text-gray-700 font-medium text-sm sm:text-base">${tool.rating}/5</span>
            <span class="text-gray-500 text-xs sm:text-sm ml-1">(${tool.reviewCount} 评价)</span>
          </div>
          <div class="flex gap-2 sm:gap-3">
            <a href="${tool.url}" target="_blank" class="bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm sm:text-base py-1.5 sm:py-2 px-3 sm:px-4 rounded-md transition-colors">
              访问官网
            </a>
            <button class="bg-white hover:bg-gray-50 text-gray-700 font-medium text-sm sm:text-base py-1.5 sm:py-2 px-3 sm:px-4 rounded-md border border-gray-200 transition-colors flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
              </svg>
              收藏
            </button>
          </div>
        </div>
      </div>
    `;
  }
  
  // 更新工具介绍
  const toolDescriptionContainer = document.getElementById('tool-description');
  if (toolDescriptionContainer) {
    toolDescriptionContainer.innerHTML = `
      <h2 class="text-lg sm:text-xl font-bold mb-3 sm:mb-4">工具介绍</h2>
      <div class="prose max-w-none text-sm sm:text-base">
        <p>${tool.longDescription}</p>
      </div>
    `;
  }
  
  // 更新使用场景
  const useCasesContainer = document.getElementById('use-cases');
  if (useCasesContainer) {
    useCasesContainer.innerHTML = `
      <h2 class="text-lg sm:text-xl font-bold mb-3 sm:mb-4">使用场景</h2>
      <ul class="space-y-2 text-sm sm:text-base">
        ${tool.useCases.map(useCase => `<li class="flex items-start"><span class="text-blue-500 mr-2">•</span> ${useCase}</li>`).join('')}
      </ul>
    `;
  }
  
  // 更新截图预览
  const screenshotsContainer = document.getElementById('screenshots');
  if (screenshotsContainer) {
    screenshotsContainer.innerHTML = `
      <h2 class="text-lg sm:text-xl font-bold mb-3 sm:mb-4">截图预览</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        ${tool.screenshots.map(screenshot => `
          <div class="rounded-lg overflow-hidden border border-gray-200">
            <img src="${screenshot}" alt="${tool.name} 界面截图" class="w-full h-auto">
          </div>
        `).join('')}
      </div>
    `;
  }
  
  // 更新价格信息
  const pricingContainer = document.getElementById('pricing');
  if (pricingContainer) {
    pricingContainer.innerHTML = `
      <h3 class="font-medium mb-2">价格</h3>
      <div class="space-y-1 text-sm">
        <p>
          <span class="font-medium">起始价格:</span> 
          <span class="text-gray-700">${tool.pricing.startingPrice}</span>
        </p>
        <p>
          <span class="font-medium">计费方式:</span> 
          <span class="text-gray-700">${tool.pricing.pricingType}</span>
        </p>
        <p>
          ${tool.pricing.hasFree ? '<span class="text-green-600 font-medium">✓ 提供免费版本</span>' : '<span class="text-gray-500">✗ 无免费版本</span>'}
        </p>
        <p>
          ${tool.pricing.hasFreeTrial ? '<span class="text-green-600 font-medium">✓ 提供免费试用</span>' : '<span class="text-gray-500">✗ 无免费试用</span>'}
        </p>
      </div>
    `;
  }
  
  // 更新功能列表
  const featuresContainer = document.getElementById('features');
  if (featuresContainer) {
    featuresContainer.innerHTML = `
      <h3 class="font-medium mb-2">主要功能</h3>
      <ul class="space-y-1 text-sm">
        ${tool.features.map(feature => `<li class="flex items-start"><span class="text-green-500 mr-1">✓</span> ${feature}</li>`).join('')}
      </ul>
    `;
  }
  
  // 更新相关工具推荐
  const relatedToolsContainer = document.getElementById('related-tools');
  if (relatedToolsContainer) {
    // 获取相同类别的其他工具
    const relatedTools = data.tools
      .filter(t => t.category === tool.category && t.id !== tool.id)
      .slice(0, 4);
    
    if (relatedTools.length > 0) {
      relatedToolsContainer.innerHTML = `
        <h2 class="text-lg sm:text-xl font-bold mb-3 sm:mb-4">相关工具推荐</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          ${relatedTools.map(relatedTool => `
            <div class="flex border border-gray-200 rounded-lg p-3 hover:border-blue-200 transition-colors">
              <div class="bg-blue-50 rounded-lg p-2 mr-3">
                <svg class="h-10 w-10 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4v3c0 .6.4 1 1 1h.5c.2 0 .5-.1.7-.3l3.7-3.7H20c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-3 10H7c-.6 0-1-.4-1-1s.4-1 1-1h10c.6 0 1 .4 1 1s-.4 1-1 1zm0-3H7c-.6 0-1-.4-1-1s.4-1 1-1h10c.6 0 1 .4 1 1s-.4 1-1 1z"></path>
                </svg>
              </div>
              <div>
                <h3 class="font-medium mb-1">${relatedTool.name}</h3>
                <p class="text-gray-600 text-sm">${relatedTool.description}</p>
                <a href="tool-detail.html?id=${relatedTool.id}" class="text-blue-500 hover:text-blue-600 text-xs font-medium mt-1 inline-block">查看详情</a>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      relatedToolsContainer.innerHTML = `
        <h2 class="text-lg sm:text-xl font-bold mb-3 sm:mb-4">相关工具推荐</h2>
        <p class="text-gray-500 text-sm">暂无相关工具推荐</p>
      `;
    }
  }
  
  // 更新用户评价
  const reviewsContainer = document.getElementById('reviews');
  if (reviewsContainer) {
    // 这里可以从API获取评价数据，这里使用模拟数据
    const mockReviews = [
      {
        id: 1,
        user: '李明',
        avatar: 'L',
        avatarColor: 'blue',
        rating: 5,
        content: '作为程序员，我发现ChatGPT在编程方面非常有用。它能够解释复杂的代码，提供调试建议，甚至帮我优化算法。强烈推荐给所有开发者！',
        date: '2023年9月28日'
      },
      {
        id: 2,
        user: '张小红',
        avatar: 'Z',
        avatarColor: 'red',
        rating: 4,
        content: '我用ChatGPT来帮助我写作和头脑风暴。它给了我很多创意灵感，但有时候回答会有些重复。总体来说是一个很棒的工具！',
        date: '2023年9月15日'
      },
      {
        id: 3,
        user: '王大山',
        avatar: 'W',
        avatarColor: 'green',
        rating: 5,
        content: '我是一名教师，ChatGPT帮助我准备课程材料和回答学生的问题。它节省了我大量的时间，让我能够更专注于教学质量。',
        date: '2023年8月30日'
      }
    ];
    
    reviewsContainer.innerHTML = `
      <div class="flex justify-between items-center mb-3 sm:mb-4">
        <h2 class="text-lg sm:text-xl font-bold">用户评价</h2>
        <a href="#" class="text-blue-500 hover:text-blue-600 text-xs sm:text-sm font-medium">查看全部</a>
      </div>
      
      <!-- 评价列表 -->
      <div class="space-y-3 sm:space-y-4">
        ${mockReviews.map(review => `
          <div class="border-b border-gray-100 pb-3 sm:pb-4">
            <div class="flex justify-between mb-1 sm:mb-2">
              <div class="flex items-center">
                <div class="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-${review.avatarColor}-100 text-${review.avatarColor}-500 flex items-center justify-center font-medium mr-2">${review.avatar}</div>
                <span class="font-medium text-sm sm:text-base">${review.user}</span>
              </div>
              <div class="flex">
                ${renderStars(review.rating)}
              </div>
            </div>
            <p class="text-gray-700 mb-1 text-xs sm:text-sm">${review.content}</p>
            <p class="text-gray-500 text-xs">${review.date}</p>
          </div>
        `).join('')}
      </div>
      
      <!-- 查看更多按钮 -->
      <div class="mt-4 sm:mt-6 text-center">
        <button class="bg-white hover:bg-gray-50 text-blue-500 font-medium text-sm sm:text-base py-1.5 sm:py-2 px-3 sm:px-4 rounded-md border border-gray-200 transition-colors">
          加载更多评价
        </button>
      </div>
    `;
  }
  
  // 添加常见问题解答
  const faqContainer = document.getElementById('faq');
  if (faqContainer) {
    // 这里可以从API获取FAQ数据，这里使用模拟数据
    const mockFaqs = [
      {
        question: `${tool.name} 是免费的吗？`,
        answer: `${tool.pricing.hasFree ? `是的，${tool.name} 提供免费版本，但可能有一些功能限制。` : `不，${tool.name} 没有免费版本，起始价格为 ${tool.pricing.startingPrice}。`}${tool.pricing.hasFreeTrial ? ` 不过，它提供免费试用期，让您可以在购买前体验产品。` : ''}`
      },
      {
        question: `${tool.name} 支持哪些语言？`,
        answer: `${tool.name} 支持多种语言，包括中文、英文等主要语言。具体支持的语言可能会随着版本更新而增加，建议访问官方网站获取最新信息。`
      },
      {
        question: `如何开始使用 ${tool.name}？`,
        answer: `要开始使用 ${tool.name}，您需要先访问其官方网站 (${tool.url})，注册一个账号。${tool.pricing.hasFree ? '您可以先使用免费版本体验基本功能。' : tool.pricing.hasFreeTrial ? '您可以先申请免费试用来体验产品功能。' : '注册后选择适合您需求的订阅计划。'}完成注册和设置后，您就可以开始使用了。`
      }
    ];
    
    faqContainer.innerHTML = `
      <h2 class="text-xl font-bold mb-4">常见问题</h2>
      <div class="space-y-4">
        ${mockFaqs.map((faq, index) => `
          <div class="border-b border-gray-100 pb-4 ${index === mockFaqs.length - 1 ? 'border-b-0' : ''}">
            <button class="flex justify-between items-center w-full text-left font-medium" onclick="toggleFaq(this)">
              <span>${faq.question}</span>
              <svg class="w-5 h-5 text-gray-500 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div class="mt-2 text-gray-600 hidden">
              <p>${faq.answer}</p>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
}

// FAQ切换显示/隐藏
function toggleFaq(element) {
  const content = element.nextElementSibling;
  const icon = element.querySelector('svg');
  
  content.classList.toggle('hidden');
  icon.classList.toggle('rotate-180');
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
  renderToolDetail();
  
  // 移动端菜单切换
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
    });
  }
});