// console.log('====================================');
// console.log("Connected");
// console.log('====================================');

// Fetch product data from API
async function fetchProducts() {
    const response = await fetch('https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json');
    const data = await response.json();
    return data;
}
// Display products based on the selected category
async function showProducts(category) {
    const allContainers = document.querySelectorAll('.product-container');
    allContainers.forEach(container => {
        container.style.display = 'none';
    });
    const allButtons = document.querySelectorAll('button');
    allButtons.forEach(button => {
        // Remove active class from all buttons
        button.classList.remove('active'); 
        if (button.textContent.toLowerCase() === category.toLowerCase()) {
            // Add active class to the clicked button
            button.classList.add('active'); 
            button.style.backgroundColor = "black";
            button.style.color = "white";
        } else {
            // Reset styles for other buttons
            button.style.backgroundColor = "";
            button.style.color = "";
        }
    });
    const selectedContainer = document.getElementById(`${category.toLowerCase()}Products`);
        selectedContainer.style.display = 'flex'; 
        const data = await fetchProducts();
        console.log('API Response:', data);

        if (Array.isArray(data.categories)) {
            const categoryData = data.categories.find(item => item.category_name.toLowerCase() === category.toLowerCase());
            console.log('Category Data:', categoryData);

            if (categoryData && Array.isArray(categoryData.category_products)) {
                console.log('Products:', categoryData.category_products);
                const products = categoryData.category_products;
                selectedContainer.innerHTML = products.map(product => createProductCard(product)).join('');
                
            } else {
                console.error('Invalid data format. Missing or incorrect category_products property.');
            }
        } else {
            console.error('Invalid data format. Expected an array of categories.');
        }
    }
// Create HTML for a product card
function createProductCard(product) {
    // Convert string prices to numbers
    const price = parseFloat(product.price);
    const compare_at_price = parseFloat(product.compare_at_price);
    const discount = calculateDiscount(product.price, product.compare_at_price);
    return `
        <div class="product-card">
            <img src="${product.image}" alt="Product Image">
            <span>
            <p class="tit">${product.title.slice(0,10)}</p>
             . <p class="ven">${product.vendor}</p>
            </span>
            <div class="com">
            <p class="com1">Rs ${product.price}</p>
            <p class="com2">$${product.compare_at_price}</p>
            <p class="com3">${discount}% off</p>
            </div>
            <button>Add to Cart</button>
        </div>   
    `;
}
// Calculate discount percentage
function calculateDiscount(price, compare_at_price) {
    const discountPercentage = ((compare_at_price - price) / compare_at_price) * 100;
    return Math.round(discountPercentage);
}
// Initially, show products for the 'Men' category
showProducts('Men');

