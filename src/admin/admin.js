$(document).ready(function () {
  if (user_mode === "AGENT") {
    $("#btnRoleAssign").hide();
  }

  // Claim approval btn
  $("#btnClaimApproval").click(function () {
    showOnlySection("#claimApprovalSectionContainer");
    fetchClaims("approval");
  });

  // Claim List Button
  $("#btnClaimList").click(function () {
    showOnlySection("#claimListSection");
    fetchClaims("list");
  });

  // Renewal List Button
  $("#btnRenewalList").click(function () {
    showOnlySection("#renewalListSection");
    fetchRenewals();
  });

  // customer List Button
  $("#CustomerList").click(function () {
    showOnlySection("#customerSection");
    fetchUsers("customer");
  });

  // Role assign Button
  $("#btnRoleAssign").click(function () {
    showOnlySection("#roleAssignSection");
    fetchAgents();
  });

  $("#btnAddAgentForm").click(function () {
    resetForm();
    fetchUsers("agent");
    $("#addAgentForm").toggleClass("admin_part_hidden");
    $("html, body").animate(
      {
        scrollTop: $("#addAgentForm").offset().top,
      },
      600
    );
  });

  //-------------------------------------------------------------------claim approval section----------------------------------------

  $("#claimApprovalSection").on("click", ".submitClaimBtn", function () {
    const row = $(this).closest("tr");
    const id = row.data("id");
    const status = row.find(".actionSelect").val();
    const remark = row.find(".remarkInput").val();

    if (!id) {
      showError("Could not find claim ID for this row.");
      return;
    }

    if (!status) {
      showError("Please select an action before submitting.");
      return;
    }

    updateClaimStatus(id, status, remark, () => {
      row.find("td").eq(6).text(status);
      row.find(".actionSelect").prop("disabled", true);
      row.find(".remarkInput").prop("disabled", true);
      $(this).prop("disabled", true);
    });
  });;

  //-------------------------------------------------------------------customer edit/delete section----------------------------------------
  $("#customerBody").on("click", ".editBtn", function () {
    const row = $(this).closest("tr");
    row
      .find("td")
      .filter((i) => [1, 3, 4, 5].includes(i))
      .attr("contenteditable", true)
      .addClass("table-warning");
    $(this)
      .text("Save")
      .removeClass("btn-warning")
      .addClass("btn-success saveBtn")
      .removeClass("editBtn");
  });

  $("#customerBody").on("click", ".saveBtn", function () {
    const row = $(this).closest("tr");
    const userId = row.find("td").eq(2).text();
    const updatedUser = {
      name: row.find("td").eq(1).text(),
      email: row.find("td").eq(3).text(),
      phone: row.find("td").eq(4).text(),
      address: row.find("td").eq(5).text(),
    };

    updateUser(userId, updatedUser, () => {
      row
        .find("td")
        .filter((i) => [1, 3, 4, 5].includes(i))
        .attr("contenteditable", false)
        .removeClass("table-warning");
      $(this)
        .text("Edit")
        .removeClass("btn-success")
        .addClass("btn-warning editBtn")
        .removeClass("saveBtn");
    });
  });

  $("#customerBody").on("click", ".deleteBtn", function () {
    const row = $(this).closest("tr");
    const userId = row.find("td").eq(2).text();
    deleteUser(userId, () => {
      row.remove();
      renumberSNo("#customerBody tr");
    });
  });

  //-------------------------------------------------------------------add agents section----------------------------------------
  $("#agentForm").on("submit", function (e) {
    e.preventDefault();

    const agentData = {
      userId: $("#agentUser").val(),
      role: $("#agentRole").val(),
      district: $("#agentDistrict").val().join(","),
    };

    addAgent(agentData, () => {
      fetchAgents();
      resetForm();
      $("#addAgentForm").addClass("admin_part_hidden");
    });
  });

  $("#agentTable").on("click", ".deleteBtn", function () {
    const row = $(this).closest("tr");
    const id = row.data("id");
    deleteAgent(id, () => {
      row.remove();
      renumberSNo("#agentTable tbody tr");
    });
  });

  $("#agentTable").on("click", ".editBtn", function () {
    const row = $(this).closest("tr");
    row
      .find("td")
      .filter((i) => [2, 3, 4].includes(i))
      .attr("contenteditable", true)
      .addClass("table-warning");
    $(this)
      .text("Save")
      .removeClass("btn-warning")
      .addClass("btn-success saveBtn")
      .removeClass("editBtn");
  });

  $("#agentTable").on("click", ".saveBtn", function () {
    const row = $(this).closest("tr");
    const id = row.data("id");
    const updatedAgent = {
      name: row.find("td").eq(2).text(),
      role: row.find("td").eq(3).text(),
      district: row.find("td").eq(4).text(),
    };

    updateAgent(id, updatedAgent, () => {
      row
        .find("td")
        .filter((i) => [2, 3, 4].includes(i))
        .attr("contenteditable", false)
        .removeClass("table-warning");
      $(this)
        .text("Edit")
        .removeClass("btn-success")
        .addClass("btn-warning editBtn")
        .removeClass("saveBtn");
    });
  });

  // --- Multi-select district dropdown ---
  const districtSearch = $("#districtSearch");
  const districtDropdown = $("#district-dropdown");
  const selectedDistrictsContainer = $("#selected-districts");
  const agentDistrictSelect = $("#agentDistrict");

  let allDistricts = TELANGANA_DISTRICTS;

  function renderDropdown(districts) {
    districtDropdown.empty();
    districts.forEach((district) => {
      districtDropdown.append(
        `<div class="dropdown-item" data-value="${district}">${district}</div>`
      );
    });
    districtDropdown.show();
  }

  function addDistrict(district) {
    selectedDistrictsContainer.append(`
      <div class="selected-item" data-value="${district}">
        ${district}
        <span class="remove-item" data-value="${district}">&times;</span>
      </div>
    `);
    agentDistrictSelect.append(
      `<option value="${district}" selected>${district}</option>`
    );
    districtSearch.val("");
    districtDropdown.hide();
  }

  districtSearch.on("focus", function () {
    const selected = agentDistrictSelect.val() || [];
    renderDropdown(allDistricts.filter((d) => !selected.includes(d)));
  });

  districtSearch.on("keyup", function () {
    const searchTerm = $(this).val().toLowerCase();
    const selected = agentDistrictSelect.val() || [];
    const filteredDistricts = allDistricts.filter(
      (d) => d.toLowerCase().includes(searchTerm) && !selected.includes(d)
    );
    renderDropdown(filteredDistricts);
  });

  districtDropdown.on("click", ".dropdown-item", function () {
    addDistrict($(this).data("value"));
  });

  selectedDistrictsContainer.on("click", ".remove-item", function () {
    const district = $(this).data("value");
    $(this).parent().remove();
    agentDistrictSelect.find(`option[value="${district}"]`).remove();
  });

  $(document).on("click", function (e) {
    if (!$(e.target).closest(".multi-select-container").length) {
      districtDropdown.hide();
    }
  });
});

