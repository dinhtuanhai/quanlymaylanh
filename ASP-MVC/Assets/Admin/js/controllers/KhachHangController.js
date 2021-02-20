var KhachHangController = {

    init: function () {
        KhachHangController.enableField();
        KhachHangController.registerEvent();
    },
    registerEvent: function () {
        $('.updateKH').off('keypress').on('keypress', function (e) {
            var id = $(this).data('id');
            if (e.which == 13) {
                var hoten = $('#hoten_' + id).val();
                var sdt = $('#sdt_' + id).val();
                var diachi = $('#diachi_' + id).val();
                var ngaypv = $('#ngaypv_' + id).val();
                var loai = $('#loai_' + id).val();
                KhachHangController.updateData(id, hoten, sdt, diachi, ngaypv, loai);
            }
        });
    },

    updateData: function (id, hoten, sdt, diachi, ngaypv, loai) {
        var dataObject = {
            ID: id,
            HoTen: hoten,
            SDT: sdt,
            DiaChi: diachi,
            Loai: loai
        };
        var checkconfirm = confirm("Xác nhận lưu?");
        if (checkconfirm == true) {
            $.ajax({
                url: '/admin/KhachHang/Update',
                type: 'POST',
                datatype: 'json',
                data: ({ kh: JSON.stringify(dataObject), ngaypv:ngaypv }),
                success: function (response) {
                    if (response.status) {
                        alert("Cập nhật thành công");
                        location.reload();
                    }
                    else {
                        alert("cập nhật thất bại");
                        location.reload();
                    }
                }
            })
        }
        else
            location.reload();
    },

    enableField: function () {
        $('.btnEditKH').on('click', function () {
            var id = $(this).data('idkh');
            if ($('#hoten_' + id).is(':disabled')) {
                $('#hoten_' + id).prop('disabled', false);
                $('#sdt_' + id).prop('disabled', false);
                $('#diachi_' + id).prop('disabled', false);
                $('#ngaypv_' + id).prop('disabled', false);
                $('#loai_' + id).prop('disabled', false);
                $('#icon_' + id).toggleClass('fas fa-pencil-alt fas fa-save');
            }
            else {
                $('#hoten_' + id).prop('disabled', true);
                $('#sdt_' + id).prop('disabled', true);
                $('#diachi_' + id).prop('disabled', true);
                $('#ngaypv_' + id).prop('disabled', true);
                $('#loai_' + id).prop('disabled', true);
                $('#icon_' + id).toggleClass('fas fa-save fas fa-pencil-alt');

                var hoten = $('#hoten_' + id).val();
                var sdt = $('#sdt_' + id).val();
                var diachi = $('#diachi_' + id).val();
                var ngaypv = $('#ngaypv_' + id).val();
                var loai = $('#loai_' + id).val();
                KhachHangController.updateData(id, hoten, sdt, diachi, ngaypv, loai);
            }

        });
    },

}

KhachHangController.init();