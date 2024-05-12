document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});

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

function renderTableRows(requests) {
    const tbody = document.querySelector('table tbody');
    tbody.innerHTML = ''; // Clear existing rows
    requests.forEach(request => {
        const disabled = request.statusOfRequest === 'completed';
        const agreeInput = disabled ? '' : `<input type="checkbox" class="form-check-input agree" name="decision${request.plantId}">`;
        const rejectInput = disabled ? '' : `<input type="checkbox" class="form-check-input reject" name="decision${request.plantId}">`;
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
                    // creator: getNickName() // 因为它是同步的，所以可以在这里直接调用

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