function showOnlySection(sectionId) {
  $(
    "#claimApprovalSectionContainer, #roleAssignSection, #claimListSection, #renewalListSection, #customerSection"
  ).addClass("admin_part_hidden");
  $(sectionId).removeClass("admin_part_hidden");
}

function renumberSNo(section) {
  $(section).each(function (index) {
    $(this)
      .find("td")
      .eq(0)
      .text(index + 1);
  });
}

function resetForm() {
  $("#agentUser").val("");
  $("#agentRole").val("Agent");
  $("#agentDistrict").val("");
  $("#selected-districts").empty();
  $("#agentDistrict").empty();
  $("#formTitle").text("Add New Agent");
  $("#btnAddAgent").text("Add");
}

// ------------------ API Calls ------------------

let claimList = [];
let renewalList = [];
let userList = [];
let agentList = [];

function fetchClaims(mode) {
  if (claimList.length == 0) {
    ApiClient.get(API_CONFIG.ENDPOINTS.CLAIMS)
      .then((data) => {
        claimList = data;
        loadClaims(mode);
      })
      .catch((error) => console.error("Error fetching claims:", error));
  } else {
    loadClaims(mode);
  }
}

const loadClaims = (mode) => {
  mode == "approval"
    ? renderClaims(
        claimList.filter((c) => c.status === "PENDING"),
        "#claimTableBody"
      )
    : renderSimpleTable(claimList, "#claimListTableBody");
};

function fetchRenewals() {
  ApiClient.get(API_CONFIG.ENDPOINTS.RENEWALS)
    .then((data) => renderSimpleTable(data, "#renewalListTableBody"))
    .catch((error) => console.error("Error fetching renewals:", error));
}

function fetchUsers(mode) {
  if (userList.length == 0) {
    ApiClient.get(API_CONFIG.ENDPOINTS.USERS)
      .then((data) => {
        userList = data;
        mode === "customer"
          ? renderCustomerList(userList)
          : populateUserDropdown(userList);
      })
      .catch((error) => console.error("Error fetching users:", error));
  } else {
    mode === "customer"
      ? renderCustomerList(userList)
      : populateUserDropdown(userList);
  }
}

function fetchAgents() {
  if (agentList.length == 0) {
    ApiClient.get(API_CONFIG.ENDPOINTS.AGENTS)
      .then((data) => {
        agentList = data;
        renderAgentsTable(agentList);
      })
      .catch((error) => console.error("Error fetching agents:", error));
  } else {
    renderAgentsTable(agentList);
  }
}

function updateClaimStatus(id, status, remark, callback) {
  const agentId = localStorage.getItem("agentId");

  if (!agentId) {
    showError("Approver ID not found. Please make sure you are logged in.");
    return;
  }

  const pathParams = { id: id };
  const body = {
    status: status,
    remark: remark,
    approvedBy: agentId,
  };

  ApiClient.put(API_CONFIG.ENDPOINTS.UPDATE_CLAIM_STATUS, body, pathParams)
    .then(() => {
      showSuccess("Claim status updated successfully!");
      if (callback) {
        callback();
      }
    })
    .catch((error) => showError("Failed to update claim status."));
}

