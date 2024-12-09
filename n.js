$(document).ready(function(){
    function loadFormData() {
        var savedFormData = localStorage.getItem('formData');
        if (savedFormData) {
            var formData = JSON.parse(savedFormData);
            formData.forEach(function (group) {
                var formGroupHtml = '<div class="form-group"><div><h4>' + group.Title + '</h4><i class="close icon"></i><div class="ui form">';
                var inputType = group.Type || 'text';

                Object.keys(group).forEach(function (key) {
                    if (key === "Require") {
                        formGroupHtml += '<div class="field">';
                        formGroupHtml += '<label>Require</label>';
                        formGroupHtml += '<input type="checkbox" name="require"' + (group[key] ? ' checked' : '') + '>';
                        formGroupHtml += '</div>';
                    } else if (key === "Type") {
                        formGroupHtml += '<div class="field"><label>Type</label><select name="type">';
                        ['text', 'number', 'date', 'time', 'datetime-local'].forEach(function (type) {
                            formGroupHtml += '<option value="' + type + '"' + (group[key] === type ? ' selected' : '') + '>' + type + '</option>';
                        });
                        formGroupHtml += '</select></div>';
                    } else if (key === "Title") {
                      
                    } else {
                       
                        formGroupHtml += '<div class="field"><label>' + key + '</label><input type="' + (key === 'Placeholder' ? inputType : 'text') + '" name="' + key.toLowerCase() + '" value="' + group[key] + '"></div>';
                    }
                });

                formGroupHtml += '</div></div></div>';
                $('.form-config').append(formGroupHtml);
            });
        }
    }

    loadFormData();

    const fieldTemplates = {
        input: `<div class="form-group">
                    <div>
                        <h4>Input field</h4>
                        <i class="close icon"></i>
                        <div class="ui form">
                            <div class="field"><label>Type</label>
                                <select name="type">
                                    <option value="text">text</option>
                                    <option value="number">number</option>
                                    <option value="date">date</option>
                                    <option value="time">time</option>
                                    <option value="datetime-local">datetime-local</option>
                                </select>
                            </div>
                            <div class="field"><label>Label</label><input type="text" name="label"></div>
                            <div class="field"><label>Name</label><input type="text" name="name"></div>
                            <div class="field"><label>Id</label><input type="text" name="id"></div>
                            <div class="field"><label>Placeholder</label><input type="text" name="placeholder"></div>
                            <div class="field">
                                <label>Require</label>
                                <input type="checkbox" name="require">
                            </div>
                        </div>
                    </div>
                </div>`,
        textarea: `
            <div class="form-group">
                <div>
                    <h4>Textarea field</h4>
                    <i class="close icon"></i>
                    <div class="ui form">
                        <div class="field"><label>Label</label><input type="text" name="label"></div>
                        <div class="field"><label>Name</label><input type="text" name="name"></div>
                        <div class="field"><label>Id</label><input type="text" name="id"></div>
                        <div class="field"><label>Placeholder</label><input type="text" name="placeholder"></div>
                        <div class="field">
                            <label>Require</label>
                            <input type="checkbox" name="require">
                        </div>
                    </div>
                </div>
            </div>`,
        button: `
            <div class="form-group">
                <div>
                    <h4>Button field</h4>
                    <i class="close icon"></i>
                    <div class="ui form">
                        <div class="field"><label>Label</label><input type="text" name="label"></div>
                        <div class="field"><label>Name</label><input type="text" name="name"></div>
                        <div class="field"><label>Id</label><input type="text" name="id"></div>
                    </div>
                </div>
            </div>`
    };

    function addField(type) {
        $('.form-config').append(fieldTemplates[type]);
    }

    $('#addInputField').click(function() {
        addField('input');
    });

    $('#addTextareaField').click(function() {
        addField('textarea');
    });

    $('#addButtonField').click(function() {
        addField('button');
    });

    $(document).on('click', '.close.icon', function() {
        $(this).closest('.form-group').remove();
    });

    $(document).on('change', 'select[name="type"]', function() {
        var selectedType = $(this).val();
        $(this).closest('.form-group').find('input[name="placeholder"]').attr('type', selectedType);
    });

    $('.form-config').sortable({
        items: '.form-group',
        cursor: 'move',
        opacity: 0.7,
        update: function(event, ui) {
            console.log("Đã cập nhật");
        }
    });

    $('#saveForm').click(function () {
        var formData = [];
        var isValid = true;

        if ($('.form-group').length === 0) {
            alert('Chưa có form nào để lưu!');
            return;
        }

        $('.form-group').each(function () {
            var group = {};
            var type = $(this).find('select[name="type"]').val();
            var title = $(this).find('h4').text().trim();

            $(this).find('.ui.form .field').each(function () {
                var label = $(this).find('label').text().trim();
                var inputElement = $(this).find('input, select');

                if (inputElement.attr('type') === 'checkbox') {
                    var isChecked = inputElement.is(':checked');
                    group[label] = isChecked;
                } else {
                    var input = inputElement.val();

                    if (input === "" && inputElement.attr('type') !== 'checkbox') {
                        isValid = false;
                        alert(label + ' không được để trống!');
                        return false;
                    }

                    group[label] = input;
                }
            });

            if (isValid) {
                group.Type = type;
                group.Title = title;

                formData.push(group);
            }
        });

        if (isValid) {
            localStorage.setItem('formData', JSON.stringify(formData));
            alert('Data lưu thành công!');
        }
    });

    $('#resetForm').click(function(){
        localStorage.removeItem('formData');
        $('.form-config').empty();
        alert('Reset dữ liệu thành công!');
    });
});