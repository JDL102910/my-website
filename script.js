
// Review management
let reviews = [
    {
        name: "Sarah Johnson",
        rating: 5,
        text: "Absolutely fantastic service! My windows have never looked better. The team was professional, punctual, and left no streaks whatsoever. I'll definitely be using them again!",
        date: "March 15, 2024",
        service: "Residential Cleaning"
    },
    {
        name: "Mike Rodriguez",
        rating: 5,
        text: "Crystal Clear Windows transformed our office building. The difference is night and day! Our clients have even commented on how clean and professional our building looks now.",
        date: "March 8, 2024",
        service: "Commercial Cleaning"
    },
    {
        name: "Jennifer Chen",
        rating: 5,
        text: "I was impressed by their attention to detail. They cleaned not just the windows but also the frames and sills. Great value for money and excellent customer service!",
        date: "February 28, 2024",
        service: "Deep Cleaning"
    },
    {
        name: "David Thompson",
        rating: 5,
        text: "Reliable and trustworthy. They showed up exactly when promised and did an incredible job. My home's curb appeal has increased significantly. Highly recommend!",
        date: "February 20, 2024",
        service: "Residential Cleaning"
    },
    {
        name: "Lisa Wang",
        rating: 5,
        text: "Professional team with top-quality equipment. They were careful around my flower beds and left everything spotless. The pricing was very fair for the quality of work.",
        date: "February 12, 2024",
        service: "Residential Cleaning"
    },
    {
        name: "Robert Martinez",
        rating: 5,
        text: "Outstanding work! They tackled some very difficult windows on my second story without any issues. The results speak for themselves - crystal clear windows inside and out!",
        date: "January 30, 2024",
        service: "Residential Cleaning"
    }
];

// Load reviews from localStorage if available
function loadReviews() {
    const savedReviews = localStorage.getItem('crystalClearReviews');
    if (savedReviews) {
        reviews = JSON.parse(savedReviews);
    }
}

// Save reviews to localStorage
function saveReviews() {
    localStorage.setItem('crystalClearReviews', JSON.stringify(reviews));
}

// Generate star display from rating number
function generateStars(rating) {
    return '⭐'.repeat(rating);
}

// Format date to readable string
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// Display all reviews
function displayReviews() {
    const reviewsGrid = document.getElementById('reviews-grid');
    if (!reviewsGrid) return;
    
    reviewsGrid.innerHTML = '';
    
    // Sort reviews by date (newest first)
    const sortedReviews = [...reviews].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    sortedReviews.forEach(review => {
        const reviewCard = document.createElement('div');
        reviewCard.className = 'review-card';
        reviewCard.innerHTML = `
            <div class="stars">${generateStars(review.rating)}</div>
            <h3>${review.name}</h3>
            <p class="review-text">"${review.text}"</p>
            ${review.service ? `<p class="service-type"><strong>Service:</strong> ${review.service}</p>` : ''}
            <span class="review-date">${formatDate(review.date)}</span>
        `;
        reviewsGrid.appendChild(reviewCard);
    });
    
    updateReviewStats();
}

// Update review statistics
function updateReviewStats() {
    const totalReviews = reviews.length;
    const avgRating = totalReviews > 0 ? (reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1) : 0;
    const recommendPercent = totalReviews > 0 ? Math.round((reviews.filter(review => review.rating >= 4).length / totalReviews) * 100) : 0;
    
    const avgRatingElement = document.getElementById('average-rating');
    const totalReviewsElement = document.getElementById('total-reviews');
    const recommendPercentElement = document.getElementById('recommend-percent');
    
    if (avgRatingElement) avgRatingElement.textContent = `${avgRating}/5`;
    if (totalReviewsElement) totalReviewsElement.textContent = totalReviews.toString();
    if (recommendPercentElement) recommendPercentElement.textContent = `${recommendPercent}%`;
}

// Handle review form submission
function handleReviewSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const reviewData = Object.fromEntries(formData.entries());
    
    // Validate form
    if (!reviewData['reviewer-name'] || !reviewData.rating || !reviewData['review-text']) {
        showErrorMessage('Please fill in all required fields (Name, Rating, and Review).');
        return;
    }
    
    // Create new review object
    const newReview = {
        name: reviewData['reviewer-name'].trim(),
        rating: parseInt(reviewData.rating),
        text: reviewData['review-text'].trim(),
        date: new Date().toISOString().split('T')[0],
        service: reviewData['service-type'] || null
    };
    
    // Add to reviews array
    reviews.unshift(newReview); // Add to beginning for newest first
    
    // Save to localStorage
    saveReviews();
    
    // Update display
    displayReviews();
    
    // Show success message
    showSuccessMessage('Review Submitted!', 'Thank you for sharing your experience! Your review has been added and will help other customers learn about our services.');
    
    // Reset form
    e.target.reset();
}

