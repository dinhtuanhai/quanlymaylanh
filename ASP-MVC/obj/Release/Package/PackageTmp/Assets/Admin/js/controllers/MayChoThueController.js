var MayChoThueController = {

    init: function () {
        MayChoThueController.registerEvents();
    },
    
    updateData: function (id, tenmay, model, congsuat, ngaymua, iddichvu, ghichu,status) {
        var dataObject = {
            ID: id,
            TenMay: tenmay,
            Model: model,
            CongSuat: congsuat,
            IDDichVu: iddichvu,
            GhiChu: ghichu,
            Status: status
        };
        var checkconfirm = confirm("Xác nhận lưu?");
        if (checkconfirm == true) {
            $.ajax({
                url: '/admin/MayChoThue/Update',
                type: 'POST',
                datatype: 'json',
                data: ({ mct: JSON.stringify(dataObject), ngaymua: ngaymua }),
                success: function (response) {
                    if (response.status) {
                        alert("Cập nhập thành công");
                        location.reload();
                    }
                    else {
                        alert(response.mess);
                        //location.reload();
                    }
                }
            })
        }
        else
            location.reload();
    },

    enableField: function (id) {
        if ($('#tenmay_' + id).is(':disabled')) {
            $('#tenmay_' + id).prop('disabled', false);
            $('#model_' + id).prop('disabled', false);
            $('#congsuat_' + id).prop('disabled', false);
            $('#ngaymua_' + id).prop('disabled', false);
            $('#iddichvu_' + id).prop('disabled', false);
            $('#ghichu_' + id).prop('disabled', false);
            $('#status_' + id).prop('disabled', false);
            $('#icon_' + id).toggleClass('fas fa-pencil-alt fas fa-save');
        }
        else {
            $('#tenmay_' + id).prop('disabled', true);
            $('#model_' + id).prop('disabled', true);
            $('#congsuat_' + id).prop('disabled', true);
            $('#ngaymua_' + id).prop('disabled', true);
            $('#iddichvu_' + id).prop('disabled', true);
            $('#ghichu_' + id).prop('disabled', true);
            $('#status_' + id).prop('disabled', true);
            $('#icon_' + id).toggleClass('fas fa-save fas fa-pencil-alt');

            var tenmay = $('#tenmay_' + id).val();
            var model = $('#model_' + id).val();
            var congsuat = $('#congsuat_' + id).val();
            var ngaymua = $('#ngaymua_' + id).val();
            var iddichvu = $('#iddichvu_' + id).val();
            var ghichu = $('#ghichu_' + id).val();
            var status = $('#status_' + id).val();
            MayChoThueController.updateData(id, tenmay, model, congsuat, ngaymua, iddichvu, ghichu,status)
        }
    },
    // xác nhận xóa máy cho thuê
    XacNhan: function () {
        $('.Opendialog').off('click').on('click', function (e) {
            e.preventDefault();
            var id = $(this).data('id');
            $('.xacnhan').off('click').on('click', function (f) {
                f.preventDefault();
                //ycpv.DeleteMayChoThue(id);
            })
            //$(".modal-body #lydo").val(id);
        })
    },
    DeleteMay: function (id) {
        $.ajax({
            url: '/admin/MayChoThue/Delete',
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
    registerEvents: function () {
        $('.btnEditMayChoThue').on('click', function () {
            var id = $(this).data('idmaychothue');
            //$('#iddichvu_' + id).autocomplete({
            //    source: function (request, response) {
            //        $.ajax({
            //            url: "/admin/BienBanNghiemThu/DropDownDV",
            //            type: "POST",
            //            dataType: "json",
            //            data: { s: request.term },
            //            success: function (data) {
            //                response($.map(data, function (item) {
            //                    return { label: item.ID + " - " + item.TenDichVu_SanPham, value: item.ID};
            //                }))
            //            }
            //        })
            //    }
            //});
            MayChoThueController.enableField(id);
        });
        $('.updateMCT').off('keypress').on('keypress', function (e) {
            var id = $(this).data('id');
            if (e.which == 13) {
                var tenmay = $('#tenmay_' + id).val();
                var model = $('#model_' + id).val();
                var congsuat = $('#congsuat_' + id).val();
                var ngaymua = $('#ngaymua_' + id).val();
                var iddichvu = $('#iddichvu_' + id).val();
                var ghichu = $('#ghichu_' + id).val();
                var status = $('#status_' + id).val();
                MayChoThueController.updateData(id, tenmay, model, congsuat, ngaymua, iddichvu , ghichu,status)
            }
        });
        //$('.col-md-10 #madichvu').autocomplete({
        //    source: function (request, response) {
        //        $.ajax({
        //            url: "/admin/BienBanNghiemThu/DropDownDV",
        //            type: "POST",
        //            dataType: "json",
        //            data: { s: request.term },
        //            success: function (data) {
        //                response($.map(data, function (item) {
        //                    return { label: item.ID + " - " + item.TenDichVu_SanPham, value: item.ID };
        //                }))
        //            }
        //        })
        //    }
        //});
        //Delete MAY
        $('.Opendialog').off('click').on('click', function (e) {
            e.preventDefault();
            var id = $(this).data('id');
            $('.xacnhan').off('click').on('click', function (f) {
                f.preventDefault();
                MayChoThueController.DeleteMay(id);
            })
            //$(".modal-body #lydo").val(id);
        });
        // Xem lich su
        $('.btnXemLichSu').off('click').on('click', function () {
            var idmay = $(this).data('idmay');
            window.location.href = "/admin/MayChoThue/LichSuSuaChua?idmay=" + idmay;
        });
        // Xem lich su
        $('.btnLichSuThue').off('click').on('click', function () {
            var idmay = $(this).data('idmay');
            window.location.href = "/admin/MayChoThue/LichSuChoThue?idmay=" + idmay;
        });
        $('.btnXemKTV').off('click').on('click', function () {
            var idbbnt = $(this).data('idbbnt');
            MayChoThueController.LoadKTV(idbbnt);
        });
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
}

MayChoThueController.init();