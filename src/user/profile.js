$(document).ready(function() {
    // Load user data from local storage
    const userString = localStorage.getItem('user');
    let user = null;

    if (userString) {
        user = JSON.parse(userString);
        
        // Populate all profile fields
        $('#profileCustomerId').text(user.customerId || 'N/A');
        $('#profileUserName').text(user.name || 'N/A');
        $('#profileMail').text(user.email || 'N/A');
        $('#profileMobile').text(user.mobile || 'N/A');
        $('#profileRole').text(user.role || 'N/A');
        $('#profileCity').text(user.city || 'N/A');
        $('#profileAddress').text(user.address || 'N/A');
        
        // Format and display Date of Birth
        if (user.dateOfBirth) {
            $('#profileDob').text(new Date(user.dateOfBirth).toLocaleDateString());
        } else {
            $('#profileDob').text('N/A');
        }

        // Note: Gender is not in the user object from the backend.
        $('#profileGender').text('N/A');

        // Set avatar from user object
        if (user.displayPicture) {
            $('#profile_avatar').attr('src', user.displayPicture);
        } else {
            $('#profile_avatar').attr('src', '../assets/logo.png'); // Default avatar
        }
    }

    // Handle avatar upload
    $('#avatarUpload').on('change', async function(e) {
        const file = e.target.files[0];
        if (file && user && user.id) {
            const reader = new FileReader();
            reader.onload = async function(e) {
                const base64Image = e.target.result;
                
                try {
                    showSuccess('Uploading avatar...');

                    const response = await ApiClient.post(
                        API_CONFIG.ENDPOINTS.UPLOAD_AVATAR,
                        { displayPicture: base64Image },
                        { id: user.id }
                    );

                    if (response) {
                        // Update avatar on the page
                        $('#profile_avatar').attr('src', response.displayPicture);
                        
                        // Update user object in local storage
                        localStorage.setItem('user', JSON.stringify(response));
                        user = response; // Update local user variable

                        showSuccess('Avatar updated successfully!');
                    } else {
                        showError('Failed to update avatar.');
                    }
                } catch (error) {
                    console.error("Avatar upload error:", error);
                    showError("Avatar upload failed: " + error.message);
                }
            };
            reader.readAsDataURL(file);
        }
    });
});
