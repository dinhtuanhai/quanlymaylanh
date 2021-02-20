var vattu = {
    init: function () {
        vattu.registerEvent();
    },
    registerEvent: function () {
        $('.Opendialog').off('click').on('click', function (e) {
            e.preventDefault();
            var id = $(this).data('id');
            $('.xacnhan').off('click').on('click', function (f) {
                f.preventDefault();
                vattu.DeleteDV(id);
            })
            //$(".modal-body #lydo").val(id);
        });

        $('.btnEditVatTu').on('click', function () {
            var id = $(this).data('id');
            vattu.enableField(id);
        });

        $('.updateVatTu').off('keypress').on('keypress', function (e) {
            var id = $(this).data('id');
            if (e.which == 13) {
                var giaban = $('#valgiaban_' + id).val();
                var donvi = $('#valdonvi_' + id).val();
                //var ghichu = $('#ghichu_' + id).val();
                vattu.updateData(id, giaban, donvi);
            }
        });
    },
    updateData: function (id, giaban, donvi) {
        var cf = confirm("Xác nhận lưu?");
        if (cf == true) {
            $.ajax({
                url: '/admin/VatTu/Update',
                type: 'POST',
                datatype: 'json',
                data: { id: id, giaban: giaban, donvi:donvi},
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
    },
    enableField: function (id) {
        if ($('#valgiaban_' + id).is(':hidden')) {
            $('#valgiaban_' + id).prop('hidden', false);
            $('#giaban_' + id).prop('hidden', true);
            $('#valdonvi_' + id).prop('hidden', false);
            $('#donvi_' + id).prop('hidden', true);
            //$('#ghichu_' + id).prop('disabled', false);
            $('#icon_' + id).toggleClass('fas fa-pencil-alt fas fa-save');
        }
        else {
            $('#valgiaban_' + id).prop('hidden', true);
            $('#giaban_' + id).prop('hidden', false);
            $('#valdonvi_' + id).prop('hidden', true);
            $('#donvi_' + id).prop('hidden', false);
            //$('#ghichu_' + id).prop('disabled', true);
            $('#icon_' + id).toggleClass('fas fa-save fas fa-pencil-alt');
            var giaban = $('#valgiaban_' + id).val();
            var donvi = $('#valdonvi_' + id).val();
            //var ghichu = $('#ghichu_' + id).val();
            vattu.updateData(id, giaban, donvi)
        }
        },

    DeleteDV: function (id) {
        $.ajax({
            url: '/admin/VatTu/Delete',
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
vattu.init();