// Navigation active state management
document.addEventListener('DOMContentLoaded', function() {
    // Load and display reviews on page load
    loadReviews();
    displayReviews();
    // Set minimum date for booking form to today
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    // Form submission handling
    const bookingForm = document.getElementById('bookingForm');
    const contactForm = document.getElementById('contactForm');
    const reviewForm = document.getElementById('reviewForm');

    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmit);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }

    if (reviewForm) {
        reviewForm.addEventListener('submit', handleReviewSubmit);
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add animation to cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all cards and form elements
    document.querySelectorAll('.service-card, .review-card, .feature, .benefit, .contact-item').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});

function handleBookingSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const bookingData = Object.fromEntries(formData.entries());
    
    // Basic form validation
    if (!validateBookingForm(bookingData)) {
        return;
    }
    
    // Simulate form submission
    showSuccessMessage('Booking Request Submitted!', 
        'Thank you for your booking request! We\'ll contact you within 24 hours to confirm your appointment and provide a detailed quote.');
    
    // Reset form
    e.target.reset();
}

function handleContactSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const contactData = Object.fromEntries(formData.entries());
    
    // Get selected services
    const services = [];
    document.querySelectorAll('input[name="services"]:checked').forEach(checkbox => {
        services.push(checkbox.value);
    });
    contactData.services = services;
    
    // Basic form validation
    if (!validateContactForm(contactData)) {
        return;
    }
    
    // Simulate form submission
    showSuccessMessage('Service Request Submitted!', 
        'Thank you for your detailed service request! We\'ll review your requirements and contact you within 24 hours with a customized quote.');
    
    // Reset form
    e.target.reset();
}

function validateBookingForm(data) {
    const requiredFields = ['name', 'email', 'phone', 'address', 'date', 'time', 'service-type'];
    
    for (let field of requiredFields) {
        if (!data[field] || data[field].trim() === '') {
            showErrorMessage(`Please fill in the ${field.replace('-', ' ')} field.`);
            return false;
        }
    }
    
    if (!isValidEmail(data.email)) {
        showErrorMessage('Please enter a valid email address.');
        return false;
    }
    
    return true;
}

function validateContactForm(data) {
    const requiredFields = ['client-name', 'client-email', 'client-phone', 'property-address', 'special-instructions'];
    
    for (let field of requiredFields) {
        if (!data[field] || data[field].trim() === '') {
            showErrorMessage(`Please fill in the ${field.replace('-', ' ')} field.`);
            return false;
        }
    }
    
    if (!isValidEmail(data['client-email'])) {
        showErrorMessage('Please enter a valid email address.');
        return false;
    }
    
    if (!data.services || data.services.length === 0) {
        showErrorMessage('Please select at least one service.');
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showSuccessMessage(title, message) {
    // Create success modal
    const modal = createModal(title, message, 'success');
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => modal.classList.add('show'), 100);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        modal.classList.remove('show');
        setTimeout(() => document.body.removeChild(modal), 300);
    }, 5000);
}

function showErrorMessage(message) {
    // Create error modal
    const modal = createModal('Error', message, 'error');
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => modal.classList.add('show'), 100);
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        modal.classList.remove('show');
        setTimeout(() => document.body.removeChild(modal), 300);
    }, 3000);
}

function createModal(title, message, type) {
    const modal = document.createElement('div');
    modal.className = `modal modal-${type}`;
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <p>${message}</p>
            </div>
        </div>
    `;
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        .modal.show {
            opacity: 1;
        }
        .modal-content {
            background: white;
            border-radius: 15px;
            max-width: 500px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem;
            border-bottom: 1px solid #eee;
        }
        .modal-header h3 {
            margin: 0;
            color: #333;
        }
        .modal-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #999;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.2s ease;
        }
        .modal-close:hover {
            background: #f0f0f0;
            color: #333;
        }
        .modal-body {
            padding: 1.5rem;
        }
        .modal-body p {
            margin: 0;
            line-height: 1.6;
            color: #666;
        }
        .modal-success .modal-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .modal-success .modal-header h3,
        .modal-success .modal-close {
            color: white;
        }
        .modal-error .modal-header {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
        }
        .modal-error .modal-header h3,
        .modal-error .modal-close {
            color: white;
        }
    `;
    
    if (!document.querySelector('#modal-styles')) {
        style.id = 'modal-styles';
        document.head.appendChild(style);
    }
    
    return modal;
}

// Add some interactive hover effects
document.addEventListener('DOMContentLoaded', function() {
    // Add tilt effect to service cards
    const cards = document.querySelectorAll('.service-card, .review-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) rotateX(5deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateX(0)';
        });
    });
    
    // Add floating animation to hero image
    const heroImage = document.querySelector('.hero-image img');
    if (heroImage) {
        let floating = true;
        function floatAnimation() {
            if (floating) {
                heroImage.style.transform = 'perspective(1000px) rotateY(-5deg) translateY(-10px)';
            } else {
                heroImage.style.transform = 'perspective(1000px) rotateY(-5deg) translateY(0px)';
            }
            floating = !floating;
        }
        
        setInterval(floatAnimation, 2000);
    }
});
