// 搜索和过滤功能实现
document.addEventListener('DOMContentLoaded', function() {
    // 获取搜索框和工具卡片元素
    const searchInput = document.getElementById('search-input');
    const toolCards = document.querySelectorAll('.tool-card');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const resultCount = document.getElementById('result-count');
    
    // 当前选中的分类
    let currentCategory = '全部';
    
    // 搜索过滤函数
    function filterTools() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        let visibleCount = 0;
        
        toolCards.forEach(card => {
            // 获取卡片中的工具名称、描述和分类
            const toolName = card.querySelector('h3').textContent.toLowerCase();
            const toolDescription = card.querySelector('p').textContent.toLowerCase();
            const toolCategory = card.querySelector('.text-xs.text-gray-500').textContent;
            
            // 检查是否匹配搜索词和当前选中的分类
            const matchesSearch = toolName.includes(searchTerm) || toolDescription.includes(searchTerm);
            const matchesCategory = currentCategory === '全部' || toolCategory === currentCategory;
            
            // 同时满足搜索词和分类条件才显示
            if (matchesSearch && matchesCategory) {
                card.classList.remove('hidden');
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        });
        
        // 更新显示的结果数量
        if (resultCount) {
            resultCount.textContent = visibleCount;
        }
    }
    
    // 分类按钮点击事件
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有按钮的选中状态
            categoryButtons.forEach(btn => {
                btn.classList.remove('bg-blue-500', 'text-white');
                btn.classList.add('bg-white', 'text-gray-700', 'hover:bg-blue-50');
            });
            
            // 设置当前按钮为选中状态
            this.classList.remove('bg-white', 'text-gray-700', 'hover:bg-blue-50');
            this.classList.add('bg-blue-500', 'text-white');
            
            // 更新当前选中的分类
            currentCategory = this.textContent;
            
            // 重新过滤工具
            filterTools();
        });
    });
    
    // 监听搜索框输入事件
    searchInput.addEventListener('input', filterTools);
    
    // 初始化显示数量
    filterTools();
});