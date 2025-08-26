// HTTP Client Utility Functions
class ApiClient {
    static async request(url, options = {}) {
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        };

        const config = { ...defaultOptions, ...options };

        try {
            const response = await fetch(url, config);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }
            
            return data;
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    }

    static async get(endpoint, pathParams = {}) {
        const url = buildApiUrl(endpoint, pathParams);
        return this.request(url, { method: 'GET' });
    }

    static async post(endpoint, data, pathParams = {}) {
        const url = buildApiUrl(endpoint, pathParams);
        return this.request(url, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    static async postMultipart(endpoint, formData, pathParams = {}) {
        const url = buildApiurl(endpoint, pathParams);
        // For multipart/form-data, we don't set Content-Type header.
        // The browser will set it automatically with the correct boundary.
        return this.request(url, {
            method: 'POST',
            body: formData,
            headers: {}
        });
    }

    static async put(endpoint, data, pathParams = {}) {
        const url = buildApiUrl(endpoint, pathParams);
        return this.request(url, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    static async delete(endpoint, pathParams = {}) {
        const url = buildApiUrl(endpoint, pathParams);
        return this.request(url, { method: 'DELETE' });
    }

    static async uploadFile(endpoint, file, pathParams = {}) {
        const url = buildApiUrl(endpoint, pathParams);
        const formData = new FormData();
        formData.append('file', file);

        return this.request(url, {
            method: 'POST',
            body: formData,
            headers: {} // Let browser set Content-Type for FormData
        });
    }
}

// Utility functions for common UI operations
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = '<div class="spinner-border spinner-border-sm" role="status"></div> Loading...';
        element.disabled = true;
    }
}

function hideLoading(elementId, originalText) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = originalText;
        element.disabled = false;
    }
}

// Helper function to create and show a Bootstrap toast
function showToast(message, type = 'success') {
    const toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        console.error('Toast container not found! Make sure you have a <div class="toast-container"> in your HTML.');
        return;
    }

    const toastId = 'toast-' + Date.now();
    const toastHeaderClass = type === 'danger' ? 'bg-danger' : 'bg-success';

    const toastHtml = `
        <div id="${toastId}" class="toast align-items-center ${toastHeaderClass} border-0" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="3000" data-bs-autohide="true">
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;

    toastContainer.insertAdjacentHTML('beforeend', toastHtml);

    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement);

    // Remove the toast from the DOM after it's hidden
    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
    });

    toast.show();
}

function showError(message, containerId = null) {
    showToast(message, 'danger');
}

function showSuccess(message, containerId = null) {
    showToast(message, 'success');
}

// Export for global use
window.ApiClient = ApiClient;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.showError = showError;
window.showSuccess = showSuccess;
