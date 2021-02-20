var UserController = {

    init: function () {
        UserController.enableField();
        UserController.registerEvent();
    },

    registerEvent: function () {
        $('.updateUser').off('keypress').on('keypress', function (e) {
            var id = $(this).data('id');
            if (e.which == 13) {
                var tenktv = $('#tenktv_'+id).val();
                var sdt = $('#sdt_' + id).val();
                var loai = $('#load_' + id).val();
                var status = $('#status_' + id).val();
                UserController.updateData(id, tenktv, sdt, loai, status);
            }
        });

        //Reset 
        $('.Reset').off('click').on('click', function () {
            var idktv = $(this).data('id');
            $('.rsPass').off('click').on('click', function () {
                UserController.ResetPass(idktv);
            });
            $('.rsAll').off('click').on('click', function () {
                UserController.ResetAll(idktv);
            });
        });

        // Xem điểm KTV
        $('.XemDiem').off('click').on('click', function () {
            var idnv = $(this).data('idnv');
            UserController.LoadDiem(idnv);
        });

        //Xem dụng cụ đang mượn
        $(".dsDC").off('click').on('click', function () {
            var idktv = $(this).data('idnv');
            UserController.LoadDungCu(idktv);
        });
    },

    ResetAll: function (idktv) {
        $.ajax({
            url: "/admin/User/ResetAll",
            data: { idktv: idktv },
            dataType: "json",
            type: "POST",
            success: function (res) {
                if (res.status) {
                    alert(res.mess);
                }
            }
        })
    },

    ResetPass: function (idktv) {
        $.ajax({
            url: "/admin/User/RenewPassword",
            data: { idktv: idktv },
            dataType: "json",
            type: "POST",
            success: function (res) {
                if (res.status) {
                    alert(res.mess);
                }
            }
        })
    },

    LoadDiem: function (idnv) {
        $.ajax({
            url: "/admin/User/LoadDiem",
            data: { idnv: idnv },
            dataType: "json",
            type: "POST",
            success: function (res) {
                if (res.status) {
                    var data = res.data;
                    var html = '';
                    var template = $('#data-template').html();
                    $.each(data, function (i, item) {
                        html += Mustache.render(template, {
                            Thang: item.Thang,
                            Diem: item.Diem,
                        });
                    });
                    $('#table_body').html(html);
                }
            }
        })
    },

    //
    LoadDungCu: function (idktv) {
        $.ajax({
            url: "/admin/User/LoadDungCu",
            data: { idktv: idktv },
            dataType: "json",
            type: "POST",
            success: function (res) {
                if (res.status) {
                    var data = res.data;
                    var html = '';
                    var template = $('#data-templatedc').html();
                    if (data != "") {
                        $.each(data, function (i, item) {
                            html += Mustache.render(template, {
                                TenVatDung: item.TenDC,
                                NgayXuat: item.NgayXuat,
                                GhiChu: item.GhiChu,
                            });
                        });
                    }
                    else {
                        html += '<p style="text-align:center;column-span:2;color:blue">Không có dữ liệu</p>';
                        $('#table_bodydc').parent().html(html);
                    }
                    $('#table_bodydc').html(html);
                }
            }
        })
    },

    updateData: function (id, tenktv, sdt, loai, status) {
        var dataObject = {
            ID: id,
            TenKTV: tenktv,
            SDT: sdt,
            Loai: loai,
            Status: status
        };
        var cf = confirm("Xác nhận lưu?");
        if (cf == true) {
            $.ajax({
                url: '/admin/User/Update',
                type: 'POST',
                datatype: 'json',
                data: ({ nv: JSON.stringify(dataObject) }),
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

    enableField: function () {
        $('.btnEditNV').on('click', function () {

            var id = $(this).data('idnv');

            if ($('#tenktv_' + id).is(':disabled')) {
                    $('#tenktv_' + id).prop('disabled', false);
                    $('#sdt_' + id).prop('disabled', false);
                    $('#loai_' + id).prop('disabled', false);
                    $('#status_' + id).prop('disabled', false);
                    $('#icon_' + id).toggleClass('fas fa-pencil-alt fas fa-save');
            }
            else {
                $('#tenktv_' + id).prop('disabled', true);
                $('#sdt_' + id).prop('disabled', true);
                $('#loai_' + id).prop('disabled', true);
                $('#status_' + id).prop('disabled', true);
                $('#icon_' + id).toggleClass('fas fa-save fas fa-pencil-alt');
                var tenktv = $('#tenktv_' + id).val();
                var sdt = $('#sdt_' + id).val();
                var loai = $('#loai_' + id).val();
                var status = $('#status_' + id).val();
                UserController.updateData(id, tenktv, sdt, loai, status)
            }
               
        });
    },

}

UserController.init();