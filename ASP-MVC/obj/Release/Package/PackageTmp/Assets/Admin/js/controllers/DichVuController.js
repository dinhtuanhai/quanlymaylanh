﻿var dichvusanpham = {

    init: function () {
        dichvusanpham.enableField();
        dichvusanpham.registerEvent();
    },
    registerEvent: function () {
        $('.updateDVSP').off('keypress').on('keypress', function (e) {
            var id = $(this).data('id');
            if (e.which == 13) {
                var tendv = $('#valtendv_' + id).val();
                var loai = $('#valloai_' + id).val();
                var dongia = $('#valdongia_' + id).val();
                var diem = $('#valdiem_' + id).val();
                dichvusanpham.updateData(id, tendv, loai,dongia,diem)
            }
        });
        $('.Opendialog').off('click').on('click', function (e) {
            e.preventDefault();
            var id = $(this).data('id');
            $('.xacnhan').off('click').on('click', function (f) {
                f.preventDefault();
                dichvusanpham.DeleteDV(id);
            })
            //$(".modal-body #lydo").val(id);
        });
        
    },
    updateData: function (id, tendv, loai,dongia, diem) {
        var dataObject = {
            ID: id,
            TenDichVu_SanPham: tendv,
            Loai: loai,
            DonGia: dongia
        };
        var checkconfirm = confirm("Xác nhận lưu?");
        if (checkconfirm == true) {
            $.ajax({
                url: '/admin/DichVu/Update',
                type: 'POST',
                datatype: 'json',
                data: ({ dvsp: JSON.stringify(dataObject), diem:diem }),
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

    enableField: function () {
        $('.btnEditDV').on('click', function () {
            var id = $(this).data('iddv');
            if ($('#valtendv_' + id).is(':hidden')) {
                $('#valdongia_' + id).prop('hidden', false);
                $('#dongia_' + id).prop('hidden', true);
                $('#valdiem_' + id).prop('hidden', false);
                $('#diem_' + id).prop('hidden', true);
                $('#valtendv_' + id).prop('hidden', false);
                $('#tendv_' + id).prop('hidden', true);
                $('#valloai_' + id).prop('disabled', false);
                $('#icon_' + id).toggleClass('fas fa-pencil-alt fas fa-save');
            }
            else {
                $('#valdongia_' + id).prop('hidden', true);
                $('#dongia_' + id).prop('hidden', false);
                $('#valdiem_' + id).prop('hidden', true);
                $('#diem_' + id).prop('hidden', false);
                $('#tendv_' + id).prop('hidden', false);
                $('#valtendv_' + id).prop('hidden', true);
                $('#valloai_' + id).prop('disabled', true);
                $('#icon_' + id).toggleClass('fas fa-save fas fa-pencil-alt');

                var tendv = $('#valtendv_' + id).val();
                var loai = $('#valloai_' + id).val();
                var dongia = $('#valdongia_' + id).val();
                var diem = $('#valdiem_' + id).val();
                dichvusanpham.updateData(id, tendv, loai, dongia,diem)
            }

        });
    },
    DeleteDV: function (id) {
        $.ajax({
            url: '/admin/DichVu/Delete',
            type: 'POST',
            dataType: 'json',
            data: { id: id},
            success: function (res) {
                if (res.status) {
                    $('#row_' + id).remove();
                }
            }
        })
    },
}

dichvusanpham.init();