var KhoController = {

    init: function () {
        KhoController.btnDangMuon();
        KhoController.enableField();
        KhoController.registerEvent();
    },

    registerEvent: function () {
        $('.updateKho').off('keypress').on('keypress', function (e) {
            var id = $(this).data('id');
            if (e.which == 13) {
                var tenvatdung = $('#tenvatdung_' + id).val();
                var dongia = $('#dongia_' + id).val();
                var soluong = $('#soluong_' + id).val();
                var ngaymua = $('#ngaymua_' + id).val();
                var ghichu = $('#ghichu_' + id).val();
                KhoController.updateData(id, tenvatdung, dongia, soluong, ngaymua, ghichu);
            }
        });
        $('.Opendialog').off('click').on('click', function (e) {
            e.preventDefault();
            var id = $(this).data('id');
            $('.xacnhan').off('click').on('click', function (f) {
                f.preventDefault();
                KhoController.DeleteDV(id);
            })
            //$(".modal-body #lydo").val(id);
        });

        
    },
    DeleteDV: function (id) {
        $.ajax({
            url: '/admin/Kho/Delete',
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
    updateData: function (id, tenvatdung, dongia, soluong, ngaymua, ghichu) {
        var dataObject = {
            ID: id,
            TenVatDung: tenvatdung,
            DonGia: dongia,
            SoLuong: soluong,
            GhiChu: ghichu
        };
        var cf = confirm("Xác nhận lưu?");
        if (cf == true) {
            $.ajax({
                url: '/admin/Kho/Update',
                type: 'POST',
                datatype: 'json',
                data: ({ kho: JSON.stringify(dataObject), ngaymua: ngaymua }),
                success: function (response) {
                    if (response.status) {
                        alert("Cập nhập thành công");
                        location.reload();
                    }
                    else {
                        alert("Cập nhập thất bại");
                        location.reload();
                    }
                }
            })
        }
        else
            location.reload();
    },
    btnDangMuon: function () {
        $('.btnDangMuon').off('click').on('click', function () {
            var idvatdung = $(this).data('id');
            $.ajax({
                url: '/admin/Kho/btnDangMuon',
                type: 'POST',
                datatype: 'json',
                data: { idvatdung: idvatdung },
                success: function (response) {
                    if (response.status) {
                        var idpx = response.idphieuxuat;
                        window.location.href = "/admin/Kho/CTPhieuXuatKho?idphieuxuat=" + idpx;
                    }
                    else {
                        alert("Có lỗi !");
                    }
                }
            })
        })
    },
    enableField: function () {
        $('.btnEditkho').on('click', function () {

            var id = $(this).data('id');
            if ($('#tenvatdung_' + id).is(':disabled')) {
                $('#tenvatdung_' + id).prop('disabled', false);
                $('#dongia_' + id).prop('disabled', false);
                $('#soluong_' + id).prop('disabled', false);
                $('#ngaymua_' + id).prop('disabled', false);
                $('#ghichu_' + id).prop('disabled', false);
                $('#icon_' + id).toggleClass('fas fa-pencil-alt fas fa-save');
            }
            else {
                $('#tenvatdung_' + id).prop('disabled', true);
                $('#dongia_' + id).prop('disabled', true);
                $('#soluong_' + id).prop('disabled', true);
                $('#ngaymua_' + id).prop('disabled', true);
                $('#ghichu_' + id).prop('disabled', true);
                $('#icon_' + id).toggleClass('fas fa-save fas fa-pencil-alt');
                var tenvatdung = $('#tenvatdung_' + id).val();
                var dongia = $('#dongia_' + id).val();
                var soluong = $('#soluong_' + id).val();
                var ngaymua = $('#ngaymua_' + id).val();
                var ghichu = $('#ghichu_' + id).val();
                KhoController.updateData(id, tenvatdung, dongia, soluong, ngaymua, ghichu)
            }

        });
    },
    
}

KhoController.init();