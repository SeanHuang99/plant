// updateRequest.js
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});

/**
 * Initializes the update requests page.
 * Fetches the update requests and sets up event listeners.
 */
function initializePage() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    loadingIndicator.style.display = 'block'; // Show loading indicator when the AJAX call starts

    const nickName = getNickName();
    if (!nickName) {
        console.error('Nickname is required');
        loadingIndicator.style.display = 'none'; // Hide the loading indicator on error
        return;
    }

    fetchUpdateRequests(nickName)
        .then(() => {
            loadingIndicator.style.display = 'none'; // Hide the loading indicator on success
        })
        .catch(error => {
            console.error('Error:', error.message);
            loadingIndicator.style.display = 'none'; // Hide the loading indicator on error
        });

    document.getElementById('submitBtn').addEventListener('click', submitRequests);
}

/**
 * Fetches the update requests for the given nickname.
 * @param {string} nickName - The nickname of the user.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if the fetch request fails.
 */
async function fetchUpdateRequests(nickName) {
    const url = `requestHandler/api/getAllUpdateRequests?nickName=${encodeURIComponent(nickName)}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch update requests');
    }

    const data = await response.json();
    const tbody = document.querySelector('table tbody');
    if (data.type === 'success' && data.content.length > 0) {
        renderTableRows(data.content);
    } else {
        tbody.innerHTML = '<tr><td colspan="6">No data found.</td></tr>';
    }
}


/**
 * Renders the table rows for the update requests.
 * @param {Array<Object>} requests - The update requests.
 */
function renderTableRows(requests) {
    const tbody = document.querySelector('table tbody');
    tbody.innerHTML = ''; // Clear existing rows
    requests.forEach(request => {
        const disabled = request.statusOfRequest === 'completed';
        const agreeInput = disabled ? '' : `
                <label class="cell-label">
                <input type="checkbox" class="form-check-input agree" id="agree${request.plantId}" name="decision${request.plantId}">
                <span class="custom-checkbox"></span>
                </label>
                `;
        const rejectInput = disabled ? '' : `
                <label class="cell-label">
                <input type="checkbox" class="form-check-input reject" id="reject${request.plantId}" name="decision${request.plantId}">
                <span class="custom-checkbox"></span>
                </label>
                `;
        tbody.innerHTML += `
            <tr id="${request.plantId}" data-full-date="${request.date}" nickName = "${request.nickName}">
                <td>${request.plantOriginalName || 'N/A'}</td>
                <td>${request.plantName || 'N/A'}</td>
                <td>${request.statusOfRequest || 'in-progress'}</td>
                <td>${new Date(request.date).toLocaleDateString()}</td>
                <td>${request.decision || 'Pending decision'}</td>
                <td>${agreeInput}</td>
                <td>${rejectInput}</td>
                
            </tr>
        `;
    });
    setupCheckboxBehavior();
}

/**
 * Sets up the behavior for the agree and reject checkboxes.
 * Ensures that only one checkbox is selected at a time.
 */
function setupCheckboxBehavior() {
    document.querySelectorAll('input.agree, input.reject').forEach(input => {
        input.addEventListener('change', function() {
            const name = this.name;
            document.querySelectorAll(`input[name="${name}"]`).forEach(box => {
                if (box !== this) box.checked = false;
            });
        });
    });
}

/**
 * Submits the selected update requests.
 * Sends the requests to the backend for processing.
 */
async function submitRequests() {
    const requests = [];
    document.querySelectorAll('table tbody tr').forEach(row => {
        const agreeInput = row.querySelector('.agree');
        const rejectInput = row.querySelector('.reject');

        // 只有当复选框实际存在时，才尝试读取它们的状态并处理
        if (agreeInput && rejectInput) {
            const agreeChecked = agreeInput.checked;
            const rejectChecked = rejectInput.checked;
            if (agreeChecked || rejectChecked) {
                requests.push({
                    plantId: row.id,
                    plantName: row.cells[1].textContent,
                    date: row.getAttribute('data-full-date'), // 获取完整的日期信息
                    decision: agreeChecked ? 'agree' : 'reject',
                    nickName: row.getAttribute('nickName')
                });
            }
        } else {
            // 如果没有找到复选框，可以在这里添加一些调试信息
            console.log(`No checkboxes found for row: ${row.id}`);
        }
    });

    if (requests.length === 0) {
        alert('No requests selected.');
        return;
    }

    try {
        const response = await fetch('/requestHandler/updatePlantsRequestFromURPage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({requests})
        });

        if (response.ok) {
            alert('Requests submitted successfully.');
            window.location.reload();
        } else {
            throw new Error('Failed to submit requests');
        }
    } catch (error) {
        alert('Failed to submit requests.');
        console.error('Submission error:', error);
    }
}