function updateUser(userId, userData, callback) {
  ApiClient.put(API_CONFIG.ENDPOINTS.USERS + "/" + userId, userData)
    .then(() => {
      showSuccess("User updated successfully!");
      callback();
    })
    .catch((error) => showError("Failed to update user."));
}

function deleteUser(userId, callback) {
  ApiClient.delete(API_CONFIG.ENDPOINTS.USERS + "/" + userId)
    .then(() => {
      showSuccess("User deleted successfully!");
      callback();
    })
    .catch((error) => showError("Failed to delete user."));
}

function addAgent(agentData, callback) {
  ApiClient.post(API_CONFIG.ENDPOINTS.AGENTS, agentData)
    .then(() => {
      showSuccess("Agent added successfully!");
      callback();
    })
    .catch((error) => showError("Failed to add agent."));
}

function deleteAgent(agentId, callback) {
  ApiClient.delete(API_CONFIG.ENDPOINTS.AGENTS + "/" + agentId)
    .then(() => {
      showSuccess("Agent deleted successfully!");
      callback();
    })
    .catch((error) => showError("Failed to delete agent."));
}

function updateAgent(agentId, agentData, callback) {
  ApiClient.put(API_CONFIG.ENDPOINTS.AGENTS + "/" + agentId, agentData)
    .then(() => {
      showSuccess("Agent updated successfully!");
      callback();
    })
    .catch((error) => showError("Failed to update agent."));
}

// ------------------ Rendering Functions ------------------

function populateUserDropdown(users) {
  const userDropdown = $("#agentUser");
  userDropdown.empty();
  userDropdown.append('<option value="">Select User</option>');
  $.each(users, function (index, user) {
    if (user.role === "USER") {
      userDropdown.append(`<option value="${user.id}">${user.name}</option>`);
    }
  });
}

function renderSimpleTable(data, targetBody) {
  $(targetBody).empty();
  $.each(data, function (index, item) {
    $(targetBody).append(`
      <tr>
        <td>${index + 1}</td>
        <td>${item.user.customerId}</td>
        <td>${
          targetBody === "#claimListTableBody" ? item.claimId : item.renewalId
        }</td>
        <td>${item.policy.policyId}</td>
        <td>${
          targetBody === "#claimListTableBody"
            ? `Rs.${item.claimAmount}`
            : item.renewalDate
        }</td>
        <td>${
          targetBody === "#claimListTableBody"
            ? item.claimDate
            : `Rs.${item.newPremium}`
        }</td>
        <td>${
          targetBody === "#claimListTableBody"
            ? item.status === "PENDING"
              ? "⏳ Awaiting Review"
              : item.status
            : item.policy.endDate
        }</td>
      </tr>
    `);
  });
}

function renderAgentsTable(data) {
  $("#agentTable tbody").empty();
  $.each(data, function (index, agent) {
    const row = `
      <tr data-id="${agent.id}">
        <td>${index + 1}</td>
        <td contenteditable="false">${agent.agentId}</td>
        <td contenteditable="false">${agent.user.name}</td>
        <td contenteditable="false">${agent.role}</td>
        <td contenteditable="false">${agent.district}</td>
        <td>
          <button class="btn btn-sm btn-warning editBtn">Edit</button>
          <button class="btn btn-sm btn-danger deleteBtn">Delete</button>
        </td>
      </tr>`;
    $("#agentTable tbody").append(row);
  });
}

function renderClaims(claims, targetBody) {
  $(targetBody).empty();
  $.each(claims, function (i, claim) {
    const row = `
            <tr data-id="${claim.id}" data-claim-id="${claim.claimId}">
              <td>${i + 1}</td>
              <td>${claim.user.customerId}</td>
              <td>${claim.claimId}</td>
              <td>${claim.policy.policyId}</td>
              <td>Rs.${claim.claimAmount}</td>
              <td>${claim.claimDate}</td>
              <td>${claim.status}</td>
              <td>
                <select class="form-select actionSelect">
                  <option value="">Select</option>
                  <option value="Approved">Accept</option>
                  <option value="Rejected">Reject</option>
                </select>
              </td>
              <td>
                <input type="text" class="form-control remarkInput" placeholder="Enter remark"/>
              </td>
              <td>
                <button class="btn btn-sm btn-success submitClaimBtn">Submit</button>
              </td>
            </tr>`;
    $(targetBody).append(row);
  });
}

function renderCustomerList(customers) {
  $("#customerBody").empty();
  $.each(customers, function (index, customer) {
    $("#customerBody").append(`
          <tr>
            <td>${index + 1}</td>
            <td contenteditable="false">${customer.name}</td>
            <td >${customer.customerId}</td>
            <td contenteditable="false">${customer.email}</td>
            <td contenteditable="false">${customer.mobile}</td>
            <td contenteditable="false">${customer.address}</td>
            <td>
              <button class="btn btn-sm btn-warning editBtn">Edit</button>
              <button class="btn btn-sm btn-danger deleteBtn">Delete</button>
            </td>
          </tr>
        `);
  });
}