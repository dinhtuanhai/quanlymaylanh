var MayPhucVuController = {

    init: function () {
      MayPhucVuController.xemlichsu();
      MayPhucVuController.enableField();
      MayPhucVuController.registerEvent();
    },
    registerEvent: function () {
        $('.updateMPV').off('keypress').on('keypress', function (e) {
            var id = $(this).data('id');
            var idkh = $(this).data('idkh');
            if (e.which == 13) {
                var tenmay = $('#tenmay_' + id).val();
                var model = $('#model_' + id).val();
                var congsuat = $('#congsuat_' + id).val();
                var vitri = $('#vitri_' + id).val();
                var status = $('#status_' + id).val();
                MayPhucVuController.updateData(id, tenmay, model, congsuat, vitri, status,idkh)
            }
        });
        $('.Opendialog').off('click').on('click', function (e) {
            e.preventDefault();
            var id = $(this).data('id');
            $('.xacnhan').off('click').on('click', function (f) {
                f.preventDefault();
                MayPhucVuController.DeleteMay(id);
            })
            //$(".modal-body #lydo").val(id);
        });
        $('.btnXemKTV').off('click').on('click', function () {
            var idbbnt = $(this).data('idbbnt');
            MayPhucVuController.LoadKTV(idbbnt);
        });
    },
    updateData: function (id, tenmay, model, congsuat, vitri, status,idkh) {
        var dataObject = {
            ID: id,
            TenMay: tenmay,
            Model: model,
            ViTri: vitri,
            CongSuat: congsuat,
            Status: status
        };
        var checkconfirm = confirm("Xác nhận lưu?");
        if (checkconfirm == true) {
            $.ajax({
                url: '/admin/MayPhucVu/Update',
                type: 'POST',
                datatype: 'json',
                data: ({ mayphucvu: JSON.stringify(dataObject), idkh:idkh }),
                success: function (response) {
                    if (response.status) {
                        alert("Cập nhập thành công");
                        location.reload();
                    }
                    else {
                        alert(response.mess);
                        location.reload();
                    }
                }
            })
        }
        else
            location.reload();
    },

    LoadKTV: function (idbbnt) {
        $.ajax({
            url: "/admin/BienBanNghiemThu/LoadKTV",
            data: { idbbnt: idbbnt },
            dataType: "json",
            type: "GET",
            success: function (res) {
                if (res.status) {
                    var data = res.data;
                    var html = '';
                    var template = $('#data-template').html();
                    $.each(data, function (i, item) {
                        html += Mustache.render(template, {
                            ID: item.ID,
                            TenKTV: item.TenKTV,
                            Diem: item.Diem,
                            DanhGia: item.DanhGia
                        });
                    });
                    $('#table_body').html(html);
                }
            }
        })
    },
    enableField: function () {
        $('.btnEditMayPhucVu').on('click', function () {
            var idkh = $(this).data('idkh');
            var id = $(this).data('idmayphucvu');

            if ($('#tenmay_' + id).is(':disabled')) {
                $('#tenmay_' + id).prop('disabled', false);
                $('#model_' + id).prop('disabled', false);
                $('#congsuat_' + id).prop('disabled', false);
                $('#vitri_' + id).prop('disabled', false);
                $('#status_' + id).prop('disabled', false);
                $('#icon_' + id).toggleClass('fas fa-pencil-alt fas fa-save');
            }
            else {
                $('#tenmay_' + id).prop('disabled', true);
                $('#model_' + id).prop('disabled', true);
                $('#congsuat_' + id).prop('disabled', true);
                $('#vitri_' + id).prop('disabled', true);
                $('#status_' + id).prop('disabled', true);
                $('#icon_' + id).toggleClass('fas fa-save fas fa-pencil-alt');

                var tenmay = $('#tenmay_' + id).val();
                var model = $('#model_' + id).val();
                var congsuat = $('#congsuat_' + id).val();
                var vitri = $('#vitri_' + id).val();
                var status = $('#status_' + id).val();
                MayPhucVuController.updateData(id, tenmay, model, congsuat, vitri, status, idkh)
            }

        });
    },
    xemlichsu: function () {
        $('.btnXemLichSu').off('click').on('click', function () {
            var idkh = $(this).data('idkh');
            var idmay = $(this).data('idmay');
            window.location.href = "/admin/MayPhucVu/LichSuSuaChua?idkh=" + idkh + "&idmay=" + idmay;
        })
    },
    DeleteMay: function (id) {
        $.ajax({
            url: '/admin/MayPhucVu/Delete',
            type: 'POST',
            dataType: 'json',
            data: { id: id },
            success: function (res) {
                if (res.status) {
                    $('#row_' + id).remove();
                }
            }
        })
    },

}

MayPhucVuController.init();