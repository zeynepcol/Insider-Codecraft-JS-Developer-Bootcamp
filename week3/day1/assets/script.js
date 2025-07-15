$(document).ready(function () {
  let studentData = [
  { id: "001", name: "Zeynep", surname: "Çöl", class: "4A", grade: 88 },
  { id: "002", name: "John", surname: "Doe", class: "3B", grade: 65 },
  { id: "003", name: "Jane", surname: "Smith", class: "2C", grade: 43 }
  ];

  function renderTable() {
    const tbody = $("#studentTable tbody");
    tbody.empty();

    studentData.forEach((student, index) => {
      tbody.append(`
        <tr data-index="${index}">
          <td>${student.id}</td>
          <td>${student.name}</td>
          <td>${student.surname}</td>
          <td>${student.class}</td>
          <td>${student.grade}</td>
          <td><button class="deleteBtn">Delete</button></td>
        </tr>
      `);
    });
  }

  $("#studentForm").on("submit", function (e) {
    e.preventDefault();

    const id = $("#studentID").val().trim();
    const name = $("#studentName").val().trim();
    const surname = $("#studentSurname").val().trim();
    const studentClass = $("#studentClass").val().trim();
    const grade = parseFloat($("#studentGrade").val());

    if (id && name && surname && studentClass && !isNaN(grade) && grade >= 0) {
      studentData.push({ id, name, surname, class: studentClass, grade });
      renderTable();
      this.reset();
    } else {
      alert("Please fill out all fields and ensure the grade is between 0 and 100.");
    }
  });

  $("#studentTable").on("click", "tr", function () {
    $(this).toggleClass("selected");
  });

  $("#studentTable").on("mouseover", "tr", function () {
    $(this).css("cursor", "pointer");
  });

  $("#studentTable").on("mouseout", "tr", function () {
    $(this).css("cursor", "default");
  });

  $("#studentTable").on("click", ".deleteBtn", function (e) {
    e.stopPropagation();
    const index = $(this).closest("tr").data("index");
    studentData.splice(index, 1);
    renderTable();
  });

  $("input").on("keydown", function () {
    $(this).css("background-color", "#fff8f0");
  });

  $("input").on("keyup", function () {
    $(this).css("background-color", "#ffffff");
  });

  renderTable();
});
