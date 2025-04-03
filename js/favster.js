document.addEventListener('DOMContentLoaded', () => {
    // Filter Functionality
    const categoryCheckboxes = document.querySelectorAll('.filters input[type="checkbox"][data-filter="category"]');
    const brandCheckboxes = document.querySelectorAll('.filters input[type="checkbox"][data-filter="brand"]');
    const colorOptions = document.querySelectorAll('.color-option');
    const sizeOptions = document.querySelectorAll('.size-option');
    const priceRange = document.querySelector('.filters input[type="range"]');
    const priceDisplay = document.querySelector('.filters p');
    const products = document.querySelectorAll('.product');

    // Redirect to Buy Page
    window.redirectToBuy = (productName, productPrice, productColor, productSize) => {
        const url = `buy.html?name=${encodeURIComponent(productName)}&price=${encodeURIComponent(productPrice)}&color=${encodeURIComponent(productColor)}&size=${encodeURIComponent(productSize)}`;
        window.location.href = url;
    };

    // Filter Products
    function filterProducts() {
        const selectedCategories = Array.from(categoryCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value.toLowerCase());

        const selectedBrands = Array.from(brandCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value.toLowerCase());

        const selectedColor = Array.from(colorOptions)
            .find(option => option.classList.contains('selected'))?.dataset.color;

        const selectedSize = Array.from(sizeOptions)
            .find(option => option.classList.contains('selected'))?.textContent;

        const selectedPrice = parseInt(priceRange.value);

        products.forEach(product => {
            const productPrice = parseInt(product.querySelector('.product-price').textContent.replace('GHc', ''));
            const productCategory = product.dataset.category.toLowerCase();
            const productBrand = product.dataset.brand.toLowerCase();
            const productColor = product.dataset.color.toLowerCase();
            const productSize = product.dataset.size;

            const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(productCategory);
            const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(productBrand);
            const colorMatch = !selectedColor || productColor === selectedColor;
            const sizeMatch = !selectedSize || productSize === selectedSize;
            const priceMatch = productPrice <= selectedPrice;

            product.style.display = categoryMatch && brandMatch && colorMatch && sizeMatch && priceMatch ? 'block' : 'none';
        });
    }

    // Event Listeners for Filters
    categoryCheckboxes.forEach(checkbox => checkbox.addEventListener('change', filterProducts));
    brandCheckboxes.forEach(checkbox => checkbox.addEventListener('change', filterProducts));
    priceRange.addEventListener('input', () => {
        priceDisplay.textContent = `Price: GHc0 - GHc${priceRange.value}`;
        filterProducts();
    });

    colorOptions.forEach(color => {
        color.addEventListener('click', () => {
            colorOptions.forEach(option => option.classList.remove('selected'));
            color.classList.add('selected');
            filterProducts();
        });
    });

    sizeOptions.forEach(size => {
        size.addEventListener('click', () => {
            sizeOptions.forEach(option => option.classList.remove('selected'));
            size.classList.add('selected');
            filterProducts();
        });
    });

    // Slideshow Functionality
    let slideIndex = 0;

    function showSlides() {
        const slides = document.querySelectorAll('.slide');
        slides.forEach(slide => (slide.style.display = 'none'));
        slideIndex = (slideIndex + 1 > slides.length) ? 1 : slideIndex + 1;
        slides[slideIndex - 1].style.display = 'block';
        setTimeout(showSlides, 3000); // Change image every 3 seconds
    }

    showSlides();

    // Newsletter Subscription
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterEmail = document.getElementById('newsletter-email');
    const newsletterMessage = document.getElementById('newsletter-message');
    
    newsletterForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission
    
        const email = newsletterEmail.value.trim();
    
        if (!email) {
            newsletterMessage.textContent = 'Please enter a valid email address.';
            newsletterMessage.style.display = 'block';
            return;
        }
    
        try {
            const response = await fetch('/newsletter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });
    
            const result = await response.json();
    
            if (response.ok) {
                newsletterMessage.textContent = result.message;
                newsletterMessage.style.color = 'green';
                newsletterMessage.style.display = 'block';
                newsletterEmail.value = ''; // Clear the input field
            } else {
                newsletterMessage.textContent = result.error || 'An error occurred.';
                newsletterMessage.style.color = 'red';
                newsletterMessage.style.display = 'block';
            }
        } catch (error) {
            console.error('Error subscribing to newsletter:', error);
            newsletterMessage.textContent = 'An error occurred. Please try again later.';
            newsletterMessage.style.color = 'red';
            newsletterMessage.style.display = 'block';
        }
    });

    // Search Bar Functionality
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const clearButton = document.getElementById('clear-button');

    function searchProducts() {
        const query = searchInput.value.toLowerCase().trim();

        products.forEach(product => {
            const productName = product.querySelector('h3').textContent.toLowerCase();
            const productBrand = product.dataset.brand.toLowerCase();
            const productCategory = product.dataset.category.toLowerCase();

            // Check if the query matches the product name, brand, or category
            if (productName.includes(query) || productBrand.includes(query) || productCategory.includes(query)) {
                product.style.display = 'block'; // Show matching products
            } else {
                product.style.display = 'none'; // Hide non-matching products
            }
        });
    }

    // Add event listeners for the search bar
    searchButton.addEventListener('click', searchProducts);
    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            searchProducts();
        }
    });

    clearButton.addEventListener('click', () => {
        searchInput.value = ''; // Clear the search input
        products.forEach(product => {
            product.style.display = 'block'; // Show all products
        });   
    });
    
});