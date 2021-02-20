var phieuxuat_ktv = {
    init: function () {
        phieuxuat_ktv.registerEvents();
        phieuxuat_ktv.LapPhieu();
        phieuxuat_ktv.enableField();
    },

    registerEvents: function () {

        //Edit ct phiếu
        $('.chinhsuact').off('click').on('click', function (e) {
            e.preventDefault();
            var id = $(this).data('id');
            if ($('#valSLTra_' + id).is(':hidden')) {
                $('#valSLTra_' + id).prop('hidden', false);
                $('#SLTra_' + id).prop('hidden', true);
                $('#icon_' + id).toggleClass('fas fa-pencil-alt fas fa-save');
            }
            else {
                $('#valSLTra_' + id).prop('hidden', true);
                $('#SLTra_' + id).prop('hidden', false);
                $('#icon_' + id).toggleClass('fas fa-save fas fa-pencil-alt');

                var SLTra = $('#valSLTra_' + id).val();
                if (SLTra != "" && SLTra > 0)
                    phieuxuat_ktv.updateCT(id, SLTra);
                else
                    alert("Số lượng trả phải lớn hơn 0");
            }
        });

        $('.updateSLTra').off('keypress').on('keypress', function (e) {
            var id = $(this).data('id');
            if (e.which == 13) {
                var SLTra = $('#valSLTra_' + id).val();
                phieuxuat_ktv.updateCT(id, SLTra);
            }
        });

        $('.updatePN').off('keypress').on('keypress', function (e) {
            var id = $(this).data('id');
            if (e.which == 13) {
                var ghichu = $('#ghichu_' + id).val();
                phieuxuat_ktv.updateData(id, ghichu);
            }
        });

        $(".TaoCT").off('click').on('click', function () {
            var str = $("#IDVatTu").val().split('.');
            var idvattu = str[0];
            var soluong = $(".col-md-15 #valsoluong").val();
            var dongia = $(".col-md-15 #valdongia").val();
            if (idvattu != "" && soluong != "" && dongia != "" && idvattu > 0 && soluong > 0 && dongia > 0) {
                phieuxuat_ktv.ThemCTPN(idvattu, soluong, dongia);
                //phieuxuat_ktv.resetctbbnt();
            }
            else
                alert("Vui lòng kiểm tra thông tin: Vật tư, đơn giá (>0), số lượng (>0)");
        });

        $(document).delegate(".delct", 'click', function () {
            var id = $(this).data('id');
            $('#row_' + id).remove();
        });

        $('#IDVatTu').change(function () {
            phieuxuat_ktv.autoDonGia();
        });

        $('.Opendialog').off('click').on('click', function (e) {
            e.preventDefault();
            var id = $(this).data('id');
            $('.xacnhan').off('click').on('click', function (f) {
                f.preventDefault();
                phieuxuat_ktv.DeletePhieu(id);
            })
            //$(".modal-body #lydo").val(id);
        });
    },

    updateCT: function (id, SLTra) {
        $.ajax({
            url: '/admin/VatTu/updateCT',
            type: 'POST',
            dataType: 'json',
            data: { id: id, SLTra: SLTra },
            success: function (res) {
                if (res.status) {
                    alert(res.mess);
                    window.location.reload();
                }
                else
                    alert(res.mess);
            }
        })
    },

    DeletePhieu: function (id) {
        $.ajax({
            url: '/admin/VatTu/DeletePX_KTV',
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

    ThemCTPN: function (idvattu, soluong, dongia) {
        $.ajax({
            url: "/admin/VatTu/ThemCTPX_KTV",
            data: { idvattu: idvattu, soluong:soluong },
            dataType: "json",
            type: "POST",
            success: function (response) {
                if (response.status) {
                    var s = '<tr id="row_' + response.vattu.ID + '">' +
                        '<td class="getvalueidvattu">' + response.vattu.ID + '</td>' +
                        '<td>' + response.vattu.TenVatTu + '</td>' +
                        '<td class="getvaluesoluong">' + soluong + '</td>' +
                        '<td>' + response.vattu.DonVi + '</td>' +
                        '<td class="getvaluedongia">' + dongia + '</td>' +
                        '<td><a data-id="' + response.vattu.ID + '" class="delct btn btn-circle">X</a></td>' +
                        '</tr > ';
                    $('#tableCT').append(s);
                    phieuxuat_ktv.resetctbbnt();
                }
                else
                    alert(response.mess);
            }
        })
    },

    autoDonGia: function () {
        var str = $('#IDVatTu').val().split('.');
        var idvattu = str[0];
        if (idvattu != "" && idvattu > 0) {
            $.ajax({
                url: "/admin/VatTu/autoDonGia",
                type: "POST",
                data: { idvattu: idvattu },
                dataType: "json",
                success: function (response) {
                    if (response.status) {
                        $('#valdongia').val(response.dongia);
                    }
                }
            })
        }
    },

    resetctbbnt: function () {
        $("#IDVatTu").val('');
        $(".col-md-15 #valsoluong").val('');
        $(".col-md-15 #valdongia").val('');
    },

    LapPhieu: function () {
        $(".LapPhieu").off('click').on('click', function () {
            var table = $('#tableCT tr').length;
            if (table > 0) {
                var str = $("#IDKTV").val().split('.');
                var idktv = str[0];
                var strt = $("#IDYCPV").val().split('.');
                var idycpv = strt[0];
                var ghichu = $("#ghichu").val();

                if (idktv != "" && idktv > 0 && idycpv != "" && idycpv > 0) {

                    var checkconfirm = confirm("Xác nhận lưu?");
                    if (checkconfirm == true) {
                        phieuxuat_ktv.TaoPhieu(idktv, idycpv, ghichu);
                    }
                    //else
                    //    location.reload();
                }
                else
                    alert("Thông tin phiếu còn thiếu hoặc chọn sai!");
            }
            else
                alert("Bạn chưa nhập thông tin chi tiết");
        })
    },

    TaoPhieu: function (idktv, idycpv, ghichu) {
        $.ajax({
            url: "/admin/VatTu/TaoPhieuXuat_KTV",
            type: "POST",
            data: { idktv: idktv, idycpv:idycpv,ghichu:ghichu},
            dataType: "json",
            success: function (response) {
                if (response.status == true) {
                    phieuxuat_ktv.TaoCTPhieuXuat(response.idphieu);
                    alert("Thêm phiếu thành công");
                    window.location.href = "/admin/VatTu/PhieuXuat_KTV";
                }
            }
        })
    },

    TaoCTPhieuXuat: function (idphieu) {
        $('#tableCT tr').each(function () {

            var idvattu = $(this).find(".getvalueidvattu").html();
            var soluong = $(this).find(".getvaluesoluong").html();
            var dongia = $(this).find(".getvaluedongia").html();
            $.ajax({
                url: "/admin/VatTu/TaoCTPhieuXuat_KTV",
                data: { idphieu: idphieu, idvattu: idvattu, soluong: soluong, dongia: dongia },
                type: "POST",
                dataType: "json",
                success: function (response) {
                    if (response.status) {
                        console.log();
                    }
                    else {
                        alert(response.mess);
                    }
                }
            })
        });
        //table bên CTPhieuXuatKho

    },

    //btnEditPhieuXuat: function () {
    //    $('.btnEditPX').off('click').on('click', function () {

    //    })
    //},

    updateData: function (id, ghichu) {
        var checkconfirm = confirm("Xác nhận lưu?");
        if (checkconfirm == true) {
            $.ajax({
                url: '/admin/VatTu/UpdatePhieuXuat_KTV',
                type: 'POST',
                datatype: 'json',
                data: { id: id, ghichu: ghichu },
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
        $('.btnEditPX').on('click', function () {
            var id = $(this).data('id');
            if ($('#ghichu_' + id).is(':disabled')) {
                $('#ghichu_' + id).prop('disabled', false);
                $('#icon_' + id).toggleClass('fas fa-pencil-alt fas fa-save');
            }
            else {
                $('#ghichu_' + id).prop('disabled', true);
                $('#icon_' + id).toggleClass('fas fa-save fas fa-pencil-alt');

                var ghichu = $('#ghichu_' + id).val();
                phieuxuat_ktv.updateData(id, ghichu);
            }

        });
    },
}
phieuxuat_ktv.init